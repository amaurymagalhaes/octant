import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useMetamask } from 'use-metamask';
import React, { FC, useEffect, useRef } from 'react';
import cx from 'classnames';

import { floatNumberWithUpTo18DecimalPlaces } from 'utils/regExp';
import { minus, plus } from 'svg/misc';
import BoxRounded from 'components/core/BoxRounded/BoxRounded';
import Button from 'components/core/Button/Button';
import InputText from 'components/core/InputText/InputText';
import Svg from 'components/core/Svg/Svg';
import isAboveProposalDonationThresholdPercent from 'utils/isAboveProposalDonationThresholdPercent';
import useIndividualReward from 'hooks/useIndividualReward';

import AllocationItemProps from './types';
import styles from './style.module.scss';

const AllocationItem: FC<AllocationItemProps> = ({
  className,
  name,
  id,
  onSelectItem,
  isSelected,
  onChange,
  value,
  totalValueOfAllocations,
  percentage,
}) => {
  const {
    metaState: { isConnected },
  } = useMetamask();
  const { data: individualReward } = useIndividualReward();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSelected && inputRef.current) {
      inputRef.current.focus();
    }
  });

  const onChangeValue = (newValue: string) => {
    if (newValue && !floatNumberWithUpTo18DecimalPlaces.test(newValue)) {
      return;
    }

    onChange(id.toNumber(), newValue);
  };

  const onInputTextChange = event => {
    const {
      target: { value: newValue },
    } = event;

    onChangeValue(newValue);
  };

  const inputProps = {
    isDisabled: !isSelected,
    onChange: onInputTextChange,
    placeholder: isSelected ? '' : '0',
  };

  const isChangeAvailable = isConnected && individualReward;
  const valueToCalculate = value === undefined ? BigNumber.from('0') : parseUnits(value);

  return (
    <BoxRounded
      alignment="center"
      className={cx(styles.box, className)}
      onClick={isConnected ? () => onSelectItem(id.toNumber()) : undefined}
    >
      <div className={styles.details}>
        <div className={styles.name}>{name}</div>
        <div className={styles.funds}>
          <div>{totalValueOfAllocations} ETH</div>
          <div className={styles.percent}>
            {percentage}%
            <div
              className={cx(
                styles.indicator,
                percentage &&
                  isAboveProposalDonationThresholdPercent(percentage) &&
                  styles.isAboveThreshold,
              )}
            />
          </div>
        </div>
      </div>
      <div className={cx(styles.value, isSelected && styles.isSelected)}>
        <InputText ref={inputRef} value={value || '0'} variant="borderless" {...inputProps} />
        <div className={styles.currency}>ETH</div>
      </div>
      <div className={cx(styles.buttons, isSelected && styles.isSelected)}>
        <Button
          className={styles.button}
          Icon={<Svg img={plus} size={1.2} />}
          onClick={
            isChangeAvailable
              ? () => onChangeValue(formatUnits(valueToCalculate.add(individualReward.div(10))))
              : undefined
          }
          variant="iconOnlyTransparent"
        />
        <Button
          className={styles.button}
          Icon={<Svg img={minus} size={1.2} />}
          onClick={
            isChangeAvailable
              ? () => onChangeValue(formatUnits(valueToCalculate.sub(individualReward.div(10))))
              : undefined
          }
          variant="iconOnlyTransparent"
        />
      </div>
    </BoxRounded>
  );
};

export default AllocationItem;
