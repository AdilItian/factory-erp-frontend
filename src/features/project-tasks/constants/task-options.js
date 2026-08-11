export const TASK_STATUS_OPTIONS = [
  { label: 'To do', value: 'TODO' },
  { label: 'In progress', value: 'IN_PROGRESS' },
  { label: 'In review', value: 'IN_REVIEW' },
  { label: 'Blocked', value: 'BLOCKED' },
  { label: 'Done', value: 'DONE' },
  { label: 'Cancelled', value: 'CANCELLED' }
];

export const TASK_PRIORITY_OPTIONS = [
  { label: 'Lowest', value: 'LOWEST' },
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Highest', value: 'HIGHEST' },
  { label: 'Urgent', value: 'URGENT' }
];

export const TASK_ISSUE_TYPE_OPTIONS = [
  { label: 'Epic', value: 'EPIC' },
  { label: 'Story', value: 'STORY' },
  { label: 'Task', value: 'TASK' },
  { label: 'Bug', value: 'BUG' },
  { label: 'Subtask', value: 'SUBTASK' }
];

export const TASK_SEVERITY_OPTIONS = [
  { label: 'None', value: '__none__' },
  { label: 'Lowest', value: 'LOWEST' },
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Critical', value: 'CRITICAL' }
];

export const TASK_STATUS_BADGE = {
  TODO: 'outline',
  IN_PROGRESS: 'secondary',
  IN_REVIEW: 'secondary',
  BLOCKED: 'destructive',
  DONE: 'default',
  CANCELLED: 'outline'
};

export const TASK_PRIORITY_BADGE = {
  LOWEST: 'outline',
  LOW: 'outline',
  MEDIUM: 'secondary',
  HIGH: 'default',
  HIGHEST: 'destructive',
  URGENT: 'destructive'
};
