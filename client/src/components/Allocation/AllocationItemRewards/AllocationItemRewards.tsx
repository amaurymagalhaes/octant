import cx from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Svg from 'components/ui/Svg';
import useProjectDonors from 'hooks/queries/donors/useProjectDonors';
import useCurrentEpoch from 'hooks/queries/useCurrentEpoch';
import useIsDecisionWindowOpen from 'hooks/queries/useIsDecisionWindowOpen';
import useMatchedProjectRewards from 'hooks/queries/useMatchedProjectRewards';
import useUqScore from 'hooks/queries/useUqScore';
import useUserAllocations from 'hooks/queries/useUserAllocations';
import { person } from 'svg/misc';
import getFormattedEthValue from 'utils/getFormattedEthValue';
import getRewardsSumWithValueAndSimulation from 'utils/getRewardsSumWithValueAndSimulation';
import { parseUnitsBigInt } from 'utils/parseUnitsBigInt';

import styles from './AllocationItemRewards.module.scss';
import AllocationItemRewardsProps, { AllocationItemRewardsDonorsProps } from './types';

const bigintAbs = (n: bigint): bigint => (n < 0n ? -n : n);

const AllocationItemRewardsDonors: FC<AllocationItemRewardsDonorsProps> = ({
  isSimulateVisible,
  isLoadingAllocateSimulate,
  projectDonors,
  isSimulatedMatchedAvailable,
  isNewSimulatedPositive,
}) => {
  const { data: isDecisionWindowOpen } = useIsDecisionWindowOpen();

  const shouldBeVisible =
    !isSimulateVisible && !isLoadingAllocateSimulate && (projectDonors || !isDecisionWindowOpen);

  if (!shouldBeVisible) {
    return null;
  }

  return (
    <div
      className={cx(
        styles.element,
        isDecisionWindowOpen && styles.isDecisionWindowOpen,
        isSimulatedMatchedAvailable && styles.isSimulatedMatchedAvailable,
      )}
    >
      <Svg
        classNameSvg={cx(
          styles.icon,
          isSimulatedMatchedAvailable && styles.isSimulatedMatchedAvailable,
        )}
        img={person}
        size={1.2}
      />
      {!isDecisionWindowOpen && '0'}
      {isDecisionWindowOpen &&
        projectDonors &&
        isNewSimulatedPositive &&
        isSimulatedMatchedAvailable &&
        projectDonors.length + 1}
      {isDecisionWindowOpen &&
        projectDonors &&
        !isNewSimulatedPositive &&
        isSimulatedMatchedAvailable &&
        projectDonors.length - 1}
      {isDecisionWindowOpen &&
        projectDonors &&
        !isSimulatedMatchedAvailable &&
        projectDonors.length}
    </div>
  );
};

const AllocationItemRewards: FC<AllocationItemRewardsProps> = ({
  address,
  simulatedMatched,
  isLoadingAllocateSimulate,
  value,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'views.allocation.allocationItem',
  });
  const [isSimulateVisible, setIsSimulateVisible] = useState<boolean>(false);
  const { data: currentEpoch } = useCurrentEpoch();
  const { data: userAllocations } = useUserAllocations();
  const { data: isDecisionWindowOpen } = useIsDecisionWindowOpen();
  const { data: matchedProjectRewards } = useMatchedProjectRewards();
  const { data: uqScore } = useUqScore(currentEpoch! - 1);

  const { data: projectDonors } = useProjectDonors(address);

  // value can an empty string, which crashes parseUnits. Hence the alternative.
  const valueToUse = value || '0';

  useEffect(() => {
    if (simulatedMatched === undefined || simulatedMatched === '0') {
      return;
    }
    setIsSimulateVisible(true);

    const timeout = setTimeout(() => {
      setIsSimulateVisible(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [simulatedMatched]);

  const projectMatchedProjectRewards = matchedProjectRewards?.find(
    ({ address: matchedProjectRewardsAddress }) => address === matchedProjectRewardsAddress,
  );
  const userAllocationToThisProject = userAllocations?.elements.find(
    element => element.address === address,
  )?.value;

  const isNewSimulatedPositive = userAllocationToThisProject
    ? parseUnitsBigInt(valueToUse) >= userAllocationToThisProject
    : true;

  const simulatedMatchedBigInt = simulatedMatched
    ? parseUnitsBigInt(simulatedMatched, 'wei')
    : BigInt(0);

  const rewardsSumWithValueAndSimulation = getRewardsSumWithValueAndSimulation(
    valueToUse,
    simulatedMatchedBigInt,
    simulatedMatched === undefined
      ? projectMatchedProjectRewards?.sum
      : projectMatchedProjectRewards?.allocated,
    userAllocationToThisProject,
    uqScore,
  );

  const yourImpactFormatted =
    valueToUse && simulatedMatched
      ? getFormattedEthValue(
          bigintAbs(
            parseUnitsBigInt(value) +
              simulatedMatchedBigInt -
              (projectMatchedProjectRewards ? projectMatchedProjectRewards.matched : BigInt(0)),
          ),
        )
      : getFormattedEthValue(parseUnitsBigInt('0', 'wei'));
  const rewardsSumWithValueAndSimulationFormatted = getFormattedEthValue(
    rewardsSumWithValueAndSimulation,
  );

  const isSimulatedMatchedAvailable =
    !!simulatedMatched && parseUnitsBigInt(simulatedMatched, 'wei') > 0;

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <div className={styles.root}>
      <div
        className={cx(
          styles.element,
          isDecisionWindowOpen && styles.isDecisionWindowOpen,
          isLoadingAllocateSimulate && styles.isLoadingAllocateSimulate,
          !isLoadingAllocateSimulate &&
            isSimulatedMatchedAvailable &&
            styles.isSimulatedMatchedAvailable,
        )}
      >
        {isDecisionWindowOpen && isLoadingAllocateSimulate && t('simulateLoading')}
        {isDecisionWindowOpen &&
          !isLoadingAllocateSimulate &&
          isSimulateVisible &&
          t('simulate', {
            value: `${isNewSimulatedPositive ? '' : '-'}${yourImpactFormatted.fullString}`,
          })}
        {isDecisionWindowOpen &&
          !isLoadingAllocateSimulate &&
          !isSimulateVisible &&
          rewardsSumWithValueAndSimulationFormatted.fullString}
        {!isDecisionWindowOpen && getFormattedEthValue(0n).fullString}
      </div>
      <AllocationItemRewardsDonors
        isLoadingAllocateSimulate={isLoadingAllocateSimulate}
        isNewSimulatedPositive={isNewSimulatedPositive}
        isSimulatedMatchedAvailable={isSimulatedMatchedAvailable}
        isSimulateVisible={isSimulateVisible}
        projectDonors={projectDonors}
      />
    </div>
  );
};

export default AllocationItemRewards;
