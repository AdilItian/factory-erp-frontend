import { queryOptions, useQuery } from '@tanstack/react-query';
import { locationKeys } from '@/lib/query-keys';
import locationsService from './service';

export const locationsListQueryOptions = (filters = { page: 1, limit: 20 }) =>
  queryOptions({
    queryKey: locationKeys.list(filters),
    queryFn: () => locationsService.getLocations(filters)
  });

export const locationUsersQueryOptions = (locationId) =>
  queryOptions({
    queryKey: locationKeys.users(locationId),
    queryFn: () => locationsService.getLocationUsers(locationId),
    enabled: Boolean(locationId)
  });

export function useLocationsListQuery(filters, options) {
  return useQuery({
    ...locationsListQueryOptions(filters),
    ...options
  });
}

export function useLocationUsersQuery(locationId, options) {
  return useQuery({
    ...locationUsersQueryOptions(locationId),
    ...options
  });
}

export function useLocationsOptionsQuery(options) {
  return useQuery({
    queryKey: locationKeys.options(),
    queryFn: async () => {
      const result = await locationsService.getLocations({
        page: 1,
        limit: 100
      });
      return result.items ?? [];
    },
    ...options
  });
}
