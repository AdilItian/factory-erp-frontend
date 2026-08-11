import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { userKeys } from '@/lib/query-keys';
import usersService, { mapUsersToOptions } from './live-service';

export { mapUsersToOptions };

export const usersListQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: userKeys.list(filters),
    queryFn: () => usersService.getUsers(filters)
  });

export const usersOptionsQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.options(),
    queryFn: async () => {
      const result = await usersService.getUsers({ page: 1, limit: 100 });
      return result.users;
    }
  });

export function useUsersListQuery(filters, options) {
  return useQuery({
    ...usersListQueryOptions(filters),
    ...options
  });
}

export function useUsersListSuspenseQuery(filters, options) {
  return useSuspenseQuery({
    ...usersListQueryOptions(filters),
    ...options
  });
}

export function useUsersOptionsQuery(options) {
  return useQuery({
    ...usersOptionsQueryOptions(),
    ...options
  });
}
