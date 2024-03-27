import pytest
from freezegun import freeze_time

from app.extensions import db
from app.infrastructure import database
from app.modules.common.time import from_timestamp_s
from app.modules.dto import (
    AllocationItem,
    ProposalDonationDTO,
    UserAllocationRequestPayload,
    UserAllocationPayload,
)
from app.modules.user.allocations.controller import revoke_previous_allocation
from app.modules.user.allocations.service.saved import SavedUserAllocations

from tests.helpers.context import get_context


@pytest.fixture(autouse=True)
def before(app):
    pass


@pytest.fixture()
def service():
    return SavedUserAllocations()


@pytest.fixture()
def make_user_allocation(proposal_accounts):
    def _make_user_allocation(context, user, allocations=1, nonce=0, **kwargs):
        database.allocations.soft_delete_all_by_epoch_and_user_id(
            context.epoch_details.epoch_num, user.id
        )

        allocation_items = [
            AllocationItem(proposal_accounts[i].address, (i + 1) * 100)
            for i in range(allocations)
        ]

        if kwargs.get("allocation_items"):
            allocation_items = kwargs.get("allocation_items")

        request = UserAllocationRequestPayload(
            payload=UserAllocationPayload(allocations=allocation_items, nonce=nonce),
            signature="0xdeadbeef",
        )

        database.allocations.store_allocation_request(
            user.address, context.epoch_details.epoch_num, request, **kwargs
        )

        return allocation_items

    return _make_user_allocation


def _alloc_item_to_donation(item, user):
    return ProposalDonationDTO(user.address, item.amount, item.proposal_address)


def test_get_all_donors_addresses(service, mock_users_db, make_user_allocation):
    user1, user2, user3 = mock_users_db
    context_epoch_1 = get_context(1)
    context_epoch_2 = get_context(2)

    make_user_allocation(context_epoch_1, user1)
    make_user_allocation(context_epoch_1, user2)
    make_user_allocation(context_epoch_2, user3)

    result_epoch_1 = service.get_all_donors_addresses(context_epoch_1)
    result_epoch_2 = service.get_all_donors_addresses(context_epoch_2)

    assert result_epoch_1 == [user1.address, user2.address]
    assert result_epoch_2 == [user3.address]


def test_return_only_not_removed_allocations(
    service, mock_users_db, make_user_allocation
):
    user1, user2, _ = mock_users_db

    context = get_context(1)
    make_user_allocation(context, user1)
    make_user_allocation(context, user2)
    database.allocations.soft_delete_all_by_epoch_and_user_id(1, user2.id)

    result = service.get_all_donors_addresses(context)

    assert result == [user1.address]


def test_get_user_allocation_sum(service, context, mock_users_db, make_user_allocation):
    user1, user2, _ = mock_users_db
    make_user_allocation(context, user1, allocations=2)
    make_user_allocation(context, user2, allocations=2)

    result = service.get_user_allocation_sum(context, user1.address)

    assert result == 300


def test_has_user_allocated_rewards(
    service, context, mock_users_db, make_user_allocation
):
    user1, _, _ = mock_users_db
    make_user_allocation(context, user1)

    result = service.has_user_allocated_rewards(context, user1.address)

    assert result is True


def test_has_user_allocated_rewards_returns_false(
    service, context, mock_users_db, make_user_allocation
):
    user1, user2, _ = mock_users_db

    make_user_allocation(context, user1)  # other user makes an allocation

    result = service.has_user_allocated_rewards(context, user2.address)

    assert result is False


@freeze_time("2024-03-18 00:00:00")
def test_user_allocations_by_timestamp(context, mock_users_db, proposal_accounts):
    user1, _, _ = mock_users_db
    timestamp_before = from_timestamp_s(1710719999)
    timestamp_after = from_timestamp_s(1710720001)

    allocation = [
        AllocationDTO(proposal_accounts[0].address, 100),
        AllocationDTO(proposal_accounts[1].address, 100),
    ]
    database.allocations.add_all(1, user1.id, 0, allocation)
    db.session.commit()

    service = SavedUserAllocations()

    result_before = service.get_user_allocations_by_timestamp(
        user1.address, from_timestamp=timestamp_before, limit=20
    )
    result_after = service.get_user_allocations_by_timestamp(
        user1.address, from_timestamp=timestamp_after, limit=20
    )
    result_after_with_limit = service.get_user_allocations_by_timestamp(
        user1.address, from_timestamp=timestamp_after, limit=1
    )

    assert result_before == []
    assert result_after == [
        AllocationItem(
            project_address=proposal_accounts[0].address,
            epoch=1,
            amount=100,
            timestamp=from_timestamp_s(1710720000),
        ),
        AllocationItem(
            project_address=proposal_accounts[1].address,
            epoch=1,
            amount=100,
            timestamp=from_timestamp_s(1710720000),
        ),
    ]
    assert result_after_with_limit == [
        AllocationItem(
            project_address=proposal_accounts[0].address,
            epoch=1,
            amount=100,
            timestamp=from_timestamp_s(1710720000),
        )
    ]
