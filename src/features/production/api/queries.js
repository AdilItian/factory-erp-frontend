import { queryOptions, useQuery } from '@tanstack/react-query';
import {
  bomKeys,
  bomTemplateKeys,
  gatePassKeys,
  workCenterKeys,
  workOrderKeys
} from '@/lib/query-keys';
import productionService from './service';

export const workCentersListQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: workCenterKeys.list(filters),
    queryFn: () => productionService.getWorkCenters(filters)
  });

export const bomTemplatesListQueryOptions = (
  filters = { page: 1, limit: 20 }
) =>
  queryOptions({
    queryKey: bomTemplateKeys.list(filters),
    queryFn: () => productionService.getBomTemplates(filters)
  });

export const bomsListQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: bomKeys.list(filters),
    queryFn: () => productionService.getBoms(filters)
  });

export const workOrdersListQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: workOrderKeys.list(filters),
    queryFn: () => productionService.getWorkOrders(filters)
  });

export const gatePassesListQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: gatePassKeys.list(filters),
    queryFn: () => productionService.getGatePasses(filters)
  });

export function useWorkCentersListQuery(filters, options) {
  return useQuery({ ...workCentersListQueryOptions(filters), ...options });
}

export function useWorkCentersOptionsQuery(options) {
  return useQuery({
    queryKey: workCenterKeys.options(),
    queryFn: async () => {
      const result = await productionService.getWorkCenters({
        page: 1,
        limit: 100
      });
      return result.items ?? [];
    },
    ...options
  });
}

export function useBomTemplatesListQuery(filters, options) {
  return useQuery({ ...bomTemplatesListQueryOptions(filters), ...options });
}

export function useBomTemplatesOptionsQuery(options) {
  return useQuery({
    queryKey: bomTemplateKeys.options(),
    queryFn: async () => {
      const result = await productionService.getBomTemplates({
        page: 1,
        limit: 100
      });
      return (result.items ?? []).filter((row) => row.isActive !== false);
    },
    ...options
  });
}

export function useBomTemplateDetailQuery(id, options) {
  return useQuery({
    queryKey: bomTemplateKeys.detail(id),
    queryFn: () => productionService.getBomTemplate(id),
    enabled: Boolean(id),
    ...options
  });
}

export function useBomsListQuery(filters, options) {
  return useQuery({ ...bomsListQueryOptions(filters), ...options });
}

export function useBomsOptionsQuery(options) {
  return useQuery({
    queryKey: bomKeys.options(),
    queryFn: async () => {
      const result = await productionService.getBoms({ page: 1, limit: 100 });
      return result.items ?? [];
    },
    ...options
  });
}

export function useBomDetailQuery(id, options) {
  return useQuery({
    queryKey: bomKeys.detail(id),
    queryFn: () => productionService.getBom(id),
    enabled: Boolean(id),
    ...options
  });
}

export function useWorkOrdersListQuery(filters, options) {
  return useQuery({ ...workOrdersListQueryOptions(filters), ...options });
}

export function useGatePassesListQuery(filters, options) {
  return useQuery({ ...gatePassesListQueryOptions(filters), ...options });
}

export function useGatePassDetailQuery(id, options) {
  return useQuery({
    queryKey: gatePassKeys.detail(id),
    queryFn: () => productionService.getGatePass(id),
    enabled: Boolean(id),
    ...options
  });
}

export function useProductionCatalog() {
  return productionService.getCatalog();
}
