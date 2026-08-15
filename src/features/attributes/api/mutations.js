import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  attributeGroupKeys,
  attributeKeys,
  attributeSetKeys
} from '@/lib/query-keys';
import attributesService from './service';

function invalidate(queryClient, keys, options, data, variables, context) {
  keys.forEach((queryKey) => {
    queryClient.invalidateQueries({ queryKey });
  });
  options.onSuccess?.(data, variables, context);
}

export function useCreateAttributeMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => attributesService.createAttribute(payload),
    onSuccess: (data, variables, context) =>
      invalidate(queryClient, [attributeKeys.all], options, data, variables, context)
  });
}

export function useUpdateAttributeMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      attributesService.updateAttribute(id, payload),
    onSuccess: (data, variables, context) =>
      invalidate(queryClient, [attributeKeys.all], options, data, variables, context)
  });
}

export function useDeleteAttributeMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => attributesService.deleteAttribute(id),
    onSuccess: (data, variables, context) =>
      invalidate(queryClient, [attributeKeys.all], options, data, variables, context)
  });
}

export function useAddAttributeOptionMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) => attributesService.addOption(id, payload),
    onSuccess: (data, variables, context) =>
      invalidate(queryClient, [attributeKeys.all], options, data, variables, context)
  });
}

export function useDeleteAttributeOptionMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, optionId }) =>
      attributesService.deleteOption(id, optionId),
    onSuccess: (data, variables, context) =>
      invalidate(queryClient, [attributeKeys.all], options, data, variables, context)
  });
}

export function useCreateAttributeGroupMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => attributesService.createGroup(payload),
    onSuccess: (data, variables, context) =>
      invalidate(
        queryClient,
        [attributeGroupKeys.all],
        options,
        data,
        variables,
        context
      )
  });
}

export function useUpdateAttributeGroupMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      attributesService.updateGroup(id, payload),
    onSuccess: (data, variables, context) =>
      invalidate(
        queryClient,
        [attributeGroupKeys.all],
        options,
        data,
        variables,
        context
      )
  });
}

export function useDeleteAttributeGroupMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => attributesService.deleteGroup(id),
    onSuccess: (data, variables, context) =>
      invalidate(
        queryClient,
        [attributeGroupKeys.all],
        options,
        data,
        variables,
        context
      )
  });
}

export function useCreateAttributeSetMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => attributesService.createSet(payload),
    onSuccess: (data, variables, context) =>
      invalidate(queryClient, [attributeSetKeys.all], options, data, variables, context)
  });
}

export function useUpdateAttributeSetMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) => attributesService.updateSet(id, payload),
    onSuccess: (data, variables, context) =>
      invalidate(queryClient, [attributeSetKeys.all], options, data, variables, context)
  });
}

export function useDeleteAttributeSetMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => attributesService.deleteSet(id),
    onSuccess: (data, variables, context) =>
      invalidate(queryClient, [attributeSetKeys.all], options, data, variables, context)
  });
}

export function useAddSetAttributeMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      attributesService.addSetAttribute(id, payload),
    onSuccess: (data, variables, context) =>
      invalidate(queryClient, [attributeSetKeys.all], options, data, variables, context)
  });
}

export function useRemoveSetAttributeMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, attributeId }) =>
      attributesService.removeSetAttribute(id, attributeId),
    onSuccess: (data, variables, context) =>
      invalidate(queryClient, [attributeSetKeys.all], options, data, variables, context)
  });
}
