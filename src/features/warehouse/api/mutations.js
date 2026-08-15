import { useMutation, useQueryClient } from '@tanstack/react-query';
import { warehouseDocKeys } from '@/lib/query-keys';
import warehouseService from './service';

function invalidate(queryClient, type) {
  queryClient.invalidateQueries({ queryKey: warehouseDocKeys.all(type) });
}

export function useCreateWarehouseDocMutation(type, options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => warehouseService.create(type, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, type);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateWarehouseDocMutation(type, options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      warehouseService.update(type, id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, type);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteWarehouseDocMutation(type, options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => warehouseService.remove(type, id),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, type);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useAddWarehouseDocLineMutation(type, options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      warehouseService.addLine(type, id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, type);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useRemoveWarehouseDocLineMutation(type, options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, lineId }) =>
      warehouseService.removeLine(type, id, lineId),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, type);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useSetWarehouseDocStatusMutation(type, options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, status }) =>
      warehouseService.setStatus(type, id, status),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, type);
      options.onSuccess?.(data, variables, context);
    }
  });
}
