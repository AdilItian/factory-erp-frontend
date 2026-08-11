import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userKeys } from '@/lib/query-keys';
import usersService from './live-service';

export function useInviteUserMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload) => usersService.inviteUser(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateUserMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ userId, payload }) => usersService.updateUser(userId, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteUserMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (userId) => usersService.deleteUser(userId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}
