from dataclasses import field, dataclass
from decimal import Decimal

from app.engine.projects import ProjectRewards
from app.engine.projects.rewards import (
    ProjectRewardsPayload,
    ProjectRewardsResult,
    ProjectRewardDTO,
)
from app.engine.projects.rewards.allocations import (
    ProjectAllocations,
    ProjectAllocationsPayload,
)
from app.engine.projects.rewards.allocations.quadratic_funding import (
    QuadraticFundingAllocations,
)


@dataclass
class QuadraticFundingProjectRewards(ProjectRewards):
    projects_allocations: ProjectAllocations = field(
        default_factory=QuadraticFundingAllocations
    )

    def calculate_project_rewards(
        self, payload: ProjectRewardsPayload
    ) -> ProjectRewardsResult:
        # TODO OCT-1625 Apply Gitcoin user's score for the formula: https://linear.app/golemfoundation/issue/OCT-1624/implement-quadratic-funding
        # TODO OCT-1625 Double-check whether it's ok to get rid of threshold for projects with allocated funds below it

        (
            allocated_by_addr,
            total_allocated,
        ) = self.projects_allocations.group_allocations_by_projects(
            ProjectAllocationsPayload(allocations=payload.allocations)
        )
        rewards = {
            address: ProjectRewardDTO(address, 0, 0) for address in payload.projects
        }

        project_rewards_sum = 0
        for address, quadratic_allocated in allocated_by_addr:
            matched = Decimal(
                quadratic_allocated / Decimal(total_allocated) * payload.matched_rewards
            )
            project_rewards_sum += quadratic_allocated + matched
            project_rewards = rewards[address]
            project_rewards.allocated = int(quadratic_allocated)
            project_rewards.matched = int(matched)

        return ProjectRewardsResult(
            rewards=sorted(rewards.values(), key=lambda r: r.allocated, reverse=True),
            rewards_sum=int(project_rewards_sum),
            total_allocated=total_allocated,
            threshold=None,
        )
