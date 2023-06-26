import { Root, QueryKeys } from './types';

export const ROOTS: Root = {
  cryptoValues: 'cryptoValues',
  depositAt: 'depositAt',
  proposalAllocations: 'proposalAllocations',
  proposalsIpfsResults: 'proposalsIpfsResults',
  userHistoricAllocations: 'userHistoricAllocations',
};

export const QUERY_KEYS: QueryKeys = {
  cryptoValues: fiatCurrency => [ROOTS.cryptoValues, fiatCurrency],
  cryptoValuesRoot: ['cryptoValues'],
  currentBalance: ['currentBalance'],
  currentEpoch: ['currentEpoch'],
  currentEpochEnd: ['currentEpochEnd'],
  currentEpochProps: ['currentEpochProps'],
  depositAt: ['depositAt'],
  depositAtGivenEpoch: epochNumber => [ROOTS.depositAt, epochNumber.toString()],
  depositsValue: ['depositsValue'],
  glmLocked: ['glmLocked'],
  individualProposalRewards: ['individualProposalRewards'],
  individualReward: ['individualReward'],
  isDecisionWindowOpen: ['isDecisionWindowOpen'],
  lockedRatio: ['lockedRatio'],
  locks: ['locks'],
  matchedProposalRewards: ['matchedProposalRewards'],
  matchedRewards: ['matchedRewards'],
  proposalAllocations: proposalAddress => [ROOTS.proposalAllocations, proposalAddress],
  proposalRewardsThresholdFraction: ['proposalRewardsThresholdFraction'],
  proposalsCid: ['proposalsCid'],
  proposalsContract: ['proposalsContract'],
  proposalsIpfsResults: proposalAddress => [ROOTS.proposalsIpfsResults, proposalAddress],
  unlocks: ['unlocks'],
  userAllocations: ['userAllocations'],
  userHistoricAllocations: userAddress => [ROOTS.userHistoricAllocations, userAddress],
  withdrawableUserEth: ['withdrawableUserEth'],
};
