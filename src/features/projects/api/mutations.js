import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectKeys } from '@/lib/query-keys';
import projectsService from './service';

export function useCreateProjectMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload) => projectsService.createProject(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateProjectMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ projectId, payload }) =>
      projectsService.updateProject(projectId, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteProjectMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (projectId) => projectsService.deleteProject(projectId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useAssignProjectManagersMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ projectId, projectManagerIds }) =>
      projectsService.assignManagers(projectId, projectManagerIds),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useRemoveProjectManagerMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ projectId, userId }) =>
      projectsService.removeManager(projectId, userId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}
