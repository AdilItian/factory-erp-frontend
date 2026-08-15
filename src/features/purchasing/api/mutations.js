import { useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseOrderKeys, supplierKeys } from '@/lib/query-keys';
import purchasingService from './service';

function invalidate(queryClient, key) {
  queryClient.invalidateQueries({ queryKey: key });
}

export function useCreateSupplierMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => purchasingService.createSupplier(payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, supplierKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateSupplierMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      purchasingService.updateSupplier(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, supplierKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteSupplierMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => purchasingService.deleteSupplier(id),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, supplierKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useCreatePurchaseOrderMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => purchasingService.createPurchaseOrder(payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, purchaseOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdatePurchaseOrderMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      purchasingService.updatePurchaseOrder(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, purchaseOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeletePurchaseOrderMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => purchasingService.deletePurchaseOrder(id),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, purchaseOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useAddPurchaseOrderLineMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      purchasingService.addPurchaseOrderLine(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, purchaseOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useRemovePurchaseOrderLineMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, lineId }) =>
      purchasingService.removePurchaseOrderLine(id, lineId),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, purchaseOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useSetPurchaseOrderStatusMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, status }) =>
      purchasingService.setPurchaseOrderStatus(id, status),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, purchaseOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}
