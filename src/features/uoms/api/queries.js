import { queryOptions, useQuery } from '@tanstack/react-query';
import { uomConversionKeys, uomKeys } from '@/lib/query-keys';
import uomsService from './service';

export const uomsListQueryOptions = (filters = {}) =>
  queryOptions({
    queryKey: uomKeys.list(filters),
    queryFn: () => uomsService.getUoms(filters)
  });

export const uomConversionsQueryOptions = () =>
  queryOptions({
    queryKey: uomConversionKeys.list(),
    queryFn: () => uomsService.getConversions()
  });

export function useUomsListQuery(filters, options) {
  return useQuery({
    ...uomsListQueryOptions(filters),
    ...options
  });
}

export function useUomConversionsQuery(options) {
  return useQuery({
    ...uomConversionsQueryOptions(),
    ...options
  });
}

export function useUomsOptionsQuery(options) {
  return useQuery({
    queryKey: uomKeys.options(),
    queryFn: () => uomsService.getUoms(),
    ...options
  });
}
