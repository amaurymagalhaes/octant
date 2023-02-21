import cx from 'classnames';
import { BigNumber } from 'ethers';
import isEmpty from 'lodash/isEmpty';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { useMetamask } from 'use-metamask';

import AllocationEmptyState from 'components/dedicated/AllocationEmptyState/AllocationEmptyState';
import AllocationInfoBoxes from 'components/dedicated/AllocationInfoBoxes/AllocationInfoBoxes';
import AllocationItem from 'components/dedicated/AllocationItem/AllocationItem';
import AllocationNavigation from 'components/dedicated/AllocationNavigation/AllocationNavigation';
import AllocationSummary from 'components/dedicated/AllocationSummary/AllocationSummary';
import useAllocate from 'hooks/mutations/useAllocate';
import useDepositEffectiveAtCurrentEpoch from 'hooks/queries/useDepositEffectiveAtCurrentEpoch';
import useIndividualReward from 'hooks/queries/useIndividualReward';
import useIsDecisionWindowOpen from 'hooks/queries/useIsDecisionWindowOpen';
import useMatchedProposalRewards from 'hooks/queries/useMatchedProposalRewards';
import useProposals from 'hooks/queries/useProposals';
import useUserAllocations from 'hooks/queries/useUserAllocations';
import useAllocations from 'hooks/subgraph/useAllocations';
import MainLayoutContainer from 'layouts/MainLayout/MainLayoutContainer';
import getNewAllocationValuesBigNumber from 'utils/getNewAllocationValuesBigNumber';
import triggerToast from 'utils/triggerToast';

import styles from './AllocationView.module.scss';
import AllocationViewProps, { AllocationValues, CurrentView } from './types';
import {
  getAllocationValuesInitialState,
  getAllocationsWithPositiveValues,
  toastBudgetExceeding,
} from './utils';

const AllocationView: FC<AllocationViewProps> = ({ allocations }) => {
  const {
    metaState: { isConnected },
  } = useMetamask();
  const proposals = useProposals();
  const [currentView, setCurrentView] = useState<CurrentView>('edit');
  const [selectedItemAddress, setSelectedItemAddress] = useState<null | string>(null);
  const [allocationValues, setAllocationValues] = useState<undefined | AllocationValues>(undefined);
  const {
    data: userAllocations,
    isFetching: isFetchingUserAllocation,
    refetch: refetchUserAllocation,
  } = useUserAllocations({ refetchOnMount: true });
  const { data: individualReward } = useIndividualReward();
  const { data: isDecisionWindowOpen } = useIsDecisionWindowOpen();
  const { data: depositEffectiveAtCurrentEpoch } = useDepositEffectiveAtCurrentEpoch();
  const { refetch: refetchAllocations } = useAllocations();
  const { data: matchedProposalRewards, refetch: refetchMatchedProposalRewards } =
    useMatchedProposalRewards();
  const allocateMutation = useAllocate({
    onSuccess: async () => {
      setCurrentView('edit');
      setSelectedItemAddress(null);
      triggerToast({
        title: 'Allocation successful.',
      });
      await refetchMatchedProposalRewards();
      await refetchUserAllocation();
      await refetchAllocations();
    },
  });

  const allocationsWithPositiveValues = allocationValues
    ? getAllocationsWithPositiveValues(allocationValues)
    : [];

  const onResetAllocationValues = () => {
    const allocationValuesInitValue = getAllocationValuesInitialState(
      allocations!,
      userAllocations,
    );
    setAllocationValues(allocationValuesInitValue);
  };

  useEffect(() => {
    onResetAllocationValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAllocations]);

  const onAllocate = () => {
    const allocateMutationArgs =
      allocationsWithPositiveValues.length > 0
        ? allocationsWithPositiveValues
        : [
            {
              proposalAddress: proposals[0].address,
              value: '0',
            },
          ];
    allocateMutation.mutate(allocateMutationArgs);
  };

  const onChangeAllocationItemValue = (proposalAddressToModify: string, newValue: string) => {
    if (allocateMutation.isLoading || !individualReward) {
      return;
    }

    // When value === '', we keep it as undefined, for check in AllocationItem.tsx mapping to BigNumber.
    const newValueProcessed = newValue === '' ? undefined : newValue;

    const newAllocationsWithPositiveValues = allocationsWithPositiveValues.map(element =>
      element.proposalAddress === proposalAddressToModify
        ? {
            ...element,
            value: newValue,
          }
        : element,
    );
    if (
      !newAllocationsWithPositiveValues.find(
        ({ proposalAddress }) => proposalAddress === proposalAddressToModify,
      ) &&
      newValue
    ) {
      newAllocationsWithPositiveValues.push({
        proposalAddress: proposalAddressToModify,
        value: newValue,
      });
    }

    const newAllocationValuesBigNumber = getNewAllocationValuesBigNumber(
      newAllocationsWithPositiveValues,
    );

    const newAllocationValuesSum = newAllocationValuesBigNumber.reduce(
      (acc, { value }) => acc.add(value),
      BigNumber.from(0),
    );

    if (newAllocationValuesSum.gt(individualReward)) {
      toastBudgetExceeding();
      return;
    }

    setAllocationValues(prevState => ({
      ...prevState,
      [proposalAddressToModify]: newValueProcessed,
    }));
  };

  const areButtonsDisabled =
    !isConnected || !isDecisionWindowOpen || !!depositEffectiveAtCurrentEpoch?.isZero();
  const areAllocationsAvailable = allocationValues !== undefined && !isEmpty(allocations);
  return (
    <MainLayoutContainer
      isLoading={allocationValues === undefined || (isConnected && isFetchingUserAllocation)}
      navigationBottomSuffix={
        areAllocationsAvailable && (
          <AllocationNavigation
            areButtonsDisabled={areButtonsDisabled}
            currentView={currentView}
            isLoading={allocateMutation.isLoading}
            isSummaryEnabled
            onAllocate={onAllocate}
            onResetAllocationValues={onResetAllocationValues}
            setCurrentView={setCurrentView}
          />
        )
      }
    >
      {currentView === 'edit' ? (
        <Fragment>
          {areAllocationsAvailable ? (
            <div className={styles.boxes}>
              <AllocationInfoBoxes
                classNameBox={styles.box}
                isConnected={isConnected}
                isDecisionWindowOpen={!!isDecisionWindowOpen}
              />
              {allocations!.map((addressInAllocation, index) => {
                const allocationItem = proposals.find(
                  ({ address }) => address === addressInAllocation,
                )!;
                const proposalMatchedProposalRewards = matchedProposalRewards?.find(
                  ({ address }) => address === addressInAllocation,
                );
                const isSelected = selectedItemAddress === allocationItem.address;
                const value = allocationValues[allocationItem.address];
                return (
                  <AllocationItem
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className={cx(styles.box, styles.isAllocation, isSelected && styles.isSelected)}
                    isSelected={isSelected}
                    onChange={onChangeAllocationItemValue}
                    onSelectItem={setSelectedItemAddress}
                    percentage={proposalMatchedProposalRewards?.percentage}
                    totalValueOfAllocations={proposalMatchedProposalRewards?.sum}
                    value={value}
                    {...allocationItem}
                  />
                );
              })}
            </div>
          ) : (
            <AllocationEmptyState />
          )}
          {selectedItemAddress !== null && (
            <div
              className={styles.selectedItemOverlay}
              onClick={() => setSelectedItemAddress(null)}
            />
          )}
        </Fragment>
      ) : (
        <AllocationSummary allocations={allocations} allocationValues={allocationValues!} />
      )}
    </MainLayoutContainer>
  );
};

export default AllocationView;
