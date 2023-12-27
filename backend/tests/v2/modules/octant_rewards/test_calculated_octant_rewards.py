from decimal import Decimal

from app.v2.modules.octant_rewards.service.impl.calculated import CalculatedOctantRewards
from tests.conftest import ETH_PROCEEDS, TOTAL_ED
from tests.helpers.context import get_context


def test_calculate_octant_rewards(mock_staking_proceeds, mock_user_deposits):
    context = get_context()
    service = CalculatedOctantRewards(mock_staking_proceeds, mock_user_deposits)

    result = service.get_octant_rewards(context)

    assert result.eth_proceeds == ETH_PROCEEDS
    assert result.locked_ratio == Decimal("0.100022700000000000099999994")
    assert result.total_effective_deposit == TOTAL_ED
    assert result.total_rewards == 127_267961009_733466185
    assert result.individual_rewards == 40_250230619_178123337
