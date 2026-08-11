import {
  getAssigneeDisplayName,
  getTaskId,
  getTaskPriority,
  getTaskStatus,
  getTaskTitle
} from './normalize-task';

export const KANBAN_STATUS_COLUMNS = [
  'TODO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'BLOCKED',
  'DONE',
  'CANCELLED'
];

export function mapApiPriorityToKanban(priority) {
  const value = String(priority ?? 'MEDIUM').toUpperCase();

  if (['HIGH', 'HIGHEST', 'URGENT'].includes(value)) return 'high';
  if (['LOW', 'LOWEST'].includes(value)) return 'low';
  return 'medium';
}

export function mapApiTaskToKanbanCard(task) {
  const dueDate = task?.dueDate ?? task?.due_date ?? '';
  const assigneeName = getAssigneeDisplayName(task);

  return {
    id: getTaskId(task),
    title: getTaskTitle(task),
    priority: mapApiPriorityToKanban(getTaskPriority(task)),
    description: task?.description ?? '',
    assignee: assigneeName || undefined,
    dueDate: dueDate ? String(dueDate).slice(0, 10) : undefined
  };
}

export function createEmptyKanbanColumns() {
  return Object.fromEntries(KANBAN_STATUS_COLUMNS.map((status) => [status, []]));
}

export function groupApiTasksToKanbanColumns(tasks = []) {
  const columns = createEmptyKanbanColumns();

  for (const task of tasks) {
    const card = mapApiTaskToKanbanCard(task);
    if (!card.id) continue;

    const status = getTaskStatus(task);
    const columnKey = columns[status] ? status : 'TODO';
    columns[columnKey].push(card);
  }

  return columns;
}
