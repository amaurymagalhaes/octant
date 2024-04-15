import { Root, QueryKeys } from './types';

export const ROOTS: Root = {
  bytecode: 'bytecode',
  calculateRewards: 'calculateRewards',
  cryptoValues: 'cryptoValues',
  depositAt: 'depositAt',
  epochAllocations: 'epochAllocations',
  epochBudgets: 'epochBudgets',
  epochInfo: 'epochInfo',
  epochLeverage: 'epochLeverage',
  epochPatrons: 'epochPatrons',
  epochTimestampHappenedIn: 'epochTimestampHappenedIn',
  epochUnusedRewards: 'epochUnusedRewards',
  epochesEndTime: 'epochesEndTime',
  estimatedEffectiveDeposit: 'estimatedEffectiveDeposit',
  individualReward: 'individualReward',
  matchedProjectRewards: 'matchedProjectRewards',
  patronMode: 'patronMode',
  projectDonors: 'projectDonors',
  projectRewardsThreshold: 'projectRewardsThreshold',
  projectsEpoch: 'projectsEpoch',
  projectsIpfsResults: 'projectsIpfsResults',
  userAllocationNonce: 'userAllocationNonce',
  userAllocations: 'userAllocations',
  userTOS: 'userTOS',
};

export const QUERY_KEYS: QueryKeys = {
  blockNumber: ['blockNumber'],
  bytecode: userAddress => [ROOTS.bytecode, userAddress],
  calculateRewards: (amount, days) => [ROOTS.calculateRewards, amount, days.toString()],
  cryptoValues: fiatCurrency => [ROOTS.cryptoValues, fiatCurrency],
  currentEpoch: ['currentEpoch'],
  currentEpochEnd: ['currentEpochEnd'],
  currentEpochProps: ['currentEpochProps'],
  depositsValue: ['depositsValue'],
  epochAllocations: epoch => [ROOTS.epochAllocations, epoch.toString()],
  epochBudgets: epoch => [ROOTS.epochBudgets, epoch.toString()],
  epochInfo: epoch => [ROOTS.epochInfo, epoch.toString()],
  epochLeverage: epoch => [ROOTS.epochLeverage, epoch.toString()],
  epochPatrons: epoch => [ROOTS.epochPatrons, epoch.toString()],
  epochTimestampHappenedIn: timestamp => [ROOTS.epochTimestampHappenedIn, timestamp.toString()],
  epochUnusedRewards: epoch => [ROOTS.epochUnusedRewards, epoch.toString()],
  epochesEndTime: epochNumber => [ROOTS.epochesEndTime, epochNumber.toString()],
  epochsIndexedBySubgraph: ['epochsIndexedBySubgraph'],
  estimatedEffectiveDeposit: userAddress => [ROOTS.estimatedEffectiveDeposit, userAddress],
  history: ['history'],
  individualProjectRewards: ['individualProjectRewards'],
  individualReward: epochNumber => [ROOTS.individualReward, epochNumber.toString()],
  isDecisionWindowOpen: ['isDecisionWindowOpen'],
  largestLockedAmount: ['largestLockedAmount'],
  lockedSummaryLatest: ['lockedSummaryLatest'],
  lockedSummarySnapshots: ['lockedSummarySnapshots'],
  matchedProjectRewards: epochNumber => [ROOTS.matchedProjectRewards, epochNumber.toString()],
  patronMode: userAddress => [ROOTS.patronMode, userAddress],
  projectDonors: (projectAddress, epochNumber) => [
    ROOTS.projectDonors,
    projectAddress,
    epochNumber.toString(),
  ],
  projectRewardsThreshold: epochNumber => [ROOTS.projectRewardsThreshold, epochNumber.toString()],
  projectsEpoch: epochNumber => [ROOTS.projectsEpoch, epochNumber.toString()],
  projectsIpfsResults: (projectAddress, epochNumber) => [
    ROOTS.projectsIpfsResults,
    projectAddress,
    epochNumber.toString(),
  ],
  projectsMetadataAccumulateds: ['projectsMetadataAccumulateds'],
  projectsMetadataPerEpoches: ['projectsMetadataPerEpoches'],
  syncStatus: ['syncStatus'],
  totalAddresses: ['totalAddresses'],
  totalWithdrawals: ['totalWithdrawals'],
  unlocks: ['unlocks'],
  userAllocationNonce: userAddress => [ROOTS.userAllocationNonce, userAddress],
  userAllocations: epochNumber => [ROOTS.userAllocations, epochNumber.toString()],
  userTOS: userAddress => [ROOTS.userTOS, userAddress],
  withdrawals: ['withdrawals'],
};
