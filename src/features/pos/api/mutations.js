import { useMutation, useQueryClient } from '@tanstack/react-query';
import { posKeys } from '@/lib/query-keys';
import posService from './service';

function invalidate(queryClient) {
  queryClient.invalidateQueries({ queryKey: posKeys.all });
}

export function useCreatePosSaleMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => posService.createSale(payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useVoidPosSaleMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => posService.voidSale(id),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useCreatePosReturnMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => posService.createReturn(payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdatePosReturnMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) => posService.updateReturn(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeletePosReturnMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => posService.deleteReturn(id),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useAddPosReturnLineMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) => posService.addReturnLine(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useRemovePosReturnLineMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, lineId }) => posService.removeReturnLine(id, lineId),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useCompletePosReturnMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => posService.completeReturn(id),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient);
      options.onSuccess?.(data, variables, context);
    }
  });
}
