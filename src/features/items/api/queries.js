import { queryOptions, useQuery } from '@tanstack/react-query';
import { itemCategoryKeys, itemKeys } from '@/lib/query-keys';
import itemsService from './service';

export const itemsListQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: itemKeys.list(filters),
    queryFn: () => itemsService.getItems(filters)
  });

export const itemCategoriesQueryOptions = (filters = {}) =>
  queryOptions({
    queryKey: itemCategoryKeys.list(filters),
    queryFn: () => itemsService.getCategories(filters)
  });

export function useItemsListQuery(filters, options) {
  return useQuery({
    ...itemsListQueryOptions(filters),
    ...options
  });
}

export function useItemCategoriesQuery(filters, options) {
  return useQuery({
    ...itemCategoriesQueryOptions(filters),
    ...options
  });
}

export function useItemsOptionsQuery(options) {
  return useQuery({
    queryKey: itemKeys.options(),
    queryFn: async () => {
      const result = await itemsService.getItems({ page: 1, limit: 100 });
      return result.items ?? [];
    },
    ...options
  });
}
