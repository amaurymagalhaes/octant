from decimal import Decimal
from random import randint
from typing import Optional, List
from unittest.mock import MagicMock, Mock

import pytest
from eth_account import Account
from flask import g as request_context
from gql import Client
from web3 import Web3

from tests.helpers.gql_client import MockGQLClient
from app import create_app, database
from app.contracts.epochs import Epochs
from app.contracts.proposals import Proposals
from app.contracts.vault import Vault
from app.controllers.allocations import allocate, deserialize_payload
from app.core.allocations import AllocationRequest, Allocation
from app.core.rewards.rewards import calculate_matched_rewards
from app.crypto.eip712 import sign, build_allocations_eip712_data
from app.extensions import db, w3
from app.settings import TestConfig

# Consts
MNEMONIC = "test test test test test test test test test test test junk"
MOCKED_PENDING_EPOCH_NO = 1
MOCKED_CURRENT_EPOCH_NO = 2
ETH_PROCEEDS = 402_410958904_110000000
TOTAL_ED = 100022700_000000000_099999994
USER1_ED = 1500_000055377_000000000
USER2_ED = 5500_000000000_000000000
USER3_ED = 2000_000000000_000000000
USER1_BUDGET = 1526868_989237987
USER2_BUDGET = 5598519_420519815
USER3_BUDGET = 2035825_243825387

LOCKED_RATIO = Decimal("0.100022700000000000099999994")
TOTAL_REWARDS = 321_928767123_288031232
ALL_INDIVIDUAL_REWARDS = 101_814368807_786782825
USER1_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
USER2_ADDRESS = "0x2345678901234567890123456789012345678904"

# Contracts mocks
MOCK_EPOCHS = MagicMock(spec=Epochs)
MOCK_PROPOSALS = MagicMock(spec=Proposals)
MOCK_VAULT = MagicMock(spec=Vault)

# Other mocks
MOCK_GET_ETH_BALANCE = MagicMock()
MOCK_GET_USER_BUDGET = Mock()
MOCK_HAS_PENDING_SNAPSHOT = Mock()
MOCK_EIP1271_IS_VALID_SIGNATURE = Mock()
MOCK_IS_CONTRACT = Mock()
MOCK_MATCHED_REWARDS = MagicMock(spec=calculate_matched_rewards)


@pytest.fixture(scope="function")
def app():
    """An application for the tests."""
    _app = create_app(TestConfig)

    with _app.app_context():
        db.create_all()

    ctx = _app.test_request_context()
    ctx.push()

    yield _app, db

    db.session.close()
    db.drop_all()
    ctx.pop()


@pytest.fixture(scope="function")
def graphql_client(app):
    request_context.graphql_client = Client()


@pytest.fixture(scope="function")
def user_accounts():
    w3.eth.account.enable_unaudited_hdwallet_features()
    return [
        w3.eth.account.from_mnemonic(MNEMONIC, account_path=f"m/44'/60'/0'/0/{i}")
        for i in range(10)
    ]


@pytest.fixture(scope="function")
def tos_users(user_accounts):
    for acc in user_accounts:
        database.user_consents.add_consent(acc.address, "127.0.0.1")
    return user_accounts


@pytest.fixture(scope="function")
def proposal_accounts():
    w3.eth.account.enable_unaudited_hdwallet_features()
    return [
        w3.eth.account.from_mnemonic(MNEMONIC, account_path=f"m/44'/60'/0'/0/{i}")
        for i in range(10, 20)
    ]


@pytest.fixture(scope="function")
def patch_epochs(monkeypatch):
    monkeypatch.setattr("app.controllers.allocations.epochs", MOCK_EPOCHS)
    monkeypatch.setattr("app.controllers.snapshots.epochs", MOCK_EPOCHS)
    monkeypatch.setattr("app.controllers.rewards.epochs", MOCK_EPOCHS)
    monkeypatch.setattr("app.controllers.epochs.epochs", MOCK_EPOCHS)
    monkeypatch.setattr("app.core.proposals.epochs", MOCK_EPOCHS)
    monkeypatch.setattr("app.core.user.budget.epochs", MOCK_EPOCHS)
    monkeypatch.setattr("app.core.epochs.details.epochs", MOCK_EPOCHS)

    MOCK_EPOCHS.get_pending_epoch.return_value = MOCKED_PENDING_EPOCH_NO
    MOCK_EPOCHS.get_current_epoch.return_value = MOCKED_CURRENT_EPOCH_NO
    # props content: from, to, fromTs, duration, decisionWindow
    MOCK_EPOCHS.get_future_epoch_props.return_value = [
        2,
        0,
        1697731200,
        7776000,
        1209600,
    ]


