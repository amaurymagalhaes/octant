import cx from 'classnames';
import { BigNumber, ContractTransaction } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import React, { FC, useEffect, useState } from 'react';
import { useMetamask } from 'use-metamask';

import BoxRounded from 'components/core/BoxRounded/BoxRounded';
import Button from 'components/core/Button/Button';
import InputText from 'components/core/InputText/InputText';
import Modal from 'components/core/Modal/Modal';
import ProgressStepper from 'components/core/ProgressStepper/ProgressStepper';
import BudgetBox from 'components/dedicated/BudgetBox/BudgetBox';
import env from 'env';
import useLock from 'hooks/mutations/useLock';
import useUnlock from 'hooks/mutations/useUnlock';
import useAvailableFunds from 'hooks/queries/useAvailableFunds';
import useDepositEffectiveAtCurrentEpoch from 'hooks/queries/useDepositEffectiveAtCurrentEpoch';
import useDepositValue from 'hooks/queries/useDepositValue';
import useLocks from 'hooks/subgraph/useLocks';
import useUnlocks from 'hooks/subgraph/useUnlocks';
import useMaxApproveCallback from 'hooks/useMaxApproveCallback';
import { floatNumberWithUpTo18DecimalPlaces } from 'utils/regExp';
import triggerToast from 'utils/triggerToast';

import styles from './GlmStakingFlow.module.scss';
import GlmStakingFlowProps, { CurrentMode, CurrentStepIndex } from './types';
import {
  getButtonCtaLabel,
  toastDebouncedLockValueTooBig,
  toastDebouncedUnlockValueTooBig,
} from './utils';

const currentStepIndexInitialValue = 0;

const GlmStakingFlow: FC<GlmStakingFlowProps> = ({ modalProps }) => {
  const { depositsAddress } = env.contracts;
  const {
    metaState: { account, web3: useMetamaskWeb3 },
  } = useMetamask();
  const address = account[0];
  const signer = useMetamaskWeb3?.getSigner();
  const [currentMode, setCurrentMode] = useState<CurrentMode>('lock');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [valueToDeposeOrWithdraw, setValueToDeposeOrWithdraw] = useState<string>('');
  const [currentStepIndex, setCurrentStepIndex] = useState<CurrentStepIndex>(
    currentStepIndexInitialValue,
  );
  const { refetch: refetchDepositEffectiveAtCurrentEpoch } = useDepositEffectiveAtCurrentEpoch();
  const { data: dataAvailableFunds, refetch: refetchAvailableFunds } = useAvailableFunds(
    address,
    signer,
  );
  const { data: depositsValue, refetch: refetchDeposit } = useDepositValue();
  const { refetch: refetchDeposits } = useLocks();
  const { refetch: refetchWithdrawns } = useUnlocks();
  const [approvalState, approveCallback] = useMaxApproveCallback(
    BigNumber.from(parseUnits(valueToDeposeOrWithdraw || '1', 18)),
    depositsAddress,
    signer,
    address,
  );

  const onReset = (newMode: CurrentMode = 'lock'): void => {
    setCurrentMode(newMode);
    setValueToDeposeOrWithdraw('');
    setCurrentStepIndex(0);
    setTransactionHash('');
  };

  const onRefetch = async (): Promise<void> => {
    await refetchDeposit();
    await refetchAvailableFunds();
    await refetchDepositEffectiveAtCurrentEpoch();
    await refetchDeposits();
    await refetchWithdrawns();
  };

  useEffect(() => {
    onReset();
  }, [modalProps.isOpen]);

  const onMutate = async (): Promise<void> => {
    if (!signer || !valueToDeposeOrWithdraw) {
      return;
    }

    if (currentMode === 'lock' && approvalState === 'NOT_APPROVED') {
      await approveCallback();
    }

    setCurrentStepIndex(1);
  };

  const onSuccess = async (transactionResponse: ContractTransaction): Promise<void> => {
    setTransactionHash(transactionResponse!.hash);
    triggerToast({
      title: 'Transaction successful',
    });
    await onRefetch();
    setValueToDeposeOrWithdraw('');
    setCurrentStepIndex(3);
  };

  const lockMutation = useLock({ onMutate, onSuccess });
  const unlockMutation = useUnlock({ onMutate, onSuccess });

  const onApproveOrDeposit = async (): Promise<void> => {
    const valueToDeposeOrWithdrawBigNumber = parseUnits(valueToDeposeOrWithdraw.toString(), 18);
    if (currentMode === 'lock') {
      await lockMutation.mutateAsync(valueToDeposeOrWithdrawBigNumber);
    } else {
      await unlockMutation.mutateAsync(valueToDeposeOrWithdrawBigNumber);
    }
  };

  const onChangeValue = (newValue: string): void => {
    if (newValue && !floatNumberWithUpTo18DecimalPlaces.test(newValue)) {
      return;
    }

    const newValueBigNumber = parseUnits(newValue || '0');
    let valueToSet = newValue;
    if (currentMode === 'unlock' && newValueBigNumber.gt(depositsValue!)) {
      valueToSet = formatUnits(depositsValue!);
      toastDebouncedUnlockValueTooBig();
    }
    if (currentMode === 'lock' && newValueBigNumber.gt(dataAvailableFunds!)) {
      valueToSet = formatUnits(dataAvailableFunds!);
      toastDebouncedLockValueTooBig();
    }

    setValueToDeposeOrWithdraw(valueToSet);
  };

  const isApproveOrDepositInProgress = lockMutation.isLoading || unlockMutation.isLoading;

  return (
    <Modal header={currentMode === 'lock' ? 'Lock GLM' : 'Unlock GLM'} {...modalProps}>
      <BoxRounded className={styles.element} isGrey>
        <ProgressStepper
          currentStepIndex={currentStepIndex}
          steps={
            currentMode === 'lock'
              ? ['Submit', 'Approve & Lock', 'Done']
              : ['Submit', 'Withdraw', 'Done']
          }
        />
      </BoxRounded>
      <BudgetBox
        className={styles.element}
        currentStepIndex={currentStepIndex}
        depositsValue={depositsValue}
        transactionHash={transactionHash}
      />
      <BoxRounded
        isGrey
        tabs={[
          {
            isActive: currentMode === 'lock',
            onClick: () => onReset('lock'),
            title: 'Lock',
          },
          {
            isActive: currentMode === 'unlock',
            onClick: () => onReset('unlock'),
            title: 'Unlock',
          },
        ]}
      >
        <div className={styles.inputs}>
          <InputText
            className={styles.input}
            isDisabled={isApproveOrDepositInProgress}
            label={currentMode === 'lock' ? 'Amount to lock' : 'Amount to unlock'}
            onChange={({ target: { value } }) => onChangeValue(value)}
            suffix="GLM"
            value={valueToDeposeOrWithdraw}
            variant="simple"
          />
          <InputText className={styles.input} isDisabled suffix="USD" variant="simple" />
        </div>
        <div className={styles.availableFunds}>
          Available wallet balance {dataAvailableFunds ? formatUnits(dataAvailableFunds) : '0.0'}{' '}
          GLM.
        </div>
      </BoxRounded>
      <Button
        className={cx(styles.element, styles.button)}
        isDisabled={!valueToDeposeOrWithdraw}
        isHigh
        isLoading={isApproveOrDepositInProgress}
        label={getButtonCtaLabel(currentMode, currentStepIndex, isApproveOrDepositInProgress)}
        onClick={onApproveOrDeposit}
        variant="cta"
      />
    </Modal>
  );
};

export default GlmStakingFlow;
