import { ethers } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

import { PROPOSAL_ADDRESSES, PROPOSALS_CID } from '../env';
import { AUTH, EPOCHS, PROPOSALS } from '../helpers/constants';

// This function needs to be declared this way, otherwise it's not understood by test runner.
// eslint-disable-next-line func-names
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  let proposalAddresses = PROPOSAL_ADDRESSES;

  /// for localhost and testnet same set of proposals is used
  /// for hardhat - test propsals are used
  if (hre.network.name === 'hardhat') {
    const unnamedAddresses = await hre.getUnnamedAccounts();
    proposalAddresses = unnamedAddresses.slice(0, 10);
  }

  const auth = await ethers.getContract(AUTH);
  const epochs = await ethers.getContract(EPOCHS);

  await deploy(PROPOSALS, {
    args: [epochs.address, PROPOSALS_CID, proposalAddresses, auth.address],
    autoMine: true,
    from: deployer,
    log: true,
  });
};
export default func;
func.tags = ['proposals', 'local', 'test', 'testnet'];
