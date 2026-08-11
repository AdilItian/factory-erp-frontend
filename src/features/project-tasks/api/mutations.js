import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskKeys } from '@/lib/query-keys';
import projectTasksService from './service';

export function useCreateProjectTaskMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ projectId, payload }) =>
      projectTasksService.createProjectTask(projectId, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateTaskMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ taskId, payload }) =>
      projectTasksService.updateTask(taskId, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteTaskMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (taskId) => projectTasksService.deleteTask(taskId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}
