import { useAccount } from 'wagmi';

import useAntisybilStatusScore from 'hooks/queries/useAntisybilStatusScore';
import useCurrentEpoch from 'hooks/queries/useCurrentEpoch';
import useIsContract from 'hooks/queries/useIsContract';
import useIsPatronMode from 'hooks/queries/useIsPatronMode';
import useUserTOS from 'hooks/queries/useUserTOS';
import useAllProjects from 'hooks/subgraph/useAllProjects';
import useAllocationsStore from 'store/allocations/store';
import useDelegationStore from 'store/delegation/store';
import useOnboardingStore from 'store/onboarding/store';
import useSettingsStore from 'store/settings/store';
import getIsPreLaunch from 'utils/getIsPreLaunch';

export default function useAppIsLoading(isFlushRequired: boolean): boolean {
  const { address } = useAccount();

  const { isFetching: isFetchingAllProjects } = useAllProjects();
  const { isFetching: isFetchingPatronModeStatus } = useIsPatronMode();
  const { isFetching: isFetchingUserTOS, isRefetching: isRefetchingUserTOS } = useUserTOS();
  // isLoading, not isFetching, as we care only for the initial load and isOnTimeOutList value.
  const { isLoading: isLoadingAntisybilStatusScore } = useAntisybilStatusScore(address);
  const { data: currentEpoch, isLoading: isLoadingCurrentEpoch } = useCurrentEpoch();
  const isPreLaunch = getIsPreLaunch(currentEpoch);

  const { isInitialized: isOnboardingInitialized } = useOnboardingStore(state => ({
    isInitialized: state.meta.isInitialized,
  }));
  const { isInitialized: isSettingsInitialized } = useSettingsStore(state => ({
    isInitialized: state.meta.isInitialized,
  }));
  const { isInitialized: isDelegationInitialized, isDelegationInProgress } = useDelegationStore(
    state => ({
      isDelegationInProgress: state.data.isDelegationInProgress,
      isInitialized: state.meta.isInitialized,
    }),
  );
  const { isInitialized: isAllocationsInitialized } = useAllocationsStore(state => ({
    isInitialized: state.meta.isInitialized,
  }));
  const { isFetching: isFetchingIsContract } = useIsContract();

  if (isDelegationInProgress) {
    return false;
  }

  return (
    isLoadingCurrentEpoch ||
    (!isPreLaunch && !isAllocationsInitialized) ||
    !isOnboardingInitialized ||
    !isSettingsInitialized ||
    !isDelegationInitialized ||
    isFlushRequired ||
    (isFetchingUserTOS && !isRefetchingUserTOS) ||
    isFetchingAllProjects ||
    isFetchingPatronModeStatus ||
    isFetchingIsContract ||
    isLoadingAntisybilStatusScore
  );
}
