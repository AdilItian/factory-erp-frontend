import { z } from 'zod';
import {
  TASK_ISSUE_TYPE_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_SEVERITY_OPTIONS,
  TASK_STATUS_OPTIONS
} from './task-options';

export const taskFormSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters'),
  description: z.string().max(2000).optional(),
  issueType: z.enum(['EPIC', 'STORY', 'TASK', 'BUG', 'SUBTASK']),
  status: z.enum([
    'TODO',
    'IN_PROGRESS',
    'IN_REVIEW',
    'BLOCKED',
    'DONE',
    'CANCELLED'
  ]),
  priority: z.enum(['LOWEST', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST', 'URGENT']),
  severity: z.string().optional(),
  assigneeId: z.string().optional(),
  storyPoints: z.string().optional(),
  dueDate: z.string().optional()
});

export const TASK_FORM_DEFAULTS = {
  title: '',
  description: '',
  issueType: 'TASK',
  status: 'TODO',
  priority: 'MEDIUM',
  severity: '__none__',
  assigneeId: '__none__',
  storyPoints: '',
  dueDate: ''
};

const softFieldClass =
  'h-10 rounded-xl border-border/70 bg-background/80 shadow-none focus-visible:ring-primary/20';
const softSelectClass =
  'h-10 w-full rounded-xl border-border/70 bg-background/80 shadow-none';
const softTextareaClass =
  'min-h-28 rounded-xl border-border/70 bg-background/80 shadow-none focus-visible:ring-primary/20';
const softLabelClass =
  'text-muted-foreground text-[11px] font-medium tracking-[0.12em] uppercase';

function styleField(field) {
  const isSelect = field.type === 'select' || field.type === 'date';
  const isTextarea = field.type === 'textarea';

  return {
    ...field,
    labelClassName: softLabelClass,
    className: isTextarea
      ? softTextareaClass
      : isSelect
        ? softSelectClass
        : softFieldClass
  };
}

export function getTaskFormFields(assigneeOptions = []) {
  return [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      placeholder: 'Design login screen'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Match the Figma mockups for mobile and desktop.'
    },
    {
      name: 'issueType',
      label: 'Issue type',
      type: 'select',
      placeholder: 'Select type',
      options: TASK_ISSUE_TYPE_OPTIONS
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      options: TASK_STATUS_OPTIONS
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',
      placeholder: 'Select priority',
      options: TASK_PRIORITY_OPTIONS
    },
    {
      name: 'severity',
      label: 'Severity',
      type: 'select',
      placeholder: 'Select severity',
      options: TASK_SEVERITY_OPTIONS
    },
    {
      name: 'assigneeId',
      label: 'Assignee',
      type: 'select',
      placeholder: 'Select assignee',
      options: [{ label: 'Unassigned', value: '__none__' }, ...assigneeOptions]
    },
    {
      name: 'storyPoints',
      label: 'Story points',
      type: 'number',
      placeholder: '3'
    },
    {
      name: 'dueDate',
      label: 'Due date',
      type: 'date',
      placeholder: 'Pick a due date'
    }
  ];
}

export function getTaskEditFormSections(assigneeOptions = []) {
  const fields = getTaskFormFields(assigneeOptions).map(styleField);

  const byName = Object.fromEntries(fields.map((field) => [field.name, field]));

  return [
    {
      id: 'essentials',
      title: 'Essentials',
      description: 'Title and context for this work item.',
      icon: 'post',
      fields: [
        {
          ...byName.title,
          className:
            'h-12 rounded-xl border-border/60 bg-background/90 text-base font-medium shadow-none focus-visible:ring-primary/20',
          labelClassName: softLabelClass
        },
        byName.description
      ]
    },
    {
      id: 'workflow',
      title: 'Workflow',
      description: 'Where this task sits and how urgent it is.',
      icon: 'kanban',
      fields: [byName.issueType, byName.status, byName.priority],
      columns: 2
    },
    {
      id: 'ownership',
      title: 'Ownership',
      description: 'Who owns it and when it should land.',
      icon: 'user',
      fields: [byName.assigneeId, byName.dueDate, byName.storyPoints, byName.severity],
      columns: 2
    }
  ];
}

export function mergeAssigneeOptions(assigneeOptions = [], task) {
  if (!task) return assigneeOptions;

  const assigneeId = String(
    task?.assigneeId ??
      task?.assignee_id ??
      task?.assignee?.id ??
      task?.assignee?.['_id'] ??
      ''
  );

  if (!assigneeId) return assigneeOptions;
  if (assigneeOptions.some((option) => option.value === assigneeId)) {
    return assigneeOptions;
  }

  const assignee = task?.assignee ?? task?.assigneeUser;
  const fullName = assignee
    ? [assignee.firstName, assignee.lastName, assignee.first_name, assignee.last_name]
        .filter(Boolean)
        .join(' ')
        .trim()
    : '';
  const label = fullName || assignee?.name || assignee?.email || 'Current assignee';

  return [{ label, value: assigneeId }, ...assigneeOptions];
}

export function buildTaskPayload(values, options = {}) {
  const { creatorId, forCreate = false } = options;
  const severity =
    values.severity && values.severity !== '__none__' ? values.severity : null;
  const assigneeId =
    values.assigneeId && values.assigneeId !== '__none__'
      ? values.assigneeId
      : null;
  const storyPointsRaw = values.storyPoints?.toString().trim();
  const storyPoints =
    storyPointsRaw === '' || storyPointsRaw == null
      ? null
      : Number(storyPointsRaw);
  const dueDateRaw = values.dueDate?.toString().trim();
  const dueDate = dueDateRaw
    ? dueDateRaw.length === 10
      ? new Date(`${dueDateRaw}T12:00:00.000Z`).toISOString()
      : dueDateRaw
    : null;

  const creatorUserId = creatorId ? String(creatorId) : '';
  const watcherIds = Array.isArray(values.watcherIds)
    ? values.watcherIds.map(String).filter(Boolean)
    : [];

  if (forCreate && creatorUserId && !watcherIds.includes(creatorUserId)) {
    watcherIds.push(creatorUserId);
  }

  return {
    title: values.title.trim(),
    issueType: values.issueType,
    status: values.status,
    priority: values.priority,
    ...(values.description?.trim()
      ? { description: values.description.trim() }
      : { description: '' }),
    ...(severity ? { severity } : {}),
    ...(assigneeId ? { assigneeId } : { assigneeId: null }),
    ...(storyPoints == null || Number.isNaN(storyPoints)
      ? {}
      : { storyPoints }),
    ...(dueDate ? { dueDate } : { dueDate: null }),
    ...(forCreate && creatorUserId ? { reporterId: creatorUserId } : {}),
    ...(forCreate && watcherIds.length > 0 ? { watcherIds } : {})
  };
}