@pytest.fixture(scope="function")
def patch_proposals(monkeypatch, proposal_accounts):
    monkeypatch.setattr("app.core.allocations.proposals", MOCK_PROPOSALS)
    monkeypatch.setattr("app.core.proposals.proposals", MOCK_PROPOSALS)

    MOCK_PROPOSALS.get_proposal_addresses.return_value = [
        p.address for p in proposal_accounts
    ]


@pytest.fixture(scope="function")
def patch_vault(monkeypatch):
    monkeypatch.setattr("app.controllers.withdrawals.vault", MOCK_VAULT)
    MOCK_VAULT.get_last_claimed_epoch.return_value = 0


@pytest.fixture(scope="function")
def patch_is_contract(monkeypatch):
    monkeypatch.setattr("app.crypto.eth_sign.signature.is_contract", MOCK_IS_CONTRACT)
    MOCK_IS_CONTRACT.return_value = False


@pytest.fixture(scope="function")
def patch_eip1271_is_valid_signature(monkeypatch):
    monkeypatch.setattr(
        "app.crypto.eth_sign.signature.is_valid_signature",
        MOCK_EIP1271_IS_VALID_SIGNATURE,
    )
    MOCK_EIP1271_IS_VALID_SIGNATURE.return_value = True


@pytest.fixture(scope="function")
def patch_eth_get_balance(monkeypatch):
    mock_eth = MagicMock(get_balance=MOCK_GET_ETH_BALANCE)
    mock_web3 = MagicMock(spec=Web3, eth=mock_eth)

    monkeypatch.setattr("app.controllers.snapshots.w3", mock_web3)
    MOCK_GET_ETH_BALANCE.return_value = ETH_PROCEEDS


@pytest.fixture(scope="function")
def patch_has_pending_epoch_snapshot(monkeypatch):
    (
        monkeypatch.setattr(
            "app.core.allocations.has_pending_epoch_snapshot", MOCK_HAS_PENDING_SNAPSHOT
        ),
        monkeypatch.setattr(
            "app.controllers.rewards.has_pending_epoch_snapshot",
            MOCK_HAS_PENDING_SNAPSHOT,
        ),
    )
    MOCK_HAS_PENDING_SNAPSHOT.return_value = True


@pytest.fixture(scope="function")
def patch_user_budget(monkeypatch):
    monkeypatch.setattr("app.core.allocations.get_budget", MOCK_GET_USER_BUDGET)
    MOCK_GET_USER_BUDGET.return_value = 10 * 10**18 * 10**18


@pytest.fixture(scope="function")
def patch_matched_rewards(monkeypatch):
    monkeypatch.setattr(
        "app.controllers.rewards.get_estimated_matched_rewards", MOCK_MATCHED_REWARDS
    )
    monkeypatch.setattr(
        "app.core.proposals.get_estimated_matched_rewards", MOCK_MATCHED_REWARDS
    )
    MOCK_MATCHED_REWARDS.return_value = 10_000000000_000000000


@pytest.fixture(scope="function")
def mock_pending_epoch_snapshot_db(app, user_accounts):
    database.pending_epoch_snapshot.add_snapshot(
        MOCKED_PENDING_EPOCH_NO,
        ETH_PROCEEDS,
        TOTAL_ED,
        LOCKED_RATIO,
        TOTAL_REWARDS,
        ALL_INDIVIDUAL_REWARDS,
    )
    user1 = database.user.get_or_add_user(user_accounts[0].address)
    user2 = database.user.get_or_add_user(user_accounts[1].address)
    user3 = database.user.get_or_add_user(user_accounts[2].address)
    database.deposits.add(MOCKED_PENDING_EPOCH_NO, user1, USER1_ED, USER1_ED)
    database.deposits.add(MOCKED_PENDING_EPOCH_NO, user2, USER2_ED, USER2_ED)
    database.deposits.add(MOCKED_PENDING_EPOCH_NO, user3, USER3_ED, USER3_ED)
    db.session.commit()


