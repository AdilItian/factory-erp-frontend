export function compactPayload(values) {
  const out = {};

  for (const [key, value] of Object.entries(values ?? {})) {
    if (value === undefined || value === null) continue;
    if (value === '__none__') continue;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) continue;
      out[key] = trimmed;
      continue;
    }
    out[key] = value;
  }

  return out;
}

export function optionalNumber(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
