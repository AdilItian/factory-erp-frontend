import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { projectKeys } from '@/lib/query-keys';
import projectsService from './service';

export const projectsListQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: projectKeys.list(filters),
    queryFn: () => projectsService.getProjects(filters)
  });

export function useProjectsListQuery(filters, options) {
  return useQuery({
    ...projectsListQueryOptions(filters),
    ...options
  });
}

export function useProjectsListSuspenseQuery(filters, options) {
  return useSuspenseQuery({
    ...projectsListQueryOptions(filters),
    ...options
  });
}
