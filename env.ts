require('dotenv').config();

const IPFS_GATEWAY = process.env.IPFS_GATEWAY || 'https://ipfs.io'
const PROPOSALS_BASE_URI = process.env.PROPOSALS_BASE_URI || `${IPFS_GATEWAY}/ipfs/QmVFvqs93qrn5xayVuEcNwVg5CukSrVHUGJGra3zQsgMax/`;
const GOERLI_URL = process.env.GOERLI_URL || '';
const ZKSYNC_URL = process.env.ZKSYNC_URL || 'https://zksync2-testnet.zksync.dev';
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY || '0000000000000000000000000000000000000000000000000000000000000000';
const GOERLI_GLM = process.env.GOERLI_GLM || '0x0393EfF8fD1C5B5CaBac9b2d437798B6792fe013'
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';

export {
  PROPOSALS_BASE_URI,
  GOERLI_URL,
  ZKSYNC_URL,
  GOERLI_PRIVATE_KEY,
  GOERLI_GLM,
  ETHERSCAN_API_KEY
};
