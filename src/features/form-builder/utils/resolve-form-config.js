export function getFields(config) {
  if (Array.isArray(config)) return config;
  return config?.fields ?? [];
}

function getOptionsLookupKey(options) {
  if (options.source === 'query') return options.queryRef;
  if (options.source === 'api') return options.queryKey;
  return null;
}

function resolveFieldOptions(field, fieldOptions, fieldOptionsLoading) {
  const { options } = field;

  if (!options) return field;

  if (Array.isArray(options)) {
    return field;
  }

  if (options.source === 'static') {
    return {
      ...field,
      options: options.items ?? [],
      loading: false
    };
  }

  if (options.source === 'query' || options.source === 'api') {
    const lookupKey = getOptionsLookupKey(options);

    return {
      ...field,
      options: fieldOptions[lookupKey] ?? [],
      loading: fieldOptionsLoading[lookupKey] ?? false
    };
  }

  return field;
}

export function resolveFormConfig(config, fieldOptions = {}, fieldOptionsLoading = {}) {
  const fields = getFields(config).map((field) =>
    resolveFieldOptions(field, fieldOptions, fieldOptionsLoading)
  );

  if (Array.isArray(config)) return fields;

  return {
    ...config,
    fields
  };
}

export function getQueryOptionFields(config) {
  return getFields(config).filter((field) => field.options?.source === 'query');
}
