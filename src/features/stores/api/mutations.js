import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storeKeys } from '@/lib/query-keys';
import storesService from './service';

export function useCreateStoreMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload) => storesService.createStore(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateStoreMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) => storesService.updateStore(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteStoreMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (id) => storesService.deleteStore(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useProvisionStoresMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (locationId) => storesService.provisionStores(locationId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}
