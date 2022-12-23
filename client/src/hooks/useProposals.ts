import { useQuery } from 'react-query';

import { ExtendedProposal } from 'types/proposals';

import useContractProposals from './contracts/useContractProposals';
import useCurrentEpoch from './useCurrentEpoch';
import useIpfsProposals from './useIpfsProposals';

export default function useProposals(): [ExtendedProposal[]] {
  const contractProposals = useContractProposals();
  const { data: currentEpoch } = useCurrentEpoch();

  const { data: proposalsContract } = useQuery(
    ['proposalsContract'],
    () => contractProposals?.getProposals(currentEpoch!),
    {
      enabled: !!contractProposals && !!currentEpoch,
      select: response =>
        response?.map(([id, uri]) => ({
          id,
          uri,
        })),
    },
  );

  return useIpfsProposals(proposalsContract);
}
