import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import BoxRounded from 'components/core/BoxRounded/BoxRounded';
import Sections from 'components/core/BoxRounded/Sections/Sections';
import { SectionProps } from 'components/core/BoxRounded/Sections/types';
import Header from 'components/core/Header/Header';
import Svg from 'components/core/Svg/Svg';
import AllocationSummaryProject from 'components/dedicated/AllocationSummaryProject/AllocationSummaryProject';
import useMediaQuery from 'hooks/helpers/useMediaQuery';
import useIndividualReward from 'hooks/queries/useIndividualReward';
import useAllocationsStore from 'store/allocations/store';
import { chevronBottom } from 'svg/misc';

import styles from './AllocationSummary.module.scss';
import AllocationSummaryProps from './types';

const variants = {
  showHide: { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1 },
};

const AllocationSummary: FC<AllocationSummaryProps> = ({ allocationValues }) => {
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'components.dedicated.allocationSummary',
  });
  const { isDesktop } = useMediaQuery();
  const { data: individualReward, isFetching: isFetchingIndividualReward } = useIndividualReward();
  const [areDonationsVisible, setAreDonationsVisible] = useState(isDesktop);
  const { rewardsForProposals } = useAllocationsStore(state => ({
    rewardsForProposals: state.data.rewardsForProposals,
  }));

  const allocationValuesPositive = allocationValues.filter(({ value }) => !value.isZero());

  const sections: SectionProps[] = [];
  const personalAllocation = individualReward?.sub(rewardsForProposals);

  if (!personalAllocation?.isZero()) {
    sections.push({
      doubleValueProps: {
        cryptoCurrency: 'ethereum',
        isFetching: isFetchingIndividualReward,
        valueCrypto: individualReward?.sub(rewardsForProposals),
      },
      label: i18n.t('common.personal'),
      labelClassName: styles.sectionLabel,
    });
  }

  if (allocationValuesPositive.length > 0) {
    sections.push(
      {
        additionalContent: (
          <AnimatePresence initial={false}>
            {areDonationsVisible && (
              <motion.div
                animate="visible"
                className={styles.detailsWrapper}
                exit="showHide"
                initial="showHide"
                variants={variants}
              >
                <div className={styles.details}>
                  {allocationValuesPositive.map(({ address, ...rest }) => (
                    <AllocationSummaryProject key={address} address={address} {...rest} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ),
        className: styles.donations,
        doubleValueProps: {
          cryptoCurrency: 'ethereum',
          valueCrypto: rewardsForProposals,
        },
        label: t('donations'),
        labelClassName: styles.sectionLabel,
        labelSuffix: (
          <Svg
            classNameSvg={cx(styles.icon, areDonationsVisible && styles.areDonationsVisible)}
            img={chevronBottom}
            size={0.8}
          />
        ),
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        onClick: () => setAreDonationsVisible(prev => !prev),
      },
      // TODO OCT-573: fetch the data and render it.
      // {
      //   doubleValueProps: {
      //     cryptoCurrency: 'ethereum',
      //     valueCrypto: parseUnits('0.250'),
      //   },
      //   label: t('matchFundingEstimate'),
      //   labelClassName: cx(styles.sectionLabel, styles.matchFundingLabel),
      // },
    );
  }

  return (
    <BoxRounded hasPadding={false} isVertical>
      <Header className={styles.header} text={t('confirmYourAllocations')} />
      <Sections sections={sections} />
    </BoxRounded>
  );
};

export default AllocationSummary;
