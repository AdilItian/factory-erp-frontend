import { queryOptions, useQuery } from '@tanstack/react-query';
import { inventoryKeys } from '@/lib/query-keys';
import inventoryService from './service';

export const onHandQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: inventoryKeys.onHand(filters),
    queryFn: () => inventoryService.getOnHand(filters)
  });

export const ledgerQueryOptions = (filters = { page: 1, limit: 50 }) =>
  queryOptions({
    queryKey: inventoryKeys.ledger(filters),
    queryFn: () => inventoryService.getLedger(filters)
  });

export function useOnHandQuery(filters, options) {
  return useQuery({
    ...onHandQueryOptions(filters),
    ...options
  });
}

export function useLedgerQuery(filters, options) {
  return useQuery({
    ...ledgerQueryOptions(filters),
    ...options
  });
}
