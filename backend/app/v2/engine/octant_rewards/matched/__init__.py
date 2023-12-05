from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class MatchedRewardsPayload:
    total_rewards: int = None
    all_individual_rewards: int = None
    patrons_rewards: int = None


class MatchedRewards(ABC):
    @abstractmethod
    def calculate_matched_rewards(self, payload: MatchedRewardsPayload) -> int:
        pass
