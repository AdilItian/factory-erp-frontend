import { queryOptions, useQuery } from '@tanstack/react-query';
import { departmentKeys } from '@/lib/query-keys';
import departmentsService from './service';

export const departmentsListQueryOptions = (
  filters = { page: 1, limit: 20 }
) =>
  queryOptions({
    queryKey: departmentKeys.list(filters),
    queryFn: () => departmentsService.getDepartments(filters)
  });

export function useDepartmentsListQuery(filters, options) {
  return useQuery({
    ...departmentsListQueryOptions(filters),
    ...options
  });
}
