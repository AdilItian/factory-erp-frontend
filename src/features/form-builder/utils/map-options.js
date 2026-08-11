export function mapResponseToOptions(items, map) {
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    label: item[map.label],
    value: String(item[map.value])
  }));
}

export function getResponseData(payload, dataPath) {
  if (dataPath) {
    return dataPath.split('.').reduce((value, key) => value?.[key], payload);
  }

  if (Array.isArray(payload)) return payload;

  return payload?.data ?? payload;
}
