'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Icons } from '@/components/icons';
import {
  formatRoleDate,
  getRoleDescription,
  getRoleId,
  getRoleName
} from '../../utils/normalize-role';
import { CellAction } from './cell-action';

export const columns = [
  {
    id: 'name',
    accessorFn: (row) => getRoleName(row),
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ row }) => (
      <div className='flex min-w-40 flex-col gap-0.5'>
        <span className='text-foreground font-medium'>{getRoleName(row.original)}</span>
        <span className='text-muted-foreground font-mono text-xs'>
          {getRoleId(row.original) || '—'}
        </span>
      </div>
    ),
    meta: {
      label: 'Name',
      placeholder: 'Search roles...',
      variant: 'text',
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    id: 'description',
    accessorFn: (row) => getRoleDescription(row),
    header: 'Description',
    cell: ({ row }) => {
      const description = getRoleDescription(row.original);
      return (
        <span className='text-muted-foreground block max-w-80 truncate'>
          {description || '—'}
        </span>
      );
    },
    enableSorting: false
  },
  {
    id: 'createdAt',
    accessorFn: (row) => row.createdAt ?? row.created_at ?? row.createdDate ?? '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground text-sm whitespace-nowrap'>
        {formatRoleDate(
          row.original.createdAt ?? row.original.created_at ?? row.original.createdDate
        )}
      </span>
    )
  },
  {
    id: 'status',
    accessorFn: (row) => row.isSystem ?? row.system ?? false,
    header: 'Type',
    cell: ({ row }) => {
      const isSystem = Boolean(row.original.isSystem ?? row.original.system);
      return (
        <Badge variant={isSystem ? 'secondary' : 'outline'}>
          {isSystem ? 'System' : 'Custom'}
        </Badge>
      );
    },
    enableSorting: false
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
