'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  TASK_ISSUE_TYPE_OPTIONS,
  TASK_PRIORITY_BADGE,
  TASK_PRIORITY_OPTIONS,
  TASK_SEVERITY_OPTIONS,
  TASK_STATUS_BADGE,
  TASK_STATUS_OPTIONS
} from '../constants/task-options';
import {
  formatTaskDate,
  getAssigneeDisplayName,
  getAssigneeInitials,
  getTaskDescription,
  getTaskIssueKey,
  getTaskIssueType,
  getTaskPriority,
  getTaskStatus,
  getTaskTitle
} from '../utils/normalize-task';

function optionLabel(options, value, fallback = value) {
  return options.find((option) => option.value === value)?.label ?? fallback;
}

function MetaChip({ children, className }) {
  return (
    <span
      className={cn(
        'bg-background/80 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase',
        className
      )}
    >
      {children}
    </span>
  );
}

function PropertyRow({ icon: Icon, label, children }) {
  return (
    <div className='group flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/40'>
      <div className='text-muted-foreground mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background/70'>
        <Icon className='size-3.5' />
      </div>
      <div className='min-w-0 flex-1'>
        <p className='text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase'>
          {label}
        </p>
        <div className='mt-1 text-sm'>{children}</div>
      </div>
    </div>
  );
}

export function TaskDetailsView({
  task,
  users = [],
  canUpdateStatus = false,
  isUpdatingStatus = false,
  onStatusChange
}) {
  const title = getTaskTitle(task);
  const description = getTaskDescription(task);
  const status = getTaskStatus(task);
  const priority = getTaskPriority(task);
  const issueType = getTaskIssueType(task);
  const issueKey = getTaskIssueKey(task);
  const severity = task?.severity ? String(task.severity).toUpperCase() : null;
  const storyPoints = task?.storyPoints ?? task?.story_points;
  const dueDate = task?.dueDate ?? task?.due_date;
  const assigneeName = getAssigneeDisplayName(task, users);
  const initials = getAssigneeInitials(assigneeName);
  const statusItems = TASK_STATUS_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value
  }));

  return (
    <div className='animate-in fade-in-0 slide-in-from-right-2 space-y-5 duration-300'>
      <header className='space-y-3 border-b pb-4'>
        <div className='flex flex-wrap items-center gap-1.5'>
          {issueKey ? (
            <MetaChip className='font-mono normal-case tracking-normal'>
              {issueKey}
            </MetaChip>
          ) : null}
          <MetaChip>
            {optionLabel(TASK_ISSUE_TYPE_OPTIONS, issueType, issueType)}
          </MetaChip>
          <Badge variant={TASK_STATUS_BADGE[status] ?? 'outline'}>
            {optionLabel(TASK_STATUS_OPTIONS, status, status)}
          </Badge>
          <Badge variant={TASK_PRIORITY_BADGE[priority] ?? 'secondary'}>
            {optionLabel(TASK_PRIORITY_OPTIONS, priority, priority)}
          </Badge>
        </div>

        <h2 className='text-foreground text-xl leading-snug font-semibold tracking-tight text-balance'>
          {title}
        </h2>

        <div className='flex items-center gap-2.5'>
          <Avatar className='size-7 border'>
            <AvatarFallback className='bg-muted text-muted-foreground text-[10px] font-semibold'>
              {assigneeName ? initials : <Icons.user className='size-3' />}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-[10px] tracking-wide uppercase'>
              Assignee
            </p>
            <p className='truncate text-sm font-medium'>
              {assigneeName || 'Unassigned'}
            </p>
          </div>
        </div>
      </header>

      {canUpdateStatus ? (
        <section className='space-y-3 rounded-2xl border bg-card/50 p-4'>
          <div className='flex items-center gap-2'>
            <Icons.circleCheck className='text-muted-foreground size-4' />
            <h3 className='text-sm font-semibold tracking-tight'>Update status</h3>
          </div>
          <Select
            items={statusItems}
            value={status}
            onValueChange={(value) => {
              if (!value || value === status) return;
              onStatusChange?.(value);
            }}
            disabled={isUpdatingStatus}
          >
            <SelectTrigger className='h-11 w-full rounded-xl'>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              {statusItems.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className='text-muted-foreground text-xs'>
            You can also drag the card across columns on the board.
          </p>
        </section>
      ) : null}

      <section className='space-y-3'>
        <div className='flex items-center gap-2'>
          <Icons.post className='text-muted-foreground size-4' />
          <h3 className='text-sm font-semibold tracking-tight'>Description</h3>
        </div>
        <div className='bg-muted/30 rounded-2xl border px-4 py-4'>
          {description?.trim() ? (
            <p className='text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap'>
              {description}
            </p>
          ) : (
            <p className='text-muted-foreground/80 text-sm italic'>
              No description yet.
            </p>
          )}
        </div>
      </section>

      <section className='space-y-2'>
        <div className='flex items-center gap-2 px-2'>
          <Icons.settings className='text-muted-foreground size-4' />
          <h3 className='text-sm font-semibold tracking-tight'>Properties</h3>
        </div>
        <div className='grid gap-1 rounded-2xl border bg-card/40 p-2 sm:grid-cols-2'>
          <PropertyRow icon={Icons.circleCheck} label='Status'>
            <span className='font-medium'>
              {optionLabel(TASK_STATUS_OPTIONS, status, status)}
            </span>
          </PropertyRow>
          <PropertyRow icon={Icons.trendingUp} label='Priority'>
            <span className='font-medium'>
              {optionLabel(TASK_PRIORITY_OPTIONS, priority, priority)}
            </span>
          </PropertyRow>
          <PropertyRow icon={Icons.user} label='Assignee'>
            <div className='flex items-center gap-2'>
              <Avatar className='size-6'>
                <AvatarFallback className='bg-primary/15 text-primary text-[10px] font-semibold'>
                  {assigneeName ? initials : '?'}
                </AvatarFallback>
              </Avatar>
              <span className='font-medium'>{assigneeName || 'Unassigned'}</span>
            </div>
          </PropertyRow>
          <PropertyRow icon={Icons.clock} label='Due date'>
            <span className='font-medium'>{formatTaskDate(dueDate)}</span>
          </PropertyRow>
          <PropertyRow icon={Icons.sparkles} label='Story points'>
            <span className='font-medium'>
              {storyPoints != null && storyPoints !== '' ? storyPoints : '—'}
            </span>
          </PropertyRow>
          <PropertyRow icon={Icons.warning} label='Severity'>
            <span className='font-medium'>
              {severity
                ? optionLabel(TASK_SEVERITY_OPTIONS, severity, severity)
                : '—'}
            </span>
          </PropertyRow>
        </div>
      </section>
    </div>
  );
}
