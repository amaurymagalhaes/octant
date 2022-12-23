import { useMetamask } from 'use-metamask';
import React, { FC, useEffect, useRef } from 'react';
import cx from 'classnames';

import { minus, plus } from 'svg/misc';
import { numbersOnly } from 'utils/regExp';
import BoxRounded from 'components/core/box-rounded/box-rounded.component';
import Button from 'components/core/button/button.component';
import InputText from 'components/core/input-text/input-text.component';
import Svg from 'components/core/svg/svg.component';
import isAboveProposalDonationThresholdPercent from 'utils/isAboveProposalDonationThresholdPercent';

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSelected && inputRef.current) {
      inputRef.current.focus();
    }
  });

  const onChangeNumber = (newValue: number) => {
    if (newValue < 0) {
      return;
    }
    onChange(id.toNumber(), newValue);
  };

  const onInputTextChange = event => {
    const {
      target: { value: newValue },
    } = event;

    if ((!value && !newValue) || !numbersOnly.test(newValue)) {
      return;
    }

    const newValueNumber = newValue ? parseInt(newValue, 10) : 0;

    onChangeNumber(newValueNumber);
  };

  const inputProps = {
    isDisabled: !isSelected,
    onChange: onInputTextChange,
    placeholder: isSelected ? '' : '0',
  };

  const valueToRender = value === undefined ? 0 : value;
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
                isAboveProposalDonationThresholdPercent(percentage) && styles.isAboveThreshold,
              )}
            />
          </div>
        </div>
      </div>
      <div className={cx(styles.value, isSelected && styles.isSelected)}>
        <InputText
          ref={inputRef}
          value={valueToRender.toString()}
          variant="borderless"
          {...inputProps}
        />
        <div className={styles.currency}>% or reward budget</div>
      </div>
      <div className={cx(styles.buttons, isSelected && styles.isSelected)}>
        <Button
          className={styles.button}
          Icon={<Svg img={plus} size={1.2} />}
          onClick={isConnected ? () => onChangeNumber(valueToRender + 1) : undefined}
          variant="iconOnlyTransparent"
        />
        <Button
          className={styles.button}
          Icon={<Svg img={minus} size={1.2} />}
          onClick={isConnected ? () => onChangeNumber(valueToRender - 1) : undefined}
          variant="iconOnlyTransparent"
        />
      </div>
    </BoxRounded>
  );
};

export default AllocationItem;