@pytest.fixture(scope="function")
def mock_allocations_db(app, user_accounts, proposal_accounts):
    user1 = database.user.get_or_add_user(user_accounts[0].address)
    user2 = database.user.get_or_add_user(user_accounts[1].address)
    db.session.commit()

    user1_allocations = [
        Allocation(proposal_accounts[0].address, 10 * 10**18),
        Allocation(proposal_accounts[1].address, 5 * 10**18),
        Allocation(proposal_accounts[2].address, 300 * 10**18),
    ]

    user1_allocations_prev_epoch = [
        Allocation(proposal_accounts[0].address, 101 * 10**18),
        Allocation(proposal_accounts[1].address, 51 * 10**18),
        Allocation(proposal_accounts[2].address, 3001 * 10**18),
    ]

    user2_allocations = [
        Allocation(proposal_accounts[1].address, 1050 * 10**18),
        Allocation(proposal_accounts[3].address, 500 * 10**18),
    ]

    user2_allocations_prev_epoch = [
        Allocation(proposal_accounts[1].address, 10501 * 10**18),
        Allocation(proposal_accounts[3].address, 5001 * 10**18),
    ]

    database.allocations.add_all(
        MOCKED_PENDING_EPOCH_NO - 1, user1.id, 0, user1_allocations_prev_epoch
    )
    database.allocations.add_all(
        MOCKED_PENDING_EPOCH_NO - 1, user2.id, 0, user2_allocations_prev_epoch
    )

    database.allocations.add_all(
        MOCKED_PENDING_EPOCH_NO, user1.id, 1, user1_allocations
    )
    database.allocations.add_all(
        MOCKED_PENDING_EPOCH_NO, user2.id, 1, user2_allocations
    )

    db.session.commit()


def allocate_user_rewards(
    user_account: Account, proposal_account, allocation_amount, nonce: int = 0
):
    payload = create_payload([proposal_account], [allocation_amount], nonce)
    signature = sign(user_account, build_allocations_eip712_data(payload))
    request = AllocationRequest(payload, signature, override_existing_allocations=False)

    allocate(request)


def create_payload(proposals, amounts: Optional[List[int]], nonce: int = 0):
    if amounts is None:
        amounts = [randint(1 * 10**18, 100_000_000 * 10**18) for _ in proposals]

    allocations = [
        {
            "proposalAddress": proposal.address,
            "amount": str(amount),
        }
        for proposal, amount in zip(proposals, amounts)
    ]

    return {"allocations": allocations, "nonce": nonce}


def deserialize_allocations(payload) -> List[Allocation]:
    return deserialize_payload(payload)[1]


def create_deposit_event(
    typename="Locked",
    deposit_before="0",
    amount="100000000000000000000",
    user=USER1_ADDRESS,
    **kwargs,
):
    return {
        "__typename": typename,
        "depositBefore": deposit_before,
        "amount": amount,
        "user": user,
        **kwargs,
    }


def create_epoch_event(
    start=1000, end=2000, duration=1000, decision_window=500, **kwargs
):
    return {
        "fromTs": start,
        "toTs": end,
        "duration": duration,
        "decisionWindow": decision_window,
        **kwargs,
    }


def _split_deposit_events(deposit_events):
    deposit_events = deposit_events if deposit_events is not None else []

    locks_events = []
    unlocks_events = []
    timestamp = 1001
    for event in deposit_events:
        if event["__typename"] == "Locked":
            locks_events.append(
                {
                    "depositBefore": "0",
                    "timestamp": timestamp,
                    "user": USER1_ADDRESS,
                    **event,
                }
            )
        else:
            unlocks_events.append(
                {
                    "depositBefore": "0",
                    "timestamp": timestamp,
                    "user": USER1_ADDRESS,
                    **event,
                }
            )
        timestamp += 1
    return locks_events, unlocks_events


def mock_graphql(
    mocker,
    deposit_events=None,
    epochs_events=None,
    withdrawals_events=None,
):
    lockeds, unlockeds = _split_deposit_events(deposit_events)
    # Mock the execute method of the GraphQL client
    mock_client = MockGQLClient(
        epoches=epochs_events,
        lockeds=lockeds,
        unlockeds=unlockeds,
        withdrawals=withdrawals_events,
    )
    mocker.patch.object(request_context.graphql_client, "execute")
    request_context.graphql_client.execute.side_effect = mock_client.execute
