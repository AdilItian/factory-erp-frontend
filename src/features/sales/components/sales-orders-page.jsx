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
import { StatusBadge } from '@/components/erp/status-badge';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import {
  codeNameLabel,
  formatEntityDate,
  getEntityId,
  getEntityName
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useListParams } from '@/hooks/use-list-params';
import { useSalesOrdersListQuery } from '../api/queries';
import {
  useDeleteSalesOrderMutation,
  useSetSalesOrderStatusMutation
} from '../api/mutations';
import { nextSalesOrderStatus } from '../constants/sales-order-form-config';
import {
  SalesOrderFormSheet,
  SalesOrderLinesSheet
} from './sales-order-form-sheets';

function lineSummary(lines = []) {
  if (!lines.length) return 'No lines yet';
  return lines
    .map((line) => {
      const name = line.item ? codeNameLabel(line.item) : line.itemId;
      return `${line.quantity} ${name}`;
    })
    .join(' · ');
}

function CellAction({ data }) {
  const [editOpen, setEditOpen] = useState(false);
  const [linesOpen, setLinesOpen] = useState(false);
  const next = nextSalesOrderStatus(data.status);
  const { mutate: remove, isPending } = useDeleteSalesOrderMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete sales order'));
    }
  });
  const { mutate: setStatus } = useSetSalesOrderStatusMutation({
    onSuccess: (_res, variables) => {
      toast.success(`Order marked ${variables.status.toLowerCase()}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update sales order'));
    }
  });

  return (
    <>
      {editOpen ? (
        <SalesOrderFormSheet
          order={data}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
      {linesOpen ? (
        <SalesOrderLinesSheet
          order={data}
          open={linesOpen}
          onOpenChange={setLinesOpen}
        />
      ) : null}
      <EntityCellAction
        extraItems={[
          {
            label: 'Lines',
            icon: Icons.package,
            onClick: () => setLinesOpen(true)
          },
          ...(next
            ? [
                {
                  label: next.label,
                  icon: Icons.check,
                  onClick: () =>
                    setStatus({ id: getEntityId(data), status: next.status })
                }
              ]
            : [])
        ]}
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

function SalesOrdersTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    useSalesOrdersListQuery(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search sales orders…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No sales orders found.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Ship from</TableHead>
            <TableHead>Lines</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={getEntityId(row)}>
              <TableCell className='font-medium'>{row.code}</TableCell>
              <TableCell>
                {row.customer ? codeNameLabel(row.customer) : '—'}
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {row.location ? codeNameLabel(row.location) : '—'}
              </TableCell>
              <TableCell className='max-w-[240px] truncate text-sm'>
                {lineSummary(row.lines)}
              </TableCell>
              <TableCell>{formatEntityDate(row.dueDate)}</TableCell>
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

export default function SalesOrdersPage() {
  return (
    <PageContainer
      pageTitle='Sales orders'
      pageDescription='Sell finished goods to outlets and buyers — confirm, ship, then close.'
      pageHeaderAction={
        <FormSheetTrigger label='Add sales order'>
          {({ open, onOpenChange }) => (
            <SalesOrderFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <SalesOrdersTable />
      </Suspense>
    </PageContainer>
  );
}
