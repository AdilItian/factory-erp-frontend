'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Icons } from '@/components/icons';
import {
  formatUserDate,
  getUserDisplayName,
  getUserEmail,
  getUserId,
  getUserRoles,
  isUserActive
} from '../../../utils/normalize-user';
import { CellAction } from './cell-action';

export const columns = [
  {
    id: 'email',
    accessorFn: (row) => getUserEmail(row),
    header: ({ column }) => <DataTableColumnHeader column={column} title='User' />,
    cell: ({ row }) => (
      <div className='flex min-w-48 flex-col gap-0.5'>
        <span className='text-foreground font-medium'>{getUserDisplayName(row.original)}</span>
        <span className='text-muted-foreground text-xs'>{getUserEmail(row.original) || '—'}</span>
        <span className='text-muted-foreground font-mono text-[10px]'>
          {getUserId(row.original) || '—'}
        </span>
      </div>
    ),
    meta: {
      label: 'Email',
      placeholder: 'Search users...',
      variant: 'text',
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    id: 'roles',
    accessorFn: (row) => getUserRoles(row).join(', '),
    header: 'Roles',
    cell: ({ row }) => {
      const roles = getUserRoles(row.original);

      if (!roles.length) {
        return <span className='text-muted-foreground'>—</span>;
      }

      return (
        <div className='flex max-w-64 flex-wrap gap-1'>
          {roles.map((role) => (
            <Badge key={role} variant='outline' className='capitalize'>
              {role}
            </Badge>
          ))}
        </div>
      );
    },
    enableSorting: false
  },
  {
    id: 'status',
    accessorFn: (row) => (isUserActive(row) ? 'active' : 'inactive'),
    header: 'Status',
    cell: ({ row }) => {
      const active = isUserActive(row.original);
      return (
        <Badge variant={active ? 'default' : 'secondary'}>
          {active ? 'Active' : 'Inactive'}
        </Badge>
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
        {formatUserDate(
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
