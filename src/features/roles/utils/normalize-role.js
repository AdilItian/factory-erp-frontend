export function getRoleId(role) {
  return String(role?.id ?? role?.['_id'] ?? '');
}

export function getRoleName(role) {
  return role?.name ?? role?.label ?? role?.title ?? 'Untitled role';
}

export function getRoleDescription(role) {
  return role?.description ?? role?.desc ?? '';
}

export function formatRoleDate(value) {
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
