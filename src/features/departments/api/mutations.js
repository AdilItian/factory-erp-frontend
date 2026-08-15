import { useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentKeys } from '@/lib/query-keys';
import departmentsService from './service';

export function useCreateDepartmentMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload) => departmentsService.createDepartment(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateDepartmentMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      departmentsService.updateDepartment(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteDepartmentMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (id) => departmentsService.deleteDepartment(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}
