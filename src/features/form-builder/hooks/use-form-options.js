import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { getRegisteredOptionsMapper, getRegisteredQueryOptions } from '@/lib/options-query-registry';
import { getFields } from '../utils/resolve-form-config';
import { mapResponseToOptions } from '../utils/map-options';

function getQueryOptionSources(config) {
  const sources = new Map();

  for (const field of getFields(config)) {
    if (field.options?.source !== 'query') continue;

    const { queryRef } = field.options;
    if (!sources.has(queryRef)) {
      sources.set(queryRef, field.options);
    }
  }

  return Array.from(sources.entries()).map(([queryRef, optionsConfig]) => ({
    queryRef,
    optionsConfig
  }));
}

function getQueryOptions(queryRef) {
  const queryOptions = getRegisteredQueryOptions(queryRef);

  if (!queryOptions) {
    return {
      queryKey: ['form-builder', 'missing-query-ref', queryRef],
      queryFn: () => Promise.resolve([]),
      enabled: false
    };
  }

  return queryOptions;
}

export function useFormOptions(config) {
  const sources = useMemo(() => getQueryOptionSources(config), [config]);

  const queries = useQueries({
    queries: sources.map(({ queryRef }) => getQueryOptions(queryRef))
  });

  const fieldOptions = useMemo(() => {
    const resolved = {};

    sources.forEach(({ queryRef, optionsConfig }, index) => {
      const data = queries[index]?.data;
      const mapOptions = getRegisteredOptionsMapper(queryRef);

      resolved[queryRef] = data
        ? mapOptions
          ? mapOptions(data)
          : mapResponseToOptions(data, optionsConfig.map)
        : [];
    });

    return resolved;
  }, [sources, queries]);

  const fieldOptionsLoading = useMemo(() => {
    const loading = {};

    sources.forEach(({ queryRef }, index) => {
      const query = queries[index];
      loading[queryRef] = Boolean(query?.isPending && !query?.data);
    });

    return loading;
  }, [sources, queries]);

  return { fieldOptions, fieldOptionsLoading };
}
