import { Address, Bytes } from '@graphprotocol/graph-ts';
import { afterAll, beforeAll, describe, test, assert, clearStore } from 'matchstick-as';

import { createSetProposalAddressesCall } from './utils';

import { EpochProjects } from '../generated/schema';
import { handleSetProposalAddresses } from '../src/proposals';

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

// Create an entity for test validation
// Mock proposal function call
// Mock epoch contract
// Call handle call
// Validate the data
// Clear store after the test

const epoch0Addresses = [
  Address.fromString('0x00De4B13153673BCAE2616b67bf822500d325Fc3'),
  Address.fromString('0x1c01595f9534E33d411035AE99a4317faeC4f6Fe'),
  Address.fromString('0x02Cb3C150BEdca124d0aE8CcCb72fefbe705c953'),
  Address.fromString('0x6e8873085530406995170Da467010565968C7C62'),
  Address.fromString('0x7DAC9Fc15C1Db4379D75A6E3f330aE849dFfcE18'),
  Address.fromString('0xAb6D6a37c5110d1377832c451C33e4fA16A9BA05'),
  Address.fromString('0xcC7d34C76A9d08aa0109F7Bae35f29C1CE35355A'),
  Address.fromString('0xD165df4296C85e780509fa1eace0150d945d49Fd'),
  Address.fromString('0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6'),
  Address.fromString('0xF6CBDd6Ea6EC3C4359e33de0Ac823701Cc56C6c4'),
];

const epoch1Addresses = [
  Address.fromString('0x1c01595f9534E33d411035AE99a4317faeC4f6Fe'),
  Address.fromString('0x02Cb3C150BEdca124d0aE8CcCb72fefbe705c953'),
  Address.fromString('0x6e8873085530406995170Da467010565968C7C62'),
  Address.fromString('0x7DAC9Fc15C1Db4379D75A6E3f330aE849dFfcE18'),
  Address.fromString('0xAb6D6a37c5110d1377832c451C33e4fA16A9BA05'),
  Address.fromString('0xcC7d34C76A9d08aa0109F7Bae35f29C1CE35355A'),
  Address.fromString('0xD165df4296C85e780509fa1eace0150d945d49Fd'),
  Address.fromString('0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6'),
  Address.fromString('0xF6CBDd6Ea6EC3C4359e33de0Ac823701Cc56C6c4'),
  Address.fromString('0x0B7246eF74Ca7b37Fdc3D15be4f0b49876622F95'),
  Address.fromString('0x2DCDF80f439843D7E0aD1fEF9E7a439B7917eAc9'),
  Address.fromString('0x4A9a27d614a74Ee5524909cA27bdBcBB7eD3b315'),
  Address.fromString('0x4ADc8CC149A03F44386Bee80bab36F9e8022b195'),
  Address.fromString('0x8c89a6bf53cCF63e7B4465Cc1b1330723B4BdcB7'),
  Address.fromString('0x20a1B17087482de88Fac6D7B5aE23A7175fd1395'),
  Address.fromString('0x78e084445C3F1006617e1f36794dd2261ecE4AE3'),
  Address.fromString('0x149D46eC060e75AE188876AdB6b24024637003C7'),
  Address.fromString('0x15c941a44a343B8c46a28F2BB9aFc7a54E255A4f'),
  Address.fromString('0x3455FbB4D34C6b47999B66c83aA7BD8FDDade638'),
  Address.fromString('0x9531C059098e3d194fF87FebB587aB07B30B1306'),
  Address.fromString('0xCf3efCE169acEC1B281C05E863F78acCF62BD944'),
  Address.fromString('0xd1B8dB70Ded72dB850713b2ce7e1A4FfAfAD95d1'),
  Address.fromString('0xF0652a820dd39EC956659E0018Da022132f2f40a'),
  Address.fromString('0xfFbD35255008F86322051F2313D4b343540e0e00'),
];

