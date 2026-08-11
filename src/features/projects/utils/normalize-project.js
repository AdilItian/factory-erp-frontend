export function getProjectId(project) {
  return String(project?.id ?? project?.['_id'] ?? '');
}

export function getProjectName(project) {
  return project?.name ?? project?.title ?? 'Untitled project';
}

export function getProjectDescription(project) {
  return project?.description ?? '';
}

export function getProjectStatus(project) {
  return String(project?.status ?? 'ACTIVE').toUpperCase();
}

export function getProjectManagers(project) {
  const managers =
    project?.managers ??
    project?.projectManagers ??
    project?.project_managers ??
    [];

  return Array.isArray(managers) ? managers : [];
}

export function formatProjectDate(value) {
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
