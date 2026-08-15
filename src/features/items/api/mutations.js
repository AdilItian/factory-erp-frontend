import { useMutation, useQueryClient } from '@tanstack/react-query';
import { itemCategoryKeys, itemKeys } from '@/lib/query-keys';
import itemsService from './service';

export function useCreateItemMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => itemsService.createItem(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateItemMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) => itemsService.updateItem(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteItemMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => itemsService.deleteItem(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useCreateItemCategoryMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => itemsService.createCategory(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: itemCategoryKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateItemCategoryMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      itemsService.updateCategory(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: itemCategoryKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteItemCategoryMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => itemsService.deleteCategory(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: itemCategoryKeys.all });
      options.onSuccess?.(data, variables, context);
    }
  });
}
