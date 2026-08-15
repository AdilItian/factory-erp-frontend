import { queryOptions, useQuery } from '@tanstack/react-query';
import { purchaseOrderKeys, supplierKeys } from '@/lib/query-keys';
import purchasingService from './service';

export const suppliersListQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: supplierKeys.list(filters),
    queryFn: () => purchasingService.getSuppliers(filters)
  });

export const purchaseOrdersListQueryOptions = (
  filters = { page: 1, limit: 20 }
) =>
  queryOptions({
    queryKey: purchaseOrderKeys.list(filters),
    queryFn: () => purchasingService.getPurchaseOrders(filters)
  });

export function useSuppliersListQuery(filters, options) {
  return useQuery({ ...suppliersListQueryOptions(filters), ...options });
}

export function useSuppliersOptionsQuery(options) {
  return useQuery({
    queryKey: supplierKeys.options(),
    queryFn: async () => {
      const result = await purchasingService.getSuppliers({
        page: 1,
        limit: 100
      });
      return (result.items ?? []).filter((row) => row.isActive !== false);
    },
    ...options
  });
}

export function usePurchaseOrdersListQuery(filters, options) {
  return useQuery({ ...purchaseOrdersListQueryOptions(filters), ...options });
}

export function usePurchaseOrderDetailQuery(id, options) {
  return useQuery({
    queryKey: purchaseOrderKeys.detail(id),
    queryFn: () => purchasingService.getPurchaseOrder(id),
    enabled: Boolean(id),
    ...options
  });
}
