import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useAccount, usePublicClient } from 'wagmi';

import { QUERY_KEYS } from 'api/queryKeys';
import { readContractDeposits } from 'hooks/contracts/readContracts';

export default function useDepositValue(): UseQueryResult<BigNumber> {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  return useQuery(
    QUERY_KEYS.depositsValue,
    () =>
      readContractDeposits({
        args: [address],
        functionName: 'deposits',
        publicClient,
      }),
    {
      enabled: !!address,
      select: response => BigNumber.from(response),
    },
  );
}
