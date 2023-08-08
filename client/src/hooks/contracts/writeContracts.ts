import { Hash } from 'viem';
import { WalletClient } from 'wagmi';

import env from 'env';

import Deposits from './abi/Deposits.json';
import ERC20 from './abi/ERC20.json';
import Vault from './abi/Vault.json';

type WriteContract = {
  args: unknown[];
  functionName: string;
  walletClient: WalletClient;
};

export function writeContractERC20({
  walletClient,
  functionName,
  args,
}: WriteContract): Promise<Hash> {
  return walletClient.writeContract({
    abi: ERC20.abi,
    address: env.contractGlmAddress as `0x{string}`,
    args,
    functionName,
  });
}

export function writeContractDeposits({
  walletClient,
  functionName,
  args,
}: WriteContract): Promise<Hash> {
  return walletClient.writeContract({
    abi: Deposits.abi,
    address: env.contractDepositsAddress as `0x{string}`,
    args,
    functionName,
  });
}

export function writeContractVault({
  walletClient,
  functionName,
  args,
}: WriteContract): Promise<Hash> {
  return walletClient.writeContract({
    abi: Vault.abi,
    address: env.contractVaultAddress as `0x{string}`,
    args,
    functionName,
  });
}
