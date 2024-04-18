import React, { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import EarnHistoryItemDateAndTime from 'components/Earn/EarnHistory/EarnHistoryItemDetails/EarnHistoryItemDateAndTime';
import ProjectAllocationDetailRow from 'components/shared/ProjectAllocationDetailRow';
import BoxRounded from 'components/ui/BoxRounded';
import Sections from 'components/ui/BoxRounded/Sections/Sections';
import { SectionProps } from 'components/ui/BoxRounded/Sections/types';
import useCurrentEpoch from 'hooks/queries/useCurrentEpoch';
import useIndividualReward from 'hooks/queries/useIndividualReward';
import useEpochTimestampHappenedIn from 'hooks/subgraph/useEpochTimestampHappenedIn';
import { CryptoCurrency } from 'types/cryptoCurrency';
import { formatUnitsBigInt } from 'utils/formatUnitsBigInt';
import { parseUnitsBigInt } from 'utils/parseUnitsBigInt';

import styles from './EarnHistoryItemDetailsAllocation.module.scss';
import EarnHistoryItemDetailsAllocationProps from './types';

const EarnHistoryItemDetailsAllocation: FC<EarnHistoryItemDetailsAllocationProps> = ({
  eventData: { amount, allocations, leverage },
  timestamp,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'components.dedicated.historyItemModal',
  });
  const { data: currentEpoch } = useCurrentEpoch();
  const { data: epochTimestampHappenedIn, isFetching: isFetchingEpochTimestampHappenedIn } =
    useEpochTimestampHappenedIn(timestamp);

  const allocationEpoch = epochTimestampHappenedIn ? epochTimestampHappenedIn - 1 : undefined;

  const { data: individualReward, isFetching: isFetchingIndividualReward } =
    useIndividualReward(allocationEpoch);

  const isPersonalOnlyAllocation = amount === 0n;

  const isAllocationFromCurrentAW = currentEpoch ? allocationEpoch === currentEpoch - 1 : false;

  const sections: SectionProps[] = [
    {
      doubleValueProps: {
        cryptoCurrency: 'ethereum',
        isFetching: isFetchingEpochTimestampHappenedIn || isFetchingIndividualReward,
        valueCrypto: individualReward ? individualReward - amount : BigInt(0),
      },
      label: t('sections.allocationPersonal'),
    },
    ...(isPersonalOnlyAllocation
      ? []
      : ([
          {
            doubleValueProps: {
              cryptoCurrency: 'ethereum' as CryptoCurrency,
              valueCrypto: amount,
            },
            label: t('sections.allocationProjects', { projectsNumber: allocations.length }),
          },
          isAllocationFromCurrentAW
            ? {
                childrenRight: <div className={styles.leverage}>{parseInt(leverage, 10)}x</div>,
                label: t('sections.estimatedLeverage'),
                tooltipProps: {
                  position: 'bottom-right',
                  text: t('sections.allocationTooltips.leverage'),
                  tooltipClassName: styles.tooltip,
                },
              }
            : {
                childrenRight: (
                  <div className={styles.leverage}>
                    {formatUnitsBigInt(amount ** parseUnitsBigInt(leverage))}x
                  </div>
                ),
                label: t('sections.finalMatchFunding'),
                tooltipProps: {
                  position: 'bottom-right',
                  text: t('sections.allocationTooltips.finalMatchFunding'),
                  tooltipClassName: styles.tooltip,
                },
              },
        ] as SectionProps[])),
    {
      childrenRight: <EarnHistoryItemDateAndTime timestamp={timestamp} />,
      label: t('sections.when'),
    },
  ];

  return (
    <Fragment>
      <BoxRounded alignment="left" hasSections isGrey isVertical>
        <Sections hasBottomDivider sections={sections} variant="small" />
      </BoxRounded>
      {!isPersonalOnlyAllocation && (
        <BoxRounded alignment="left" className={styles.projects} isGrey isVertical>
          {allocations?.map(allocation => (
            <ProjectAllocationDetailRow
              key={allocation.address}
              {...allocation}
              epoch={epochTimestampHappenedIn}
            />
          ))}
        </BoxRounded>
      )}
    </Fragment>
  );
};

export default EarnHistoryItemDetailsAllocation;
