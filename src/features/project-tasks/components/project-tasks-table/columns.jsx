'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Icons } from '@/components/icons';
import {
  getUserDisplayName
} from '@/features/users/utils/normalize-user';
import {
  TASK_PRIORITY_BADGE,
  TASK_STATUS_BADGE
} from '../../constants/task-options';
import {
  formatTaskDate,
  getTaskAssignee,
  getTaskId,
  getTaskIssueKey,
  getTaskIssueType,
  getTaskPriority,
  getTaskStatus,
  getTaskTitle
} from '../../utils/normalize-task';
import { CellAction } from './cell-action';

export function createTaskColumns({ projectId, showProject = false } = {}) {
  return [
    {
      id: 'title',
      accessorFn: (row) => getTaskTitle(row),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Task' />
      ),
      cell: ({ row }) => (
        <div className='flex min-w-48 flex-col gap-0.5'>
          <span className='text-foreground font-medium'>
            {getTaskTitle(row.original)}
          </span>
          <span className='text-muted-foreground text-xs'>
            {getTaskIssueKey(row.original) || getTaskId(row.original) || '—'}
            {' · '}
            {getTaskIssueType(row.original)}
          </span>
        </div>
      ),
      meta: {
        label: 'Title',
        placeholder: 'Search tasks...',
        variant: 'text',
        icon: Icons.text
      },
      enableColumnFilter: true
    },
    {
      id: 'status',
      accessorFn: (row) => getTaskStatus(row),
      header: 'Status',
      cell: ({ row }) => {
        const status = getTaskStatus(row.original);
        return (
          <Badge variant={TASK_STATUS_BADGE[status] ?? 'outline'}>
            {status.replaceAll('_', ' ')}
          </Badge>
        );
      },
      enableSorting: false
    },
    {
      id: 'priority',
      accessorFn: (row) => getTaskPriority(row),
      header: 'Priority',
      cell: ({ row }) => {
        const priority = getTaskPriority(row.original);
        return (
          <Badge variant={TASK_PRIORITY_BADGE[priority] ?? 'outline'}>
            {priority}
          </Badge>
        );
      },
      enableSorting: false
    },
    {
      id: 'assignee',
      accessorFn: (row) => {
        const assignee = getTaskAssignee(row);
        return assignee ? getUserDisplayName(assignee) : '';
      },
      header: 'Assignee',
      cell: ({ row }) => {
        const assignee = getTaskAssignee(row.original);
        return (
          <span className='text-muted-foreground text-sm'>
            {assignee ? getUserDisplayName(assignee) : 'Unassigned'}
          </span>
        );
      },
      enableSorting: false
    },
    ...(showProject
      ? [
          {
            id: 'project',
            accessorFn: (row) =>
              row.project?.name ?? row.projectName ?? row.project_id ?? '',
            header: 'Project',
            cell: ({ row }) => (
              <span className='text-muted-foreground text-sm'>
                {row.original.project?.name ??
                  row.original.projectName ??
                  '—'}
              </span>
            ),
            enableSorting: false
          }
        ]
      : []),
    {
      id: 'dueDate',
      accessorFn: (row) => row.dueDate ?? row.due_date ?? '',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Due' />
      ),
      cell: ({ row }) => (
        <span className='text-muted-foreground text-sm whitespace-nowrap'>
          {formatTaskDate(row.original.dueDate ?? row.original.due_date)}
        </span>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <CellAction data={row.original} projectId={projectId} />
      ),
      size: 40,
      enableSorting: false,
      enableHiding: false,
      meta: { pin: 'right' }
    }
  ];
}
