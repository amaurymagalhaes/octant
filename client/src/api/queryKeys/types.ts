import { SettingsData } from 'store/settings/types';

export type Root = {
  cryptoValues: 'cryptoValues';
  depositAt: 'depositAt';
  proposalDonors: 'proposalDonors';
  proposalsContract: 'proposalsContract';
  proposalsIpfsResults: 'proposalsIpfsResults';
  userHistoricAllocations: 'userHistoricAllocations';
  userTOS: 'userTOS';
};

export type QueryKeys = {
  blockNumber: ['blockNumber'];
  cryptoValues: (
    fiatCurrency: NonNullable<SettingsData['displayCurrency']>,
  ) => [Root['cryptoValues'], NonNullable<SettingsData['displayCurrency']>];
  currentEpoch: ['currentEpoch'];
  currentEpochEnd: ['currentEpochEnd'];
  currentEpochProps: ['currentEpochProps'];
  depositAtGivenEpoch: (epochNumber: number) => [Root['depositAt'], string];
  depositsValue: ['depositsValue'];
  glmClaimCheck: ['glmClaimCheck'];
  history: ['history'];
  individualProposalRewards: ['individualProposalRewards'];
  individualReward: ['individualReward'];
  isDecisionWindowOpen: ['isDecisionWindowOpen'];
  lockedSummaryLatest: ['lockedSummaryLatest'];
  matchedProposalRewards: ['matchedProposalRewards'];
  proposalDonors: (proposalAddress: string) => [Root['proposalDonors'], string];
  proposalRewardsThreshold: ['proposalRewardsThreshold'];
  proposalsAllIpfs: ['proposalsAllIpfs'];
  proposalsCid: ['proposalsCid'];
  proposalsContract: (epochNumber: number) => [Root['proposalsContract'], string];
  proposalsIpfsResults: (proposalAddress: string) => [Root['proposalsIpfsResults'], string];
  unlocks: ['unlocks'];
  userAllocations: ['userAllocations'];
  userHistoricAllocations: (userAddress: string) => [Root['userHistoricAllocations'], string];
  userTOS: (userAddress: string) => [Root['userTOS'], string];
  withdrawableUserEth: ['withdrawableUserEth'];
};
