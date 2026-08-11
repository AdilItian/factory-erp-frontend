'use client';

import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KanbanColumn, KanbanColumnHandle } from '@/components/ui/kanban';
import { cn } from '@/lib/utils';
import { getStageMeta } from '../constants/stage-meta';
import type { Task } from '../utils/store';
import { TaskCard } from './task-card';

const TONE_DOT = {
  quiet: 'bg-muted-foreground/50',
  signal: 'bg-primary',
  focus: 'bg-foreground/55',
  alert: 'bg-destructive',
  settled: 'bg-foreground/45'
};

interface TaskColumnProps extends Omit<React.ComponentProps<typeof KanbanColumn>, 'children'> {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

function EmptyColumnState({ title }: { title: string }) {
  return (
    <div
      data-board-pan-handle
      className='border-border/60 text-muted-foreground flex min-h-[10rem] flex-1 cursor-grab flex-col items-center justify-center rounded-lg border border-dashed px-3 py-6 text-center'
    >
      <Icons.kanban className='mb-2 size-4 opacity-60' />
      <p className='text-xs'>No tasks in {title}</p>
    </div>
  );
}

export function TaskColumn({ value, tasks, onTaskClick, ...props }: TaskColumnProps) {
  const meta = getStageMeta(value);
  const isEmpty = tasks.length === 0;
  const accent = TONE_DOT[meta.tone] ?? TONE_DOT.quiet;

  return (
    <KanbanColumn
      value={value}
      className={cn(
        'bg-muted/30 flex min-h-[24rem] w-[300px] shrink-0 flex-col gap-3 rounded-xl border p-3 shadow-none md:w-[320px] dark:bg-muted/15'
      )}
      {...props}
    >
      <div className='flex items-center justify-between gap-2'>
        <div className='flex min-w-0 items-center gap-2'>
          <span className={cn('size-2 shrink-0 rounded-full', accent)} />
          <h3 className='truncate text-sm font-semibold'>{meta.title}</h3>
          <Badge variant='secondary' className='h-5 px-1.5 text-[10px] tabular-nums'>
            {tasks.length}
          </Badge>
        </div>
        <KanbanColumnHandle render={<Button variant='ghost' size='icon' className='size-7' />}>
          <Icons.gripVertical className='text-muted-foreground size-3.5' />
        </KanbanColumnHandle>
      </div>

      <div className='flex min-h-0 flex-1 flex-col gap-2'>
        {isEmpty ? (
          <EmptyColumnState title={meta.title} />
        ) : (
          <>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                asHandle
                onTaskClick={onTaskClick}
              />
            ))}
            <div
              data-board-pan-handle
              className='min-h-8 flex-1 cursor-grab'
              aria-hidden='true'
            />
          </>
        )}
      </div>
    </KanbanColumn>
  );
}
