from datetime import datetime

import pytest

from app import exceptions, db
from app.exceptions import UserNotFound
from app.infrastructure import database
from app.modules.common.delegation import get_hashed_addresses
from app.modules.user.antisybil.service.initial import GitcoinPassportAntisybil
from tests.helpers.context import get_context


@pytest.fixture(autouse=True)
def before(app):
    pass


def test_antisybil_service(
    patch_gitcoin_passport_issue_address_for_scoring,
    patch_gitcoin_passport_fetch_score,
    patch_gitcoin_passport_fetch_stamps,
    mock_users_db,
):
    context = get_context(4)

    service = GitcoinPassportAntisybil()

    unknown_address = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720"
    try:
        service.get_antisybil_status(context, unknown_address)
    except UserNotFound:
        pass  # expected

    alice, _, _ = mock_users_db
    assert service.get_antisybil_status(context, alice.address) is None

    score, expires_at, stamps = service.fetch_antisybil_status(context, alice.address)
    assert score == 2.572
    assert len(stamps) == 2

    service.update_antisybil_status(context, alice.address, score, expires_at, stamps)

    score, _ = service.get_antisybil_status(context, alice.address)
    assert score == 2.572


def test_antisybil_cant_be_update_when_address_is_delegated(alice, bob):
    context = get_context(4)
    score = 2.572
    primary, secondary, both = get_hashed_addresses(alice.address, bob.address)
    database.score_delegation.save_delegation(primary, secondary, both)
    db.session.commit()

    service = GitcoinPassportAntisybil()

    with pytest.raises(exceptions.AddressAlreadyDelegated):
        service.update_antisybil_status(
            context, alice.address, score, datetime.now(), {}
        )

    with pytest.raises(exceptions.AddressAlreadyDelegated):
        service.update_antisybil_status(context, bob.address, score, datetime.now(), {})
