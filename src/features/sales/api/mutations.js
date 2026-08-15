import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerKeys, salesOrderKeys } from '@/lib/query-keys';
import salesService from './service';

function invalidate(queryClient, key) {
  queryClient.invalidateQueries({ queryKey: key });
}

export function useCreateCustomerMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => salesService.createCustomer(payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, customerKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateCustomerMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) => salesService.updateCustomer(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, customerKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteCustomerMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => salesService.deleteCustomer(id),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, customerKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useCreateSalesOrderMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => salesService.createSalesOrder(payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, salesOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateSalesOrderMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      salesService.updateSalesOrder(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, salesOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteSalesOrderMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => salesService.deleteSalesOrder(id),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, salesOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useAddSalesOrderLineMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      salesService.addSalesOrderLine(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, salesOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useRemoveSalesOrderLineMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, lineId }) =>
      salesService.removeSalesOrderLine(id, lineId),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, salesOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useSetSalesOrderStatusMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, status }) =>
      salesService.setSalesOrderStatus(id, status),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, salesOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}
