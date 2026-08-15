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
import { usePurchaseOrdersListQuery } from '../api/queries';
import {
  useDeletePurchaseOrderMutation,
  useSetPurchaseOrderStatusMutation
} from '../api/mutations';
import { nextPurchaseOrderStatus } from '../constants/purchase-order-form-config';
import {
  PurchaseOrderFormSheet,
  PurchaseOrderLinesSheet
} from './purchase-order-form-sheets';

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
  const next = nextPurchaseOrderStatus(data.status);
  const { mutate: remove, isPending } = useDeletePurchaseOrderMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete PO'));
    }
  });
  const { mutate: setStatus } = useSetPurchaseOrderStatusMutation({
    onSuccess: (_res, variables) => {
      toast.success(`PO marked ${variables.status.toLowerCase()}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update PO'));
    }
  });

  return (
    <>
      {editOpen ? (
        <PurchaseOrderFormSheet
          order={data}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
      {linesOpen ? (
        <PurchaseOrderLinesSheet
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

function PurchaseOrdersTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    usePurchaseOrdersListQuery(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search purchase orders…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No purchase orders found.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>PO</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Receive at</TableHead>
            <TableHead>Lines</TableHead>
            <TableHead>Expected</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={getEntityId(row)}>
              <TableCell className='font-medium'>{row.code}</TableCell>
              <TableCell>
                {row.supplier ? codeNameLabel(row.supplier) : '—'}
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {row.location ? codeNameLabel(row.location) : '—'}
              </TableCell>
              <TableCell className='max-w-[240px] truncate text-sm'>
                {lineSummary(row.lines)}
              </TableCell>
              <TableCell>{formatEntityDate(row.expectedDate)}</TableCell>
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

export default function PurchaseOrdersPage() {
  return (
    <PageContainer
      pageTitle='Purchase orders'
      pageDescription='Buy fabric and trims from suppliers — confirm, receive, then close.'
      pageHeaderAction={
        <FormSheetTrigger label='Add PO'>
          {({ open, onOpenChange }) => (
            <PurchaseOrderFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <PurchaseOrdersTable />
      </Suspense>
    </PageContainer>
  );
}
