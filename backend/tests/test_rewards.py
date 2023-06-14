from unittest.mock import MagicMock

import pytest
from eth_account import Account

from app import database
from app.contracts.proposals import Proposals
from app.contracts.epochs import Epochs
from app.controllers.rewards import (
    get_user_budget,
    get_allocation_threshold,
    get_rewards_budget,
    get_proposals_rewards,
)
from app.core.allocations import calculate_threshold, allocate_single_record
from app.core.rewards import (
    calculate_total_rewards,
    calculate_all_individual_rewards,
    calculate_matched_rewards,
    get_matched_rewards_from_epoch,
)
from app.core.allocations import allocate
from .test_allocations import (
    sign,
    create_payload,
    build_allocations_eip712_data,
    deserialize_payload,
)

from decimal import Decimal


MOCKED_EPOCH_NO = 42


@pytest.mark.parametrize(
    "eth_proceeds,staked_ratio,expected",
    [
        (4_338473610_477382755, Decimal("0.0000004"), 2743891_635528535),
        (600_000000000_000000000, Decimal("0.0003298799699"), 10_897558862_607717064),
        (10_000000000_000000000, Decimal("0.43"), 6_557438524_302000652),
        (1200_000000000_000000000, Decimal("1"), 1200_000000000_000000000),
    ],
)
def test_calculate_total_rewards(eth_proceeds, staked_ratio, expected):
    result = calculate_total_rewards(eth_proceeds, staked_ratio)
    assert result == expected


@pytest.mark.parametrize(
    "eth_proceeds,staked_ratio,expected",
    [
        (4_338473610_477382755, Decimal("0.0000004"), 1735_389444190),
        (600_000000000_000000000, Decimal("0.0003298799699"), 197927981_940000000),
        (10_000000000_000000000, Decimal("0.43"), 4_300000000_000000000),
        (1200_000000000_000000000, Decimal("1"), 1200_000000000_000000000),
    ],
)
def test_calculate_all_individual_rewards(eth_proceeds, staked_ratio, expected):
    result = calculate_all_individual_rewards(eth_proceeds, staked_ratio)
    assert result == expected


def test_get_user_budget(app):
    user_address = "0xabcdef7890123456789012345678901234567893"
    glm_supply = 1000000000_000000000_000000000
    eth_proceeds = 402_410958904_110000000
    total_ed = 22700_000000000_099999994
    user_ed = 1500_000055377_000000000
    staked_ratio = Decimal("0.000022700000000000099999994")
    total_rewards = 1_917267577_180363384
    all_individual_rewards = 9134728_767123337
    expected_result = 603616_460640476

    database.epoch_snapshot.add_snapshot(
        1,
        glm_supply,
        eth_proceeds,
        total_ed,
        staked_ratio,
        total_rewards,
        all_individual_rewards,
    )
    user = database.user.add_user(user_address)
    database.deposits.add_deposit(1, user, user_ed, user_ed)

    result = get_user_budget(user_address, 1)

    assert result == expected_result


@pytest.fixture(autouse=True)
def patch_epochs_and_proposals(monkeypatch):
    mock_epochs = MagicMock(spec=Epochs)
    mock_proposals = MagicMock(spec=Proposals)

    mock_epochs.get_pending_epoch.return_value = MOCKED_EPOCH_NO

    mock_proposals.get_proposal_addresses.return_value = [
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000004",
        "0x0000000000000000000000000000000000000005",
    ]

    monkeypatch.setattr("app.core.proposals.proposals", mock_proposals)
    monkeypatch.setattr("app.core.proposals.epochs", mock_epochs)
    monkeypatch.setattr("app.controllers.rewards.epochs", mock_epochs)
    monkeypatch.setattr("app.core.allocations.epochs", mock_epochs)


def test_get_allocation_threshold(app, user_accounts, proposal_accounts):
    total_allocated = _allocate_random_individual_rewards(
        user_accounts, proposal_accounts
    )

    assert get_allocation_threshold(None) == calculate_threshold(total_allocated, 5)


