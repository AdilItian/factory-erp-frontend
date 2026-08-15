import { queryOptions, useQuery } from '@tanstack/react-query';
import { customerKeys, salesOrderKeys } from '@/lib/query-keys';
import salesService from './service';

export const customersListQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: customerKeys.list(filters),
    queryFn: () => salesService.getCustomers(filters)
  });

export const salesOrdersListQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: salesOrderKeys.list(filters),
    queryFn: () => salesService.getSalesOrders(filters)
  });

export function useCustomersListQuery(filters, options) {
  return useQuery({ ...customersListQueryOptions(filters), ...options });
}

export function useCustomersOptionsQuery(options) {
  return useQuery({
    queryKey: customerKeys.options(),
    queryFn: async () => {
      const result = await salesService.getCustomers({ page: 1, limit: 100 });
      return (result.items ?? []).filter((row) => row.isActive !== false);
    },
    ...options
  });
}

export function useSalesOrdersListQuery(filters, options) {
  return useQuery({ ...salesOrdersListQueryOptions(filters), ...options });
}

export function useSalesOrderDetailQuery(id, options) {
  return useQuery({
    queryKey: salesOrderKeys.detail(id),
    queryFn: () => salesService.getSalesOrder(id),
    enabled: Boolean(id),
    ...options
  });
}
