import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

import { AUTH } from '../helpers/constants';
import { Auth } from '../typechain';

// This function needs to be declared this way, otherwise it's not understood by test runner.
// eslint-disable-next-line func-names
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  if (['hardhat', 'localhost'].includes(hre.network.name)) {
    // Test networks setup
    // TODO automate the flow for testnet deployment - OCT-364
  } else {
    // Live networks setup
    // Renounce deployer role
    const auth: Auth = await hre.ethers.getContract(AUTH);
    await auth.renounceDeployer();
  }
};

export default func;
func.tags = ['setup', 'local', 'test', 'goerli'];
