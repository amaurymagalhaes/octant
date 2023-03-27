import { SettingsData } from 'store/settings/types';

export const QUERY_KEYS = {
  availableFundsEth: ['availableFundsEth'],
  availableFundsGlm: ['availableFundsGlm'],
  cryptoValues: (fiatCurrency: NonNullable<SettingsData['displayCurrency']>): string[] => [
    ...QUERY_KEYS.cryptoValuesRoot,
    fiatCurrency,
  ],
  cryptoValuesRoot: ['cryptoValues'],
  currentBalance: ['currentBalance'],
  currentEpoch: ['currentEpoch'],
  currentEpochEnd: ['currentEpochEnd'],
  currentEpochProps: ['currentEpochProps'],
  depositAt: ['depositAt'],
  depositAtGivenEpoch: (epochNumber: number): string[] => [
    ...QUERY_KEYS.depositAt,
    epochNumber.toString(),
  ],
  depositsValue: ['depositsValue'],
  glmLocked: ['glmLocked'],
  individualReward: ['individualReward'],
  isDecisionWindowOpen: ['isDecisionWindowOpen'],
  lockedRatio: ['lockedRatio'],
  matchedProposalRewards: ['matchedProposalRewards'],
  matchedRewards: ['matchedRewards'],
  proposalRewardsThresholdFraction: ['proposalRewardsThresholdFraction'],
  proposalsCid: ['proposalsCid'],
  proposalsContract: ['proposalsContract'],
  proposalsIpfsResults: (address: string): string[] => ['proposalsIpfsResults', address],
  userAllocations: ['userAllocations'],
  withdrawableUserEth: ['withdrawableUserEth'],
};
