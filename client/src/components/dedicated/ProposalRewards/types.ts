import { ProposalIpfsWithRewards } from 'hooks/queries/useProposalsIpfsWithRewards';

export default interface ProposalRewardsProps {
  address: string;
  className?: string;
  epoch?: number;
  isProposalView?: boolean;
  numberOfDonors: ProposalIpfsWithRewards['numberOfDonors'];
  totalValueOfAllocations: ProposalIpfsWithRewards['totalValueOfAllocations'];
}
