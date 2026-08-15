import { queryOptions, useQuery } from '@tanstack/react-query';
import { posKeys } from '@/lib/query-keys';
import posService from './service';

export const posSalesListQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: posKeys.list(filters),
    queryFn: () => posService.getSales(filters)
  });

export function usePosOutletsQuery(options) {
  return useQuery({
    queryKey: posKeys.outlets(),
    queryFn: () => posService.getOutlets(),
    ...options
  });
}

export function usePosCatalogQuery(options) {
  return useQuery({
    queryKey: posKeys.catalog(),
    queryFn: () => posService.getSellableItems(),
    ...options
  });
}

export function usePosSalesListQuery(filters, options) {
  return useQuery({ ...posSalesListQueryOptions(filters), ...options });
}

export function usePosSaleDetailQuery(id, options) {
  return useQuery({
    queryKey: posKeys.detail(id),
    queryFn: () => posService.getSale(id),
    enabled: Boolean(id),
    ...options
  });
}

export const posReturnsListQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: posKeys.returnList(filters),
    queryFn: () => posService.getReturns(filters)
  });

export function usePosReturnsListQuery(filters, options) {
  return useQuery({ ...posReturnsListQueryOptions(filters), ...options });
}

export function usePosReturnDetailQuery(id, options) {
  return useQuery({
    queryKey: posKeys.returnDetail(id),
    queryFn: () => posService.getReturn(id),
    enabled: Boolean(id),
    ...options
  });
}

export function usePosCompletedSalesOptionsQuery(options) {
  return useQuery({
    queryKey: [...posKeys.lists(), 'completed-options'],
    queryFn: async () => {
      const result = await posService.getSales({ page: 1, limit: 100 });
      return (result.items ?? []).filter((row) => row.status === 'COMPLETED');
    },
    ...options
  });
}
