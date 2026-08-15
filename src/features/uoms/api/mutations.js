import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uomConversionKeys, uomKeys } from '@/lib/query-keys';
import uomsService from './service';

export function useCreateUomMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => uomsService.createUom(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: uomKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateUomMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) => uomsService.updateUom(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: uomKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteUomMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => uomsService.deleteUom(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: uomKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useCreateUomConversionMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => uomsService.createConversion(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: uomConversionKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteUomConversionMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => uomsService.deleteConversion(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: uomConversionKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}
