import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { roleKeys } from '@/lib/query-keys';
import rolesService from './service';
import { getRoleId, getRoleName } from '../utils/normalize-role';

export const rolesQueryOptions = () =>
  queryOptions({
    queryKey: roleKeys.list(),
    queryFn: () => rolesService.getRoles()
  });

export function useRolesQuery(options) {
  return useQuery({
    ...rolesQueryOptions(),
    ...options
  });
}

export function useRolesSuspenseQuery(options) {
  return useSuspenseQuery({
    ...rolesQueryOptions(),
    ...options
  });
}

export function mapRolesToOptions(roles) {
  return (roles ?? []).map((role) => {
    const value = getRoleId(role);
    const label = getRoleName(role);

    return { label, value };
  });
}
