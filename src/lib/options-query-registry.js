import {
  mapRolesToOptions,
  rolesQueryOptions
} from '@/features/roles/api/queries';
import {
  mapUsersToOptions,
  usersOptionsQueryOptions
} from '@/features/users/api/management-queries';

/**
 * Shared query registry for form select options.
 * Register a queryRef here once — forms and listing pages
 * share the same TanStack Query cache.
 */
export const OPTIONS_QUERY_REGISTRY = {
  roles: {
    getQueryOptions: rolesQueryOptions,
    mapOptions: mapRolesToOptions
  },
  users: {
    getQueryOptions: usersOptionsQueryOptions,
    mapOptions: mapUsersToOptions
  }
};

export function getRegisteredQueryOptions(queryRef) {
  const entry = OPTIONS_QUERY_REGISTRY[queryRef];
  if (!entry) return null;

  return entry.getQueryOptions();
}

export function getRegisteredOptionsMapper(queryRef) {
  const entry = OPTIONS_QUERY_REGISTRY[queryRef];
  return entry?.mapOptions ?? null;
}
