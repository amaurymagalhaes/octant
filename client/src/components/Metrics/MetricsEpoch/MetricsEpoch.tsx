import React, { ReactElement } from 'react';

import MetricsEpochGridAverageLeverage from 'components/Metrics/MetricsEpoch/MetricsEpochGridAverageLeverage';
import MetricsEpochGridBelowThreshold from 'components/Metrics/MetricsEpoch/MetricsEpochGridBelowThreshold';
import MetricsEpochGridCurrentDonors from 'components/Metrics/MetricsEpoch/MetricsEpochGridCurrentDonors';
import MetricsEpochGridDonationsVsMatching from 'components/Metrics/MetricsEpoch/MetricsEpochGridDonationsVsMatching';
import MetricsEpochGridDonationsVsPersonalAllocations from 'components/Metrics/MetricsEpoch/MetricsEpochGridDonationsVsPersonalAllocations';
import MetricsEpochGridFundsUsage from 'components/Metrics/MetricsEpoch/MetricsEpochGridFundsUsage';
import MetricsEpochGridPatrons from 'components/Metrics/MetricsEpoch/MetricsEpochGridPatrons';
import MetricsEpochGridRewardsUnused from 'components/Metrics/MetricsEpoch/MetricsEpochGridRewardsUnused';
import MetricsEpochGridTopProjects from 'components/Metrics/MetricsEpoch/MetricsEpochGridTopProjects';
import MetricsEpochGridTotalDonations from 'components/Metrics/MetricsEpoch/MetricsEpochGridTotalDonations';
import MetricsEpochGridTotalMatchingFund from 'components/Metrics/MetricsEpoch/MetricsEpochGridTotalMatchingFund';
import MetricsEpochGridTotalUsers from 'components/Metrics/MetricsEpoch/MetricsEpochGridTotalUsers';
import MetricsEpochGridUnallocatedValue from 'components/Metrics/MetricsEpoch/MetricsEpochGridUnallocatedValue';
import MetricsEpochHeader from 'components/Metrics/MetricsEpoch/MetricsEpochHeader';
import MetricsGrid from 'components/Metrics/MetricsGrid';
import { METRICS_EPOCH_ID } from 'constants/domElementsIds';
import useMetricsEpoch from 'hooks/helpers/useMetrcisEpoch';
import useProjectsDonors from 'hooks/queries/donors/useProjectsDonors';
import useCurrentEpoch from 'hooks/queries/useCurrentEpoch';
import useCurrentEpochEnd from 'hooks/queries/useCurrentEpochEnd';
import useCurrentEpochProps from 'hooks/queries/useCurrentEpochProps';
import useEpochAllocations from 'hooks/queries/useEpochAllocations';
import useEpochBudgets from 'hooks/queries/useEpochBudgets';
import useEpochInfo from 'hooks/queries/useEpochInfo';
import useEpochLeverage from 'hooks/queries/useEpochLeverage';
import useEpochPatrons from 'hooks/queries/useEpochPatrons';
import useEpochUnusedRewards from 'hooks/queries/useEpochUnusedRewards';
import useIsDecisionWindowOpen from 'hooks/queries/useIsDecisionWindowOpen';
import useMatchedProjectRewards from 'hooks/queries/useMatchedProjectRewards';
import useProjectRewardsThreshold from 'hooks/queries/useProjectRewardsThreshold';
import useProjectsIpfsWithRewards from 'hooks/queries/useProjectsIpfsWithRewards';
import useEpochsStartEndTime from 'hooks/subgraph/useEpochsStartEndTime';
import useLargestLockedAmount from 'hooks/subgraph/useLargestLockedAmount';
import useLockedsData from 'hooks/subgraph/useLockedsData';

import styles from './MetricsEpoch.module.scss';

