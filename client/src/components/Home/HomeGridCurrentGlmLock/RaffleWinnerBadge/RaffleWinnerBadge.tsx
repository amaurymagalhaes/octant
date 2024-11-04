import { format } from 'date-fns';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Svg from 'components/ui/Svg/Svg';
import Tooltip from 'components/ui/Tooltip';
import useGetValuesToDisplay from 'hooks/helpers/useGetValuesToDisplay';
import useDepositValue from 'hooks/queries/useDepositValue';
import useUserRaffleWinnings from 'hooks/queries/useUserRaffleWinnings';
import { gift } from 'svg/misc';
import getFormattedValueWithSymbolSuffix from 'utils/getFormattedValueWithSymbolSuffix';
import { parseUnitsBigInt } from 'utils/parseUnitsBigInt';

import styles from './RaffleWinnerBadge.module.scss';

const RaffleWinnerBadge = (): ReactElement => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'components.home.homeGridCurrentGlmLock.raffleWinnerBadge',
  });
  const getValuesToDisplay = useGetValuesToDisplay();

  const { data: depositsValue } = useDepositValue();
  const { data: userRaffleWinnings } = useUserRaffleWinnings();

  const userRaffleWinningsSumFormatted = userRaffleWinnings
    ? getValuesToDisplay({
        cryptoCurrency: 'golem',
        showFiatPrefix: false,
        valueCrypto: userRaffleWinnings.sum,
      })
    : undefined;

  const userRaffleWinningsSumFloat = userRaffleWinningsSumFormatted
    ? parseFloat(userRaffleWinningsSumFormatted.primary.replace(/\s/g, ''))
    : 0;
  const userRaffleWinningsSumFormattedWithSymbolSuffix = getFormattedValueWithSymbolSuffix({
    format: 'thousands',
    precision: 0,
    value: userRaffleWinningsSumFloat,
  });

  const tooltipWinningsText = userRaffleWinnings?.winnings.reduce((acc, curr, index) => {
    const amountFormatted = getValuesToDisplay({
      cryptoCurrency: 'golem',
      showCryptoSuffix: true,
      valueCrypto: parseUnitsBigInt(curr.amount, 'wei'),
    });
    const newRow = t('tooltipWinningRow', {
      date: format(parseInt(curr.dateAvailableForWithdrawal, 10) * 1000, 'd LLL y'),
      value: amountFormatted.primary,
    });

    return index > 0 ? `${acc}\n${newRow}` : newRow;
  }, '');

  const depositsValueFormatted = depositsValue
    ? getValuesToDisplay({
        cryptoCurrency: 'golem',
        showCryptoSuffix: true,
        valueCrypto: depositsValue,
      })
    : undefined;

  const tooltipText = depositsValueFormatted
    ? `${tooltipWinningsText}\n${t('tooltipCurrentBalanceRow', { value: depositsValueFormatted.primary })}`
    : '';

  return (
    <div className={styles.root}>
      <Tooltip
        className={styles.tooltipWrapper}
        position="bottom-right"
        text={tooltipText}
        tooltipClassName={styles.tooltip}
      >
        <Svg classNameSvg={styles.img} img={gift} size={1.6} />
        {t('text', { value: userRaffleWinningsSumFormattedWithSymbolSuffix })}
      </Tooltip>
    </div>
  );
};

export default RaffleWinnerBadge;
