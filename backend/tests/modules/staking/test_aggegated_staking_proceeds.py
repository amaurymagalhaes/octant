import pytest

from app.modules.staking.proceeds.service.aggregated import AggregatedStakingProceeds
from tests.helpers.context import get_context


@pytest.fixture(autouse=True)
def before(app):
    pass


def test_aggregated_staking_proceeds(patch_etherscan_api):
    context = get_context(1)

    service = AggregatedStakingProceeds()
    result = service.get_staking_proceeds(context)

    assert result == 68311976_811131780