def test_get_all_allocations_returns_empty_list_when_no_allocations(
    service, context, mock_users_db
):
    user1, _, _ = mock_users_db

    assert service.get_all_allocations(context) == []


def test_get_all_allocations_returns_list_of_allocations(
    service, context, mock_users_db, make_user_allocation
):
    user1, user2, _ = mock_users_db

    user1_allocations = make_user_allocation(context, user1, allocations=2)
    user2_allocations = make_user_allocation(context, user2, allocations=2)
    user1_donations = [_alloc_item_to_donation(a, user1) for a in user1_allocations]
    user2_donations = [_alloc_item_to_donation(a, user2) for a in user2_allocations]
    expected_results = user1_donations + user2_donations

    result = service.get_all_allocations(context)

    assert len(result) == 4
    for i in result:
        assert i in expected_results


def test_get_all_allocations_does_not_include_revoked_allocations_in_returned_list(
    service, context, mock_users_db, make_user_allocation
):
    user1, user2, _ = mock_users_db

    make_user_allocation(context, user1, allocations=2)
    database.allocations.soft_delete_all_by_epoch_and_user_id(
        context.epoch_details.epoch_num, user1.id
    )

    user2_allocations = make_user_allocation(context, user2, allocations=2)
    expected_results = [_alloc_item_to_donation(a, user2) for a in user2_allocations]

    result = service.get_all_allocations(context)

    assert len(result) == 2
    for i in result:
        assert i in expected_results


def test_get_all_allocations_does_not_return_allocations_from_previous_and_future_epochs(
    service, context, mock_users_db, make_user_allocation
):
    user1, _, _ = mock_users_db
    context_epoch_1 = get_context(1)
    context_epoch_2 = get_context(2)
    context_epoch_3 = get_context(3)

    make_user_allocation(context_epoch_1, user1)
    make_user_allocation(context_epoch_3, user1, nonce=1)

    assert service.get_all_allocations(context_epoch_2) == []


def test_get_all_with_allocation_amount_equal_0(
    service, context, mock_users_db, proposal_accounts, make_user_allocation
):
    user1, _, _ = mock_users_db
    allocation_items = [AllocationItem(proposal_accounts[0].address, 0)]
    make_user_allocation(context, user1, allocation_items=allocation_items)
    expected_result = [_alloc_item_to_donation(a, user1) for a in allocation_items]

    assert service.get_all_allocations(context) == expected_result


def test_get_last_user_allocation_when_no_allocation(
    service, context, alice, make_user_allocation
):
    assert service.get_last_user_allocation(context, alice.address) == ([], None)


def test_get_last_user_allocation_returns_the_only_allocation(
    service, context, mock_users_db, make_user_allocation
):
    user1, _, _ = mock_users_db
    expected_result = make_user_allocation(context, user1)

    assert service.get_last_user_allocation(context, user1.address) == (
        expected_result,
        None,
    )


def test_get_last_user_allocation_returns_the_only_the_last_allocation(
    service, context, mock_users_db, make_user_allocation
):
    user1, _, _ = mock_users_db
    _ = make_user_allocation(context, user1)
    expected_result = make_user_allocation(context, user1, allocations=10, nonce=1)

    assert service.get_last_user_allocation(context, user1.address) == (
        expected_result,
        None,
    )


def test_get_last_user_allocation_returns_stored_metadata(
    service, context, mock_users_db, make_user_allocation
):
    user1, _, _ = mock_users_db

    expected_result = make_user_allocation(context, user1, is_manually_edited=False)
    assert service.get_last_user_allocation(context, user1.address) == (
        expected_result,
        False,
    )

    expected_result = make_user_allocation(
        context, user1, nonce=1, is_manually_edited=True
    )
    assert service.get_last_user_allocation(context, user1.address) == (
        expected_result,
        True,
    )
