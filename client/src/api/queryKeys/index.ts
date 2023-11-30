import { Root, QueryKeys } from './types';

export const ROOTS: Root = {
  calculateRewards: 'calculateRewards',
  cryptoValues: 'cryptoValues',
  depositAt: 'depositAt',
  epochTimestampHappenedIn: 'epochTimestampHappenedIn',
  epochesEndTime: 'epochesEndTime',
  estimatedEffectiveDeposit: 'estimatedEffectiveDeposit',
  individualReward: 'individualReward',
  matchedProposalRewards: 'matchedProposalRewards',
  patronMode: 'patronMode',
  proposalDonors: 'proposalDonors',
  proposalRewardsThreshold: 'proposalRewardsThreshold',
  proposalsContract: 'proposalsContract',
  proposalsIpfsResults: 'proposalsIpfsResults',
  userAllocationNonce: 'userAllocationNonce',
  userAllocations: 'userAllocations',
  userTOS: 'userTOS',
};

export const QUERY_KEYS: QueryKeys = {
  blockNumber: ['blockNumber'],
  calculateRewards: (amount, days) => [ROOTS.calculateRewards, amount, days.toString()],
  cryptoValues: fiatCurrency => [ROOTS.cryptoValues, fiatCurrency],
  currentEpoch: ['currentEpoch'],
  currentEpochEnd: ['currentEpochEnd'],
  currentEpochProps: ['currentEpochProps'],
  depositsValue: ['depositsValue'],
  epochTimestampHappenedIn: timestamp => [ROOTS.epochTimestampHappenedIn, timestamp.toString()],
  epochesEndTime: epochNumber => [ROOTS.epochesEndTime, epochNumber.toString()],
  estimatedEffectiveDeposit: userAddress => [ROOTS.estimatedEffectiveDeposit, userAddress],
  glmClaimCheck: ['glmClaimCheck'],
  history: ['history'],
  individualProposalRewards: ['individualProposalRewards'],
  individualReward: epochNumber => [ROOTS.individualReward, epochNumber.toString()],
  isDecisionWindowOpen: ['isDecisionWindowOpen'],
  largestLockedAmount: ['largestLockedAmount'],
  lockedSummaryLatest: ['lockedSummaryLatest'],
  lockedSummarySnapshots: ['lockedSummarySnapshots'],
  matchedProposalRewards: epochNumber => [ROOTS.matchedProposalRewards, epochNumber.toString()],
  patronMode: userAddress => [ROOTS.patronMode, userAddress],
  proposalDonors: (proposalAddress, epochNumber) => [
    ROOTS.proposalDonors,
    proposalAddress,
    epochNumber.toString(),
  ],
  proposalRewardsThreshold: epochNumber => [ROOTS.proposalRewardsThreshold, epochNumber.toString()],
  proposalsAllIpfs: ['proposalsAllIpfs'],
  proposalsCid: ['proposalsCid'],
  proposalsContract: epochNumber => [ROOTS.proposalsContract, epochNumber.toString()],
  proposalsIpfsResults: proposalAddress => [ROOTS.proposalsIpfsResults, proposalAddress],
  syncStatus: ['syncStatus'],
  totalAddresses: ['totalAddresses'],
  unlocks: ['unlocks'],
  userAllocationNonce: userAddress => [ROOTS.userAllocationNonce, userAddress],
  userAllocations: epochNumber => [ROOTS.userAllocations, epochNumber.toString()],
  userTOS: userAddress => [ROOTS.userTOS, userAddress],
  withdrawals: ['withdrawals'],
};
