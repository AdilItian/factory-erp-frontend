'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Icons } from '@/components/icons';
import { CellAction } from './cell-action';

const STATUS_MAP = {
  PUBLISHED: { label: 'Published', variant: 'default' },
  UNPUBLISHED: { label: 'Unpublished', variant: 'secondary' },
  DRAFT: { label: 'Draft', variant: 'outline' },
  APPROVED: { label: 'Approved', variant: 'default' },
  SUBMITTED_FOR_APPROVAL: { label: 'Submitted for Approval', variant: 'secondary' },
  REJECTED: { label: 'Rejected', variant: 'destructive' },
  REVISION_REQUESTED: { label: 'Revision Requested', variant: 'outline' }
};

function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatCurrency(value, currency = '€') {
  if (value == null) return '—';
  return `${currency} ${Number(value).toLocaleString('de-DE')}`;
}

export const columns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    meta: { label: 'Name' },
    cell: ({ row }) => (
      <div className='flex flex-col min-w-30'>
        <span className='text-primary font-medium truncate max-w-35'>{row.original.name}</span>
      </div>
    ),
    enableColumnFilter: false
  },
  {
    id: 'category',
    accessorFn: (row) => row.categoryName ?? row.category?.name ?? '',
    header: 'Category',
    meta: { label: 'Category' },
    cell: ({ row }) => {
      const name = row.original.categoryName ?? row.original.category?.name;
      return <span className='text-muted-foreground truncate max-w-32 block'>{name ?? '—'}</span>;
    },
    enableSorting: false
  },
  {
    id: 'projectOwnership',
    accessorFn: (row) => row.initiatorName ?? row.projectOwnership?.name ?? '',
    header: 'Project Ownership',
    meta: { label: 'Project Ownership' },
    cell: ({ row }) => {
      const name = row.original.initiatorName ?? row.original.projectOwnership?.name;
      return <span className='text-muted-foreground truncate max-w-32 block'>{name ?? '—'}</span>;
    },
    enableSorting: false
  },
  {
    id: 'initiative',
    accessorFn: (row) => row.initiativeName ?? row.initiative?.name ?? '',
    header: 'Initiative',
    meta: { label: 'Initiative' },
    cell: ({ row }) => {
      const name = row.original.initiativeName ?? row.original.initiative?.name;
      return <span className='text-muted-foreground truncate max-w-32 block'>{name ?? '—'}</span>;
    },
    enableSorting: false
  },
  {
    id: 'location',
    accessorFn: (row) => [row.zipCode, row.city, row.country].filter(Boolean).join(', '),
    header: 'Location',
    meta: { label: 'Location' },
    cell: ({ row }) => {
      const { zipCode, city, country } = row.original;
      const parts = [zipCode, city, country].filter(Boolean);
      return (
        <span className='text-muted-foreground truncate max-w-35 block'>
          {parts.length ? parts.join(', ') : '—'}
        </span>
      );
    },
    enableSorting: false
  },
  {
    id: 'targetAmount',
    accessorKey: 'targetAmount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Target Amount' />,
    meta: { label: 'Target Amount' },
    cell: ({ row }) => (
      <span className='text-foreground whitespace-nowrap'>
        {formatCurrency(row.original.targetAmount, row.original.currency ?? '€')}
      </span>
    )
  },
  {
    id: 'feeValue',
    accessorKey: 'feeValue',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Fee Value' />,
    meta: { label: 'Fee Value' },
    cell: ({ row }) => {
      const fee = row.original.feeValue;
      return (
        <span className='text-muted-foreground whitespace-nowrap'>
          {fee != null ? `${fee} %` : '—'}
        </span>
      );
    }
  },
  {
    id: 'emergency',
    accessorKey: 'emergency',
    header: 'Emergency',
    meta: { label: 'Emergency' },
    cell: ({ row }) => {
      const isEmergency = row.original.emergency;
      return (
        <Badge variant={isEmergency ? 'destructive' : 'secondary'}>
          {isEmergency ? 'Yes' : 'No'}
        </Badge>
      );
    },
    enableSorting: false
  },
  {
    id: 'createdDate',
    accessorKey: 'createdDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created Date' />,
    meta: { label: 'Created Date' },
    cell: ({ row }) => (
      <span className='text-muted-foreground text-sm whitespace-nowrap'>
        {formatDate(row.original.createdDate)}
      </span>
    )
  },
  {
    id: 'lastModifiedDate',
    accessorKey: 'lastModifiedDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Modified Date' />,
    meta: { label: 'Modified Date' },
    cell: ({ row }) => (
      <span className='text-muted-foreground text-sm whitespace-nowrap'>
        {formatDate(row.original.lastModifiedDate)}
      </span>
    )
  },
  {
    id: 'projectStatus',
    accessorKey: 'projectStatus',
    header: 'Status',
    meta: { label: 'Status' },
    cell: ({ row }) => {
      const status = row.original.projectStatus;
      const config = STATUS_MAP[status] ?? { label: status ?? '—', variant: 'outline' };
      return <Badge variant={config.variant}>{config.label}</Badge>;
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
