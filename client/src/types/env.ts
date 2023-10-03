export type EnvViteKeys = {
  alchemyId: 'VITE_ALCHEMY_ID';
  contractDepositsAddress: 'VITE_DEPOSITS_ADDRESS';
  contractEpochsAddress: 'VITE_EPOCHS_ADDRESS';
  contractGlmAddress: 'VITE_GLM_ADDRESS';
  contractProposalsAddress: 'VITE_PROPOSALS_ADDRESS';
  contractVaultAddress: 'VITE_VAULT_ADDRESS';
  cryptoValuesEndpoint: 'VITE_CRYPTO_VALUES_ENDPOINT';
  ipfsGateway: 'VITE_IPFS_GATEWAY';
  jsonRpcEndpoint: 'VITE_JSON_RPC_ENDPOINT';
  network: 'VITE_NETWORK';
  projectsAllIpfsGateway: 'VITE_PROJECTS_ALL_IPFS_GATEWAY';
  serverEndpoint: 'VITE_SERVER_ENDPOINT';
  subgraphAddress: 'VITE_SUBGRAPH_ADDRESS';
  walletConnectProjectId: 'VITE_WALLET_CONNECT_PROJECT_ID';
  websocketEndpoint: 'VITE_WEBSOCKET_ENDPOINT';
};

export type Env = {
  alchemyId: string;
  contractDepositsAddress: string;
  contractEpochsAddress: string;
  contractGlmAddress: string;
  contractProposalsAddress: string;
  contractVaultAddress: string;
  cryptoValuesEndpoint: string;
  ipfsGateway: string;
  jsonRpcEndpoint?: string;
  network: 'Local' | 'Mainnet' | 'Sepolia';
  projectsAllIpfsGateway: string;
  serverEndpoint: string;
  subgraphAddress: string;
  walletConnectProjectId: string;
  websocketEndpoint: string;
};
