export function pageLimit(value, max = 100) {
  const parsed = Number(value ?? 20);
  if (!Number.isFinite(parsed) || parsed < 1) return Math.min(20, max);
  return Math.min(Math.trunc(parsed), max);
}

export function unwrapPayload(data) {
  return data?.data ?? data;
}

export function collectList(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  const candidates = [
    payload.items,
    payload.content,
    payload.results,
    payload.records,
    payload.rows,
    payload.locations,
    payload.stores,
    payload.departments,
    payload.uoms,
    payload.attributes,
    payload.groups,
    payload.sets,
    payload.categories,
    payload.balances,
    payload.ledger,
    payload.movements,
    payload.batches,
    payload.conversions,
    payload.options,
    payload.users,
    payload.workCenters,
    payload.boms,
    payload.workOrders,
    payload.gatePasses,
    payload.lines,
    payload.data
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  if (payload.data && typeof payload.data === 'object') {
    return collectList(payload.data);
  }

  return [];
}

export function readTotal(payload, data, fallback) {
  const sources = [
    payload,
    payload?.meta,
    payload?.pagination,
    data,
    data?.meta,
    data?.data
  ];

  for (const source of sources) {
    if (!source || typeof source !== 'object') continue;
    const total =
      source.total ??
      source.totalItems ??
      source.total_items ??
      source.totalElements ??
      source.total_count ??
      source.count;
    if (total != null && total !== '') return Number(total);
  }

  return fallback;
}

export function normalizePagedList(data, params = {}) {
  const payload = unwrapPayload(data);
  const items = collectList(payload);
  const total = readTotal(payload, data, items.length);

  return {
    items,
    total: Number.isFinite(total) ? total : items.length,
    page: params.page ?? 1,
    limit: params.limit ?? 20
  };
}

export function normalizeArray(data) {
  return collectList(unwrapPayload(data));
}
