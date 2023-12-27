from dataclasses import dataclass

from app.v2.context.context import Context


@dataclass
class SavedStakingProceeds:
    def get_staking_proceeds(self, context: Context) -> int:
        return context.octant_rewards.eth_proceeds
