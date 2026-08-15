'use client';

import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import { EntityCellAction } from '@/components/erp/entity-cell-action';
import {
  EntityList,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
  TableSkeleton
} from '@/components/erp/entity-list';
import { FormSheetTrigger } from '@/components/erp/form-sheet-trigger';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import {
  codeNameLabel,
  formatEnumLabel,
  getEntityId,
  getEntityName
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useListParams } from '@/hooks/use-list-params';
import { useWorkOrdersListQuery } from '../api/queries';
import {
  useDeleteWorkOrderMutation,
  useSetWorkOrderStatusMutation
} from '../api/mutations';
import { nextWorkOrderStatus } from '../constants/work-order-form-config';
import { WorkOrderFormSheet } from './work-order-form-sheet';
import { StatusBadge } from './status-badge';

function CellAction({ data }) {
  const [editOpen, setEditOpen] = useState(false);
  const next = nextWorkOrderStatus(data.status);
  const { mutate: remove, isPending } = useDeleteWorkOrderMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete work order'));
    }
  });
  const { mutate: setStatus } = useSetWorkOrderStatusMutation({
    onSuccess: (_res, variables) => {
      toast.success(`Work order ${formatEnumLabel(variables.status).toLowerCase()}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update status'));
    }
  });

  return (
    <>
      {editOpen ? (
        <WorkOrderFormSheet
          workOrder={data}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
      <EntityCellAction
        extraItems={
          next
            ? [
                {
                  label: next.label,
                  icon: Icons.check,
                  onClick: () =>
                    setStatus({ id: getEntityId(data), status: next.status })
                }
              ]
            : []
        }
        onEdit={() => setEditOpen(true)}
        deletePending={isPending}
        onDelete={(close) =>
          remove(getEntityId(data), {
            onSuccess: () => {
              toast.success(`Deleted “${getEntityName(data, data.code)}”`);
              close();
            }
          })
        }
      />
    </>
  );
}

function WorkOrdersTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    useWorkOrdersListQuery(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search work orders…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No work orders found.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>BoM</TableHead>
            <TableHead className='text-right'>Qty</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={getEntityId(row)}>
              <TableCell className='font-medium'>
                {row.code || getEntityName(row)}
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {row.item ? codeNameLabel(row.item) : '—'}
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {row.bom?.code || '—'}
              </TableCell>
              <TableCell className='text-right tabular-nums'>
                {row.completedQty || 0}/{row.quantity}
              </TableCell>
              <TableCell>{row.dueDate || '—'}</TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell>
                <CellAction data={row} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableShell>
    </EntityList>
  );
}

export default function WorkOrdersPage() {
  return (
    <PageContainer
      pageTitle='Work orders'
      pageDescription='Jobs to make finished goods from a bill of materials.'
      pageHeaderAction={
        <FormSheetTrigger label='Add work order'>
          {({ open, onOpenChange }) => (
            <WorkOrderFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <WorkOrdersTable />
      </Suspense>
    </PageContainer>
  );
}
