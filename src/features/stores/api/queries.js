import { queryOptions, useQuery } from '@tanstack/react-query';
import { storeKeys } from '@/lib/query-keys';
import storesService from './service';

export const storesListQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: storeKeys.list(filters),
    queryFn: () => storesService.getStores(filters)
  });

export function useStoresListQuery(filters, options) {
  return useQuery({
    ...storesListQueryOptions(filters),
    ...options
  });
}

export function useStoresOptionsQuery(options) {
  return useQuery({
    queryKey: storeKeys.options(),
    queryFn: async () => {
      const result = await storesService.getStores({ page: 1, limit: 100 });
      return result.items ?? [];
    },
    ...options
  });
}
