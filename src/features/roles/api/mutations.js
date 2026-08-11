import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roleKeys, userKeys } from '@/lib/query-keys';
import rolesService from './service';

export function useCreateRoleMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload) => rolesService.createRole(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteRoleMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (roleId) => rolesService.deleteRole(roleId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useAssignRoleMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload) => rolesService.assignRole(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useRevokeRoleMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload) => rolesService.revokeRole(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}
