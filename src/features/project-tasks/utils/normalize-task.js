export function getTaskId(task) {
  return String(task?.id ?? task?.['_id'] ?? '');
}

export function getTaskTitle(task) {
  return task?.title ?? task?.name ?? 'Untitled task';
}

export function getTaskDescription(task) {
  return task?.description ?? '';
}

export function getTaskStatus(task) {
  return String(task?.status ?? 'TODO').toUpperCase();
}

export function getTaskPriority(task) {
  return String(task?.priority ?? 'MEDIUM').toUpperCase();
}

export function getTaskIssueType(task) {
  return String(task?.issueType ?? task?.issue_type ?? 'TASK').toUpperCase();
}

export function getTaskIssueKey(task) {
  return task?.issueKey ?? task?.issue_key ?? '';
}

export function getTaskAssignee(task) {
  return task?.assignee ?? task?.assigneeUser ?? null;
}

export function getTaskAssigneeId(task) {
  return String(
    task?.assigneeId ??
      task?.assignee_id ??
      task?.assignee?.id ??
      task?.assignee?.['_id'] ??
      ''
  );
}

export function getAssigneeDisplayName(task, users = []) {
  const assignee = getTaskAssignee(task);

  if (assignee && typeof assignee === 'object') {
    const fullName = [
      assignee.firstName,
      assignee.lastName,
      assignee.first_name,
      assignee.last_name
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    return fullName || assignee.name || assignee.email || '';
  }

  if (typeof assignee === 'string' && assignee && !/^[0-9a-f-]{16,}$/i.test(assignee)) {
    return assignee;
  }

  const assigneeId = getTaskAssigneeId(task);
  if (!assigneeId) return '';

  const matched = (users ?? []).find(
    (user) => String(user?.id ?? user?.['_id'] ?? '') === assigneeId
  );

  if (!matched) return '';

  const fullName = [
    matched.firstName,
    matched.lastName,
    matched.first_name,
    matched.last_name
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return fullName || matched.name || matched.email || '';
}

export function getAssigneeInitials(name) {
  if (!name) return '?';

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function getTaskProjectId(task) {
  return String(
    task?.projectId ??
      task?.project_id ??
      task?.project?.id ??
      task?.project?.['_id'] ??
      ''
  );
}

export function formatTaskDate(value) {
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
