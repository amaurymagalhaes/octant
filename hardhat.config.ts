import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

import { ETHERSCAN_API_KEY, GOERLI_PRIVATE_KEY, GOERLI_URL, ZKSYNC_URL } from './env';
import '@typechain/hardhat'

import { ETHERSCAN_API_KEY, GOERLI_PRIVATE_KEY, GOERLI_URL } from './env';

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
      initialBaseFeePerGas: 0,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      initialBaseFeePerGas: 0,
    },
    goerli: {
      url: GOERLI_URL,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
      localhost: 0
    },
    user: {
      default: 1,
      localhost: 1
    },
  },
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API_KEY
    }
  }
};

export default config;
