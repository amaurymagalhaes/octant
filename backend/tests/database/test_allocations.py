from app import database
from tests.conftest import MOCKED_PENDING_EPOCH_NO


def test_get_all_by_epoch_group_by_user_address(
    allocations, user_accounts, proposal_accounts
):
    result = database.allocations.get_alloc_sum_by_epoch_and_user_address(
        MOCKED_PENDING_EPOCH_NO
    )

    assert len(result) == 2
    assert result[0].address == user_accounts[1].address
    assert result[0].amount == 1550 * 10**18
    assert result[1].address == user_accounts[0].address
    assert result[1].amount == 315 * 10**18
