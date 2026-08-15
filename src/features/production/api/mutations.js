import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  bomKeys,
  bomTemplateKeys,
  gatePassKeys,
  workCenterKeys,
  workOrderKeys
} from '@/lib/query-keys';
import productionService from './service';

function invalidate(queryClient, key) {
  queryClient.invalidateQueries({ queryKey: key });
}

export function useCreateWorkCenterMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => productionService.createWorkCenter(payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, workCenterKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateWorkCenterMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      productionService.updateWorkCenter(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, workCenterKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteWorkCenterMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => productionService.deleteWorkCenter(id),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, workCenterKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useCreateBomTemplateMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => productionService.createBomTemplate(payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, bomTemplateKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateBomTemplateMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      productionService.updateBomTemplate(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, bomTemplateKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteBomTemplateMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => productionService.deleteBomTemplate(id),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, bomTemplateKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useCreateBomMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => productionService.createBom(payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, bomKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateBomMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) => productionService.updateBom(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, bomKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteBomMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => productionService.deleteBom(id),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, bomKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useAddBomLineMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) => productionService.addBomLine(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, bomKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useRemoveBomLineMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, lineId }) =>
      productionService.removeBomLine(id, lineId),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, bomKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useCreateWorkOrderMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => productionService.createWorkOrder(payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, workOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateWorkOrderMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      productionService.updateWorkOrder(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, workOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteWorkOrderMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => productionService.deleteWorkOrder(id),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, workOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useSetWorkOrderStatusMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, status }) =>
      productionService.setWorkOrderStatus(id, status),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, workOrderKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useCreateGatePassMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload) => productionService.createGatePass(payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, gatePassKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useUpdateGatePassMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      productionService.updateGatePass(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, gatePassKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useDeleteGatePassMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => productionService.deleteGatePass(id),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, gatePassKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useAddGatePassLineMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) =>
      productionService.addGatePassLine(id, payload),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, gatePassKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useRemoveGatePassLineMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, lineId }) =>
      productionService.removeGatePassLine(id, lineId),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, gatePassKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}

export function useSetGatePassStatusMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, status }) =>
      productionService.setGatePassStatus(id, status),
    onSuccess: (data, variables, context) => {
      invalidate(queryClient, gatePassKeys.all);
      options.onSuccess?.(data, variables, context);
    }
  });
}
