'use client';

import { Badge } from '@/components/ui/badge';
import { KanbanItem } from '@/components/ui/kanban';
import { cn } from '@/lib/utils';
import type { Task } from '../utils/store';

interface TaskCardProps extends Omit<React.ComponentProps<typeof KanbanItem>, 'value'> {
  task: Task;
  onTaskClick?: (task: Task) => void;
}

function initials(name?: string) {
  if (!name) return null;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function TaskCard({ task, onTaskClick, className, ...props }: TaskCardProps) {
  const person = initials(task.assignee);

  return (
    <KanbanItem
      key={task.id}
      value={task.id}
      {...props}
      className={cn(onTaskClick && 'cursor-pointer', className)}
      onClick={() => onTaskClick?.(task)}
      render={
        <div className='bg-card hover:bg-card/95 rounded-lg border p-3 shadow-xs transition-colors' />
      }
    >
      <div className='flex flex-col gap-2.5'>
        <div className='flex items-start justify-between gap-2'>
          <p className='text-foreground line-clamp-2 text-sm leading-snug font-medium'>
            {task.title}
          </p>
          <Badge
            variant={
              task.priority === 'high'
                ? 'destructive'
                : task.priority === 'medium'
                  ? 'secondary'
                  : 'outline'
            }
            className='pointer-events-none h-5 shrink-0 px-1.5 text-[10px] capitalize'
          >
            {task.priority}
          </Badge>
        </div>

        <div className='text-muted-foreground flex items-center justify-between gap-2 text-xs'>
          {person ? (
            <div className='flex min-w-0 items-center gap-1.5'>
              <span className='bg-muted text-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold'>
                {person}
              </span>
              <span className='truncate'>{task.assignee}</span>
            </div>
          ) : (
            <span>Unassigned</span>
          )}
          {task.dueDate ? (
            <time className='shrink-0 tabular-nums'>{task.dueDate}</time>
          ) : null}
        </div>
      </div>
    </KanbanItem>
  );
}
