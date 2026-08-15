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
import { usePosSalesListQuery } from '../api/queries';
import { useVoidPosSaleMutation } from '../api/mutations';
import { formatMoney } from '../utils/cart';
import { printPosReceipt } from '../utils/print-receipt';
import { PosReturnFormSheet } from './pos-return-form-sheets';

function lineSummary(lines = []) {
  if (!lines.length) return '—';
  return lines
    .map((line) => `${line.quantity}× ${getEntityName(line.item, line.itemId)}`)
    .join(' · ');
}

function CellAction({ data }) {
  const [returnOpen, setReturnOpen] = useState(false);
  const { mutate: voidSale, isPending } = useVoidPosSaleMutation({
    onSuccess: () => toast.success('Sale voided'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to void sale'));
    }
  });
  const canVoid = data.status === 'COMPLETED';
  const canReturn = data.status === 'COMPLETED';

  return (
    <>
      {returnOpen ? (
        <PosReturnFormSheet
          saleId={getEntityId(data)}
          open={returnOpen}
          onOpenChange={setReturnOpen}
        />
      ) : null}
      <EntityCellAction
        deletePending={isPending}
        onDelete={
          canVoid
            ? (close) =>
                voidSale(getEntityId(data), {
                  onSuccess: () => close()
                })
            : undefined
        }
        extraItems={[
          {
            label: 'Print receipt',
            icon: Icons.print,
            onClick: () => {
              const ok = printPosReceipt(data);
              if (!ok) toast.error('Allow pop-ups to print the receipt');
            }
          },
          ...(canReturn
            ? [
                {
                  label: 'Return / refund',
                  icon: Icons.refund,
                  onClick: () => setReturnOpen(true)
                }
              ]
            : [])
        ]}
      />
    </>
  );
}

function PosSalesTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    usePosSalesListQuery(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search POS sales…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No POS sales yet.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Sale</TableHead>
            <TableHead>Outlet</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Pay</TableHead>
            <TableHead className='text-right'>Total</TableHead>
            <TableHead>When</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={getEntityId(row)}>
              <TableCell className='font-medium'>{row.code}</TableCell>
              <TableCell>
                {row.location ? codeNameLabel(row.location) : '—'}
              </TableCell>
              <TableCell className='max-w-[220px] truncate text-sm'>
                {lineSummary(row.lines)}
              </TableCell>
              <TableCell>{formatEnumLabel(row.paymentMethod)}</TableCell>
              <TableCell className='text-right tabular-nums'>
                {formatMoney(row.total)}
              </TableCell>
              <TableCell>{formatEntityDate(row.soldAt)}</TableCell>
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

export default function PosSalesPage() {
  return (
    <PageContainer
      pageTitle='POS sales'
      pageDescription='Completed outlet register sales. Void a sale if it was rung up in error.'
      pageHeaderAction={
        <div className='flex flex-wrap gap-2'>
          <Button variant='outline' render={<Link href='/dashboard/sales/pos/returns' />}>
            <Icons.refund className='mr-2 size-4' />
            Returns
          </Button>
          <Button render={<Link href='/dashboard/sales/pos' />}>
            <Icons.pos className='mr-2 size-4' />
            Open POS
          </Button>
        </div>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <PosSalesTable />
      </Suspense>
    </PageContainer>
  );
}
