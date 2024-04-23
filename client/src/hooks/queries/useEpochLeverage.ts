import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { apiGetEpochLeverage, Response } from 'api/calls/epochLeverage';
import { QUERY_KEYS } from 'api/queryKeys';

export default function useEpochLeverage(
  epoch: number | undefined,
  options?: UseQueryOptions<Response, unknown, number, any>,
): UseQueryResult<number, unknown> {
  return useQuery({
    enabled: !!epoch,
    queryFn: ({ signal }) => apiGetEpochLeverage(epoch!, signal),
    queryKey: QUERY_KEYS.epochLeverage(epoch!),
    select: response => response.leverage,
    ...options,
  });
}
