import { queryOptions, useQuery } from '@tanstack/react-query';
import {
  attributeGroupKeys,
  attributeKeys,
  attributeSetKeys
} from '@/lib/query-keys';
import attributesService from './service';

export const attributesListQueryOptions = (
  filters = { page: 1, limit: 20 }
) =>
  queryOptions({
    queryKey: attributeKeys.list(filters),
    queryFn: () => attributesService.getAttributes(filters)
  });

export const attributeDetailQueryOptions = (id) =>
  queryOptions({
    queryKey: attributeKeys.detail(id),
    queryFn: () => attributesService.getAttribute(id),
    enabled: Boolean(id)
  });

export const attributeGroupsQueryOptions = () =>
  queryOptions({
    queryKey: attributeGroupKeys.list({}),
    queryFn: () => attributesService.getGroups()
  });

export const attributeSetsQueryOptions = () =>
  queryOptions({
    queryKey: attributeSetKeys.list({}),
    queryFn: () => attributesService.getSets()
  });

export const attributeSetDetailQueryOptions = (id) =>
  queryOptions({
    queryKey: attributeSetKeys.detail(id),
    queryFn: () => attributesService.getSet(id),
    enabled: Boolean(id)
  });

export function useAttributesListQuery(filters, options) {
  return useQuery({
    ...attributesListQueryOptions(filters),
    ...options
  });
}

export function useAttributeDetailQuery(id, options) {
  return useQuery({
    ...attributeDetailQueryOptions(id),
    ...options
  });
}

export function useAttributeGroupsQuery(options) {
  return useQuery({
    ...attributeGroupsQueryOptions(),
    ...options
  });
}

export function useAttributeSetsQuery(options) {
  return useQuery({
    ...attributeSetsQueryOptions(),
    ...options
  });
}

export function useAttributeSetDetailQuery(id, options) {
  return useQuery({
    ...attributeSetDetailQueryOptions(id),
    ...options
  });
}

export function useAttributesOptionsQuery(options) {
  return useQuery({
    queryKey: attributeKeys.options(),
    queryFn: async () => {
      const result = await attributesService.getAttributes({
        page: 1,
        limit: 100
      });
      return result.items ?? [];
    },
    ...options
  });
}
