import { useMutation, useQueryClient } from '@tanstack/react-query';
import { locationKeys, storeKeys } from '@/lib/query-keys';
import locationsService from './service';

export function useCreateLocationMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload) => locationsService.createLocation(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateLocationMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      locationsService.updateLocation(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteLocationMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (id) => locationsService.deleteLocation(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useAssignLocationUsersMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) => locationsService.assignUsers(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useRemoveLocationUserMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, userId }) => locationsService.removeUser(id, userId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}
