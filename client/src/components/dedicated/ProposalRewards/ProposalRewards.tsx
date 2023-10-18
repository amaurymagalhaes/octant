import cx from 'classnames';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import ProgressBar from 'components/core/ProgressBar/ProgressBar';
import useIsDonationAboveThreshold from 'hooks/helpers/useIsDonationAboveThreshold';
import useMatchedProposalRewards from 'hooks/queries/useMatchedProposalRewards';
import useProposalRewardsThreshold from 'hooks/queries/useProposalRewardsThreshold';
import getValueCryptoToDisplay from 'utils/getValueCryptoToDisplay';

import styles from './ProposalRewards.module.scss';
import ProposalRewardsProps from './types';
import { getProgressPercentage } from './utils';

const ProposalRewards: FC<ProposalRewardsProps> = ({
  address,
  canFoundedAtHide = true,
  className,
  MiddleElement,
  epoch,
}) => {
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'components.dedicated.proposalRewards',
  });

  const isArchivedProposal = epoch !== undefined;

  const { data: proposalRewardsThreshold } = useProposalRewardsThreshold(epoch);
  const { data: matchedProposalRewards } = useMatchedProposalRewards(epoch);
  const proposalMatchedProposalRewards = matchedProposalRewards?.find(
    ({ address: proposalAddress }) => address === proposalAddress,
  );

  const isDonationAboveThreshold = useIsDonationAboveThreshold(address, epoch);

  const isFundedAtHidden =
    (proposalRewardsThreshold && proposalRewardsThreshold.isZero()) ||
    (canFoundedAtHide && isDonationAboveThreshold);

  const isDataDefined =
    proposalMatchedProposalRewards !== undefined && proposalRewardsThreshold !== undefined;

  const totalValueOfAllocationsToDisplay = getValueCryptoToDisplay({
    cryptoCurrency: 'ethereum',
    valueCrypto: proposalMatchedProposalRewards?.sum,
  });

  const cutOffValueToDisplay = getValueCryptoToDisplay({
    cryptoCurrency: 'ethereum',
    valueCrypto: proposalRewardsThreshold,
  });

  return (
    <div className={cx(styles.root, className)} data-test="ProposalRewards">
      <div className={styles.separator}>
        {isDonationAboveThreshold || !isDataDefined ? (
          <div className={styles.line} />
        ) : (
          <ProgressBar
            color={isArchivedProposal ? 'grey' : 'orange'}
            progressPercentage={getProgressPercentage(
              proposalMatchedProposalRewards?.sum,
              proposalRewardsThreshold,
            )}
          />
        )}
      </div>
      <div className={styles.values}>
        {isDataDefined ? (
          <div className={styles.value}>
            <span className={styles.label} data-test="ProposalRewards__currentTotal__label">
              {t(isArchivedProposal ? 'totalRaised' : 'currentTotal')}
            </span>
            <span
              className={cx(
                styles.number,
                !isDonationAboveThreshold && styles.isBelowCutOff,
                isArchivedProposal && styles.isArchivedProposal,
              )}
              data-test="ProposalRewards__currentTotal__number"
            >
              {totalValueOfAllocationsToDisplay}
            </span>
          </div>
        ) : (
          <div
            className={styles.thresholdDataUnavailable}
            data-test="ProposalRewards__notAvailable"
          >
            {i18n.t('common.thresholdDataUnavailable')}
          </div>
        )}
        {MiddleElement}
        {isDataDefined && (
          <div className={cx(styles.value, isFundedAtHidden && styles.isHidden)}>
            <span className={styles.label}>{t('fundedAt')}</span>
            <span className={cx(styles.number, isArchivedProposal && styles.isArchivedProposal)}>
              {cutOffValueToDisplay}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalRewards;
