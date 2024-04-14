import useCurrentEpoch from 'hooks/queries/useCurrentEpoch';
import useIsContract from 'hooks/queries/useIsContract';
import useIsDecisionWindowOpen from 'hooks/queries/useIsDecisionWindowOpen';
import useIsPatronMode from 'hooks/queries/useIsPatronMode';
import useUserTOS from 'hooks/queries/useUserTOS';
import useAllProjects from 'hooks/subgraph/useAllProjects';
import useAllocationsStore from 'store/allocations/store';
import useOnboardingStore from 'store/onboarding/store';
import useSettingsStore from 'store/settings/store';
import useTipsStore from 'store/tips/store';
import getIsPreLaunch from 'utils/getIsPreLaunch';

export default function useAppIsLoading(isFlushRequired: boolean): boolean {
  const { isFetching: isFetchingAllProjects } = useAllProjects();
  const { isLoading: isLoadingIsDecisionWindowOpen } = useIsDecisionWindowOpen();
  const { isFetching: isFetchingPatronModeStatus } = useIsPatronMode();
  const { isFetching: isFetchingUserTOS, isRefetching: isRefetchingUserTOS } = useUserTOS();
  const { data: currentEpoch, isLoading: isLoadingCurrentEpoch } = useCurrentEpoch();
  const isPreLaunch = getIsPreLaunch(currentEpoch);

  const { isInitialized: isOnboardingInitialized } = useOnboardingStore(state => ({
    isInitialized: state.meta.isInitialized,
  }));
  const { isInitialized: isSettingsInitialized } = useSettingsStore(state => ({
    isInitialized: state.meta.isInitialized,
  }));
  const { isInitialized: isTipsStoreInitialized } = useTipsStore(state => ({
    isInitialized: state.meta.isInitialized,
  }));
  const { isInitialized: isAllocationsInitialized } = useAllocationsStore(state => ({
    isInitialized: state.meta.isInitialized,
  }));
  const { isFetching: isFetchingIsContract } = useIsContract();

  return (
    isLoadingIsDecisionWindowOpen ||
    isLoadingCurrentEpoch ||
    (!isPreLaunch && !isAllocationsInitialized) ||
    !isOnboardingInitialized ||
    !isSettingsInitialized ||
    isFlushRequired ||
    !isTipsStoreInitialized ||
    (isFetchingUserTOS && !isRefetchingUserTOS) ||
    isFetchingAllProjects ||
    isFetchingPatronModeStatus ||
    isFetchingIsContract
  );
}
