'use client';

import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

export function useListParams({ searchKey = 'q', perPage = 12 } = {}) {
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(perPage),
    [searchKey]: parseAsString
  });

  const search = params[searchKey] ?? '';

  return {
    page: params.page,
    perPage: params.perPage,
    search,
    setSearch: (value) =>
      void setParams({ [searchKey]: value || null, page: 1 }),
    setPage: (page) => void setParams({ page }),
    filters: {
      page: params.page,
      limit: params.perPage,
      ...(search.trim() ? { search: search.trim() } : {})
    }
  };
}
