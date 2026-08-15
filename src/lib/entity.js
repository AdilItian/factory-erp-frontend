import { normalizeArray } from '@/lib/normalize-list';

export function getEntityId(entity) {
  return String(entity?.id ?? entity?.['_id'] ?? '');
}

export function refId(value) {
  if (value == null || value === '') return '';
  if (typeof value === 'object') return getEntityId(value);
  return String(value);
}

export function getEntityName(entity, fallback = 'Untitled') {
  return entity?.name ?? entity?.title ?? entity?.label ?? fallback;
}

export function getEntityCode(entity) {
  return String(entity?.code ?? '');
}

export function getEntityDescription(entity) {
  return entity?.description ?? '';
}

export function isEntityActive(entity) {
  if (entity?.isActive === false || entity?.is_active === false) return false;
  return true;
}

export function getEntityType(entity) {
  return String(entity?.type ?? entity?.dataType ?? '').toUpperCase();
}

export function formatEntityDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function codeNameLabel(entity) {
  const code = getEntityCode(entity);
  const name = getEntityName(entity, '');
  if (code && name) return `${code} — ${name}`;
  return name || code || '—';
}

export function mapToOptions(list, getLabel = codeNameLabel) {
  return normalizeArray(list)
    .map((item) => {
      const value = getEntityId(item);
      return { label: getLabel(item) || value, value };
    })
    .filter((option) => option.value);
}

export function noneOption(label = 'None') {
  return { label, value: '__none__' };
}

export function formatEnumLabel(value) {
  if (!value) return '—';
  return String(value)
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
