import { queryOptions, useQuery } from '@tanstack/react-query';
import { warehouseDocKeys } from '@/lib/query-keys';
import warehouseService from './service';

export const warehouseDocsListQueryOptions = (
  type,
  filters = { page: 1, limit: 20 }
) =>
  queryOptions({
    queryKey: warehouseDocKeys.list(type, filters),
    queryFn: () => warehouseService.list(type, filters)
  });

export function useWarehouseDocsListQuery(type, filters, options) {
  return useQuery({
    ...warehouseDocsListQueryOptions(type, filters),
    ...options
  });
}

export function useWarehouseDocDetailQuery(type, id, options) {
  return useQuery({
    queryKey: warehouseDocKeys.detail(type, id),
    queryFn: () => warehouseService.get(type, id),
    enabled: Boolean(id),
    ...options
  });
}
