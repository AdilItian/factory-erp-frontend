'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
  formatEnumLabel,
  getEntityId,
  getEntityName
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useListParams } from '@/hooks/use-list-params';
import { usePosReturnsListQuery } from '../api/queries';
import {
  useCompletePosReturnMutation,
  useDeletePosReturnMutation
} from '../api/mutations';
import { nextPosReturnStatus } from '../constants/pos-return-form-config';
import { formatMoney } from '../utils/cart';
import {
  PosReturnFormSheet,
  PosReturnLinesSheet
} from './pos-return-form-sheets';

function lineSummary(lines = []) {
  if (!lines.length) return 'No lines yet';
  return lines
    .map((line) => `${line.quantity}× ${getEntityName(line.item, line.itemId)}`)
    .join(' · ');
}

function CellAction({ data }) {
  const [editOpen, setEditOpen] = useState(false);
  const [linesOpen, setLinesOpen] = useState(false);
  const next = nextPosReturnStatus(data.status);
  const canEdit = data.status !== 'REFUNDED';
  const { mutate: remove, isPending } = useDeletePosReturnMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete return'));
    }
  });
  const { mutate: complete } = useCompletePosReturnMutation({
    onSuccess: (row) => {
      toast.success(`Refunded ${formatMoney(row.refundTotal)} to customer`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to refund'));
    }
  });

  return (
    <>
      {editOpen ? (
        <PosReturnFormSheet
          doc={data}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
      {linesOpen ? (
        <PosReturnLinesSheet
          doc={data}
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
                  icon: Icons.refund,
                  onClick: () => complete(getEntityId(data))
                }
              ]
            : [])
        ]}
        onEdit={canEdit ? () => setEditOpen(true) : undefined}
        deletePending={isPending}
        onDelete={
          canEdit
            ? (close) =>
                remove(getEntityId(data), {
                  onSuccess: () => {
                    toast.success(`Deleted “${getEntityName(data, data.code)}”`);
                    close();
                  }
                })
            : undefined
        }
      />
    </>
  );
}

function ReturnsTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    usePosReturnsListQuery(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search returns…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No customer returns yet.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Return</TableHead>
            <TableHead>Original sale</TableHead>
            <TableHead>Outlet</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className='text-right'>Refund</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={getEntityId(row)}>
              <TableCell className='font-medium'>{row.code}</TableCell>
              <TableCell>{row.saleCode || '—'}</TableCell>
              <TableCell className='text-muted-foreground'>
                {row.location ? codeNameLabel(row.location) : '—'}
              </TableCell>
              <TableCell className='max-w-[200px] truncate text-sm'>
                {lineSummary(row.lines)}
              </TableCell>
              <TableCell>{formatEnumLabel(row.reason)}</TableCell>
              <TableCell className='text-right tabular-nums'>
                {formatMoney(row.refundTotal)}
                <span className='text-muted-foreground block text-xs'>
                  {formatEnumLabel(row.refundMethod)}
                </span>
              </TableCell>
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

export default function PosReturnsPage() {
  return (
    <PageContainer
      pageTitle='Customer returns & refunds'
      pageDescription='When a customer brings a product back, refund the paid amount against the original sale.'
      pageHeaderAction={
        <div className='flex flex-wrap gap-2'>
          <Button variant='outline' render={<Link href='/dashboard/sales/pos/history' />}>
            <Icons.inventory className='mr-2 size-4' />
            POS sales
          </Button>
          <FormSheetTrigger label='New return'>
            {({ open, onOpenChange }) => (
              <PosReturnFormSheet open={open} onOpenChange={onOpenChange} />
            )}
          </FormSheetTrigger>
        </div>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <ReturnsTable />
      </Suspense>
    </PageContainer>
  );
}
