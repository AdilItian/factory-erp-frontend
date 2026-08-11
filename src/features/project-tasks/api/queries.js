import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { projectKeys, taskKeys } from '@/lib/query-keys';
import projectsService from '@/features/projects/api/service';
import projectTasksService from './service';

export const projectTasksQueryOptions = (
  projectId,
  filters = { page: 1, limit: 20 }
) =>
  queryOptions({
    queryKey: taskKeys.project(projectId, filters),
    queryFn: () => projectTasksService.getProjectTasks(projectId, filters),
    enabled: Boolean(projectId)
  });

export const myTasksQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: taskKeys.mine(filters),
    queryFn: () => projectTasksService.getMyTasks(filters)
  });

export const projectDetailQueryOptions = (projectId) =>
  queryOptions({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => projectsService.getProject(projectId),
    enabled: Boolean(projectId)
  });

export function useProjectTasksSuspenseQuery(projectId, filters, options) {
  return useSuspenseQuery({
    ...projectTasksQueryOptions(projectId, filters),
    ...options
  });
}

export function useMyTasksSuspenseQuery(filters, options) {
  return useSuspenseQuery({
    ...myTasksQueryOptions(filters),
    ...options
  });
}

export function useProjectDetailQuery(projectId, options) {
  return useQuery({
    ...projectDetailQueryOptions(projectId),
    ...options
  });
}