def test_get_rewards_budget(app, user_accounts, proposal_accounts):
    glm_supply = 1000000000_000000000_000000000
    eth_proceeds = 402_410958904_110000000
    total_ed = 22700_000000000_099999994
    staked_ratio = Decimal("0.000022700000000000099999994")
    total_rewards = 1_917267577_180363384
    all_individual_rewards = 9134728_767123337

    database.epoch_snapshot.add_snapshot(
        MOCKED_EPOCH_NO,
        glm_supply,
        eth_proceeds,
        total_ed,
        staked_ratio,
        total_rewards,
        all_individual_rewards,
    )

    expected_matched = get_matched_rewards_from_epoch(MOCKED_EPOCH_NO)
    total_allocated = _allocate_random_individual_rewards(
        user_accounts, proposal_accounts
    )

    rewards = get_rewards_budget(None)

    assert rewards.epoch == MOCKED_EPOCH_NO
    assert rewards.allocated == total_allocated
    assert rewards.matched == expected_matched


@pytest.mark.parametrize(
    #     The structure of these parameters is as follows
    #
    #     dict { int : List[(str, int)] }
    #             \           \     \______ allocation amount
    #              \           \___________ account index of one of the accounts generated
    #               \                       by proposal_accounts() fixture
    #                \_____________________ account index of one of the accounts generated
    #                                       by user_accounts() fixture
    #
    #     dict { int : int }
    #             \      \__________________ calculated matched reward for the proposal
    #              \________________________ account index of one of the accounts generated
    #                                        by proposal_accounts() fixture
    "user_allocations, expected_matches",
    [
        (
            {
                0: [
                    (1, 3_000000000_000000000),
                    (2, 1_000000000_000000000),
                    (3, 1_000000000_000000000),
                ],
                1: [(1, 2_000000000_000000000), (3, 4_000000000_000000000)],
            },
            {
                1: 5_000000000_000000000,
                2: 0,
                3: 5_000000000_000000000,
            },
        ),
        # ------------------------------------
        (
            {
                0: [
                    (1, 3_000000000_000000000),
                    (2, 2_000000000_000000000),
                    (3, 1_000000000_000000000),
                ],
                1: [(1, 2_000000000_000000000), (3, 4_000000000_000000000)],
            },
            {
                1: 4_166666666_666666666,
                2: 1_666666666_666666666,
                3: 4_166666666_666666666,
            },
        ),
    ],
)
def test_proposals_matched_rewards(
    app,
    monkeypatch,
    user_accounts,
    proposal_accounts,
    user_allocations: dict,
    expected_matches: dict,
):
    mock_matched_rewards = MagicMock(spec=calculate_matched_rewards)
    mock_matched_rewards.return_value = 10_000000000_000000000

    monkeypatch.setattr(
        "app.controllers.rewards.get_matched_rewards_from_epoch", mock_matched_rewards
    )

    for user_index, allocations in user_allocations.items():
        user_account = user_accounts[user_index]

        for allocation in allocations:
            proposal_account: Account = proposal_accounts[allocation[0]]
            allocation_amount = allocation[1]

            _allocate_user_rewards(user_account, proposal_account, allocation_amount)

    expected_rewards = {}

    for proposal_index, expected_reward in expected_matches.items():
        proposal_address = proposal_accounts[proposal_index].address
        expected_rewards[proposal_address] = expected_reward

    for proposal in get_proposals_rewards(MOCKED_EPOCH_NO):
        assert expected_rewards.get(proposal.address) == proposal.matched


def _allocate_user_rewards(user_account: Account, proposal_account, allocation_amount):
    payload = create_payload([proposal_account], [allocation_amount])
    signature = sign(user_account, build_allocations_eip712_data(payload))

    allocate_single_record(payload, signature)


def _allocate_random_individual_rewards(user_accounts, proposal_accounts) -> int:
    """
    Allocates individual rewards from 2 users for 5 projects total

    Returns the sum of these allocations
    """
    payload1 = create_payload(proposal_accounts[0:2], None)
    signature1 = sign(user_accounts[0], build_allocations_eip712_data(payload1))

    payload2 = create_payload(proposal_accounts[0:3], None)
    signature2 = sign(user_accounts[1], build_allocations_eip712_data(payload2))

    # Call allocate method for both users
    allocate(payload1, signature1)
    allocate(payload2, signature2)

    allocations1 = sum([int(a.amount) for a in deserialize_payload(payload1)])
    allocations2 = sum([int(a.amount) for a in deserialize_payload(payload2)])

    return allocations1 + allocations2
