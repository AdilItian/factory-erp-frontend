'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Icons } from '@/components/icons';
import {
  formatProjectDate,
  getProjectDescription,
  getProjectId,
  getProjectManagers,
  getProjectName,
  getProjectStatus
} from '../../utils/normalize-project';
import {
  getUserDisplayName,
  getUserId
} from '@/features/users/utils/normalize-user';
import { CellAction } from './cell-action';

export const columns = [
  {
    id: 'name',
    accessorFn: (row) => getProjectName(row),
    header: ({ column }) => <DataTableColumnHeader column={column} title='Project' />,
    cell: ({ row }) => (
      <div className='flex min-w-48 flex-col gap-0.5'>
        <span className='text-foreground font-medium'>{getProjectName(row.original)}</span>
        <span className='text-muted-foreground line-clamp-1 text-xs'>
          {getProjectDescription(row.original) || 'No description'}
        </span>
        <span className='text-muted-foreground font-mono text-[10px]'>
          {getProjectId(row.original) || '—'}
        </span>
      </div>
    ),
    meta: {
      label: 'Name',
      placeholder: 'Search projects...',
      variant: 'text',
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    id: 'status',
    accessorFn: (row) => getProjectStatus(row),
    header: 'Status',
    cell: ({ row }) => {
      const status = getProjectStatus(row.original);
      return (
        <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>
          {status === 'ACTIVE' ? 'Active' : 'Archived'}
        </Badge>
      );
    },
    enableSorting: false
  },
  {
    id: 'managers',
    accessorFn: (row) => getProjectManagers(row).length,
    header: 'Managers',
    cell: ({ row }) => {
      const managers = getProjectManagers(row.original);
      if (!managers.length) {
        return <span className='text-muted-foreground'>—</span>;
      }

      return (
        <div className='flex max-w-56 flex-wrap gap-1'>
          {managers.slice(0, 3).map((manager) => (
            <Badge key={getUserId(manager)} variant='outline'>
              {getUserDisplayName(manager)}
            </Badge>
          ))}
          {managers.length > 3 ? (
            <Badge variant='secondary'>+{managers.length - 3}</Badge>
          ) : null}
        </div>
      );
    },
    enableSorting: false
  },
  {
    id: 'createdAt',
    accessorFn: (row) => row.createdAt ?? row.created_at ?? row.createdDate ?? '',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created' />,
    cell: ({ row }) => (
      <span className='text-muted-foreground text-sm whitespace-nowrap'>
        {formatProjectDate(
          row.original.createdAt ?? row.original.created_at ?? row.original.createdDate
        )}
      </span>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
    size: 40,
    enableSorting: false,
    enableHiding: false,
    meta: { pin: 'right' }
  }
];
