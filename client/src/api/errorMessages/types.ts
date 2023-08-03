import { QueryKeys, Root } from 'api/queryKeys/types';

export type QueryMutationError = {
  message: string;
  type: 'inline' | 'toast';
};

export type QueryMutationErrorConfig = {
  [key: string]: QueryMutationError;
};

export type IgnoredQueries = [Root['cryptoValues'], QueryKeys['glmClaimCheck'][0]];