describe('handleSetProposalAddresses', () => {
  beforeAll(() => {
    const epochProjects = new EpochProjects(Bytes.fromI32(0));
    epochProjects.epoch = 0;
    // eslint-disable-next-line no-undef
    epochProjects.projectsAddresses = changetype<Bytes[]>(epoch0Addresses);
    epochProjects.save();
  });

  afterAll(() => {
    // store.remove('EpochProjects', Bytes.fromI32(1).toHexString())
    clearStore();
  });

  test('Should create a new EpochProjects entity', () => {
    // const proposalsAddress = Address.fromString('0x91B904e8B0F9133D0766059065C2A1F6c6CAfA27')

    // createMockedFunction(
    //   proposalsAddress,
    //   'setProposalAddresses',
    //   'setProposalAddresses(uint256,address[])'
    // ).withArgs([
    //   ethereum.Value.fromI32(2),
    //   ethereum.Value.fromAddressArray(epoch1Addresses)
    // ])

    // const proposalsContract = Proposals.bind(proposalsAddress)
    // const values = proposalsContract.call('proposalsAddress', 'setProposalAddresses(uint256,address[])', [ethereum.Value.fromI32(2), ethereum.Value.fromAddressArray(epoch1Addresses)])
    const setProposalAddressesCall = createSetProposalAddressesCall(1, epoch1Addresses);
    handleSetProposalAddresses(setProposalAddressesCall);

    assert.entityCount('EpochProjects', 2);
    assert.fieldEquals('EpochProjects', Bytes.fromI32(0).toHexString(), 'epoch', '0');
    assert.fieldEquals('EpochProjects', Bytes.fromI32(1).toHexString(), 'epoch', '1');
    assert.fieldEquals(
      'EpochProjects',
      Bytes.fromI32(0).toHexString(),
      'projectsAddresses',
      '[0x00de4b13153673bcae2616b67bf822500d325fc3, 0x1c01595f9534e33d411035ae99a4317faec4f6fe, 0x02cb3c150bedca124d0ae8cccb72fefbe705c953, 0x6e8873085530406995170da467010565968c7c62, 0x7dac9fc15c1db4379d75a6e3f330ae849dffce18, 0xab6d6a37c5110d1377832c451c33e4fa16a9ba05, 0xcc7d34c76a9d08aa0109f7bae35f29c1ce35355a, 0xd165df4296c85e780509fa1eace0150d945d49fd, 0xde21f729137c5af1b01d73af1dc21effa2b8a0d6, 0xf6cbdd6ea6ec3c4359e33de0ac823701cc56c6c4]',
    );

    assert.fieldEquals(
      'EpochProjects',
      Bytes.fromI32(1).toHexString(),
      'projectsAddresses',
      '[0x1c01595f9534e33d411035ae99a4317faec4f6fe, 0x02cb3c150bedca124d0ae8cccb72fefbe705c953, 0x6e8873085530406995170da467010565968c7c62, 0x7dac9fc15c1db4379d75a6e3f330ae849dffce18, 0xab6d6a37c5110d1377832c451c33e4fa16a9ba05, 0xcc7d34c76a9d08aa0109f7bae35f29c1ce35355a, 0xd165df4296c85e780509fa1eace0150d945d49fd, 0xde21f729137c5af1b01d73af1dc21effa2b8a0d6, 0xf6cbdd6ea6ec3c4359e33de0ac823701cc56c6c4, 0x0b7246ef74ca7b37fdc3d15be4f0b49876622f95, 0x2dcdf80f439843d7e0ad1fef9e7a439b7917eac9, 0x4a9a27d614a74ee5524909ca27bdbcbb7ed3b315, 0x4adc8cc149a03f44386bee80bab36f9e8022b195, 0x8c89a6bf53ccf63e7b4465cc1b1330723b4bdcb7, 0x20a1b17087482de88fac6d7b5ae23a7175fd1395, 0x78e084445c3f1006617e1f36794dd2261ece4ae3, 0x149d46ec060e75ae188876adb6b24024637003c7, 0x15c941a44a343b8c46a28f2bb9afc7a54e255a4f, 0x3455fbb4d34c6b47999b66c83aa7bd8fddade638, 0x9531c059098e3d194ff87febb587ab07b30b1306, 0xcf3efce169acec1b281c05e863f78accf62bd944, 0xd1b8db70ded72db850713b2ce7e1a4ffafad95d1, 0xf0652a820dd39ec956659e0018da022132f2f40a, 0xffbd35255008f86322051f2313d4b343540e0e00]',
    );
  });
});
