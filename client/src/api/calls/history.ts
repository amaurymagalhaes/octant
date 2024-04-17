import env from 'env';
import apiService from 'services/apiService';

export type PatronModeEventType = {
  amount: string; // (wei) string
  epoch: number;
};

export type BlockchainEventType = {
  amount: string; // (wei) string
  transactionHash: string;
};

export type AllocationEventType = {
  allocations: {
    amount: string; // (wei) string
    project: string;
  }[];
  isManuallyEdited: boolean | null;
  leverage: string;
};

type EventType = {
  eventData: PatronModeEventType | BlockchainEventType | AllocationEventType;
  timestamp: string;
  type: 'lock' | 'unlock' | 'allocation' | 'withdrawal' | 'patron_mode_donation';
};

export type ResponseHistoryItem = EventType;

export type Response = { history: ResponseHistoryItem[]; nextCursor?: string };

export async function apiGetHistory(address: string, cursor?: string): Promise<Response> {
  return apiService
    .get(`${env.serverEndpoint}history/${address}?limit=12${cursor ? `&cursor=${cursor}` : ''}`)
    .then(({ data }) => data);
}