const MetricsEpoch = (): ReactElement => {
  const { epoch, lastEpoch } = useMetricsEpoch();
  const { isFetching: isFetchingCurrentEpoch } = useCurrentEpoch();
  const { isFetching: isFetchingCurrentEpochProps } = useCurrentEpochProps();
  const { data: isDecisionWindowOpen, isFetching: isFetchingDecisionWindow } =
    useIsDecisionWindowOpen();
  const { isFetching: isFetchingLockedsData } = useLockedsData();
  const { isFetching: isFetchingLargestLockedAmount } = useLargestLockedAmount();
  const { isFetching: isFetchingCurrentEpochEnd } = useCurrentEpochEnd();
  const { isFetching: isFetchingEpochsStartEndTime } = useEpochsStartEndTime();
  const { isFetching: isFetchingMatchedProjectRewards } = useMatchedProjectRewards(
    isDecisionWindowOpen && epoch === lastEpoch ? undefined : epoch,
  );
  const { data: projectsIpfsWithRewards, isFetching: isFetchingProjectsIpfsWithRewards } =
    useProjectsIpfsWithRewards(isDecisionWindowOpen && epoch === lastEpoch ? undefined : epoch);
  const { data: projectsDonors, isFetching: isFetchingProjectsDonors } = useProjectsDonors(
    isDecisionWindowOpen && epoch === lastEpoch ? undefined : epoch,
  );
  const { data: projectRewardsThreshold, isFetching: isFetchingProjectRewardsThreshold } =
    useProjectRewardsThreshold(isDecisionWindowOpen && epoch === lastEpoch ? undefined : epoch);
  const { isFetching: isFetchingEpochLeverage } = useEpochLeverage(epoch);
  const { data: epochAllocations, isFetching: isFetchingEpochAllocations } =
    useEpochAllocations(epoch);
  const { data: epochInfo, isFetching: isFetchingEpochInfo } = useEpochInfo(epoch);
  const { isFetching: isFetchingEpochPatrons } = useEpochPatrons(epoch);
  const { data: epochBudgets, isFetching: isFetchingEpochBudgets } = useEpochBudgets(epoch);
  const { data: epochUnusedRewards, isFetching: isFetchingEpochUnusedRewards } =
    useEpochUnusedRewards(epoch);

  const ethBelowThreshold =
    projectRewardsThreshold === undefined || projectsDonors === undefined
      ? BigInt(0)
      : Object.values(projectsDonors).reduce((acc, curr) => {
          const projectSumOfDonations = curr.reduce((acc2, curr2) => {
            return acc2 + curr2.amount;
          }, BigInt(0));

          if (projectSumOfDonations < projectRewardsThreshold) {
            return acc + projectSumOfDonations;
          }

          return acc;
        }, BigInt(0));

  const patronsRewards = epochInfo?.patronsRewards || BigInt(0);
  const sumOfDonations =
    epochAllocations?.reduce((acc, curr) => acc + curr.amount, BigInt(0)) || BigInt(0);
  const totalUserDonationsWithPatronRewards = sumOfDonations + patronsRewards;
  const unusedRewards = epochUnusedRewards?.value || BigInt(0);
  const epochBudget = epochBudgets?.budgetsSum || BigInt(0);

  const totalPersonal = epochBudget - totalUserDonationsWithPatronRewards - unusedRewards;
  const matchedRewards = projectsIpfsWithRewards.reduce(
    (acc, curr) => acc + curr.matchedRewards,
    0n,
  );
  const matchingFund = matchedRewards > 0n ? matchedRewards - patronsRewards : 0n;

  // All metrics should be visible in the same moment (design). Skeletons are visible to the end of fetching all needed data.
  const isLoading =
    isFetchingLargestLockedAmount ||
    isFetchingCurrentEpoch ||
    isFetchingCurrentEpochProps ||
    isFetchingDecisionWindow ||
    isFetchingLockedsData ||
    isFetchingCurrentEpochEnd ||
    isFetchingEpochsStartEndTime ||
    isFetchingProjectsIpfsWithRewards ||
    isFetchingEpochAllocations ||
    isFetchingEpochInfo ||
    isFetchingEpochLeverage ||
    isFetchingEpochUnusedRewards ||
    isFetchingEpochBudgets ||
    isFetchingMatchedProjectRewards ||
    isFetchingProjectsDonors ||
    isFetchingProjectRewardsThreshold ||
    isFetchingEpochPatrons;

  return (
    <div className={styles.root} id={METRICS_EPOCH_ID}>
      <MetricsEpochHeader />
      <MetricsGrid className={styles.grid} dataTest="MetricsEpoch__MetricsGrid">
        <MetricsEpochGridTopProjects className={styles.topProjects} isLoading={isLoading} />
        <MetricsEpochGridFundsUsage
          className={styles.fundsUsage}
          isLoading={isLoading}
          totalUserDonationsWithPatronRewards={totalUserDonationsWithPatronRewards}
          unusedRewards={unusedRewards}
        />
        <MetricsEpochGridTotalUsers className={styles.totalUsers} isLoading={isLoading} />
        <MetricsEpochGridPatrons className={styles.patrons} isLoading={isLoading} />
        <MetricsEpochGridRewardsUnused className={styles.rewardsUnused} isLoading={isLoading} />
        <MetricsEpochGridUnallocatedValue
          className={styles.unallocatedValue}
          isLoading={isLoading}
        />
        <MetricsEpochGridTotalDonations
          className={styles.totalDonations}
          isLoading={isLoading}
          totalUserDonationsWithPatronRewards={totalUserDonationsWithPatronRewards}
        />
        <MetricsEpochGridTotalMatchingFund
          className={styles.totalMatching}
          isLoading={isLoading}
          matchingFund={matchingFund}
        />
        <MetricsEpochGridCurrentDonors className={styles.currentDonors} isLoading={isLoading} />
        <MetricsEpochGridAverageLeverage className={styles.averageLeverage} isLoading={isLoading} />
        <MetricsEpochGridDonationsVsMatching
          className={styles.donationsVsMatching}
          isLoading={isLoading}
          matchingFund={matchingFund}
          totalUserDonationsWithPatronRewards={totalUserDonationsWithPatronRewards}
        />
        <MetricsEpochGridDonationsVsPersonalAllocations
          className={styles.donationsVsPersonal}
          isLoading={isLoading}
          totalPersonal={totalPersonal}
          totalUserDonationsWithPatronRewards={totalUserDonationsWithPatronRewards}
        />
        {epoch < 4 && (
          <MetricsEpochGridBelowThreshold
            className={styles.belowThreshold}
            ethBelowThreshold={ethBelowThreshold}
            isLoading={isLoading}
          />
        )}
      </MetricsGrid>
    </div>
  );
};

export default MetricsEpoch;
