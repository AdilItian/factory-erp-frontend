'use client';

import { Suspense } from 'react';
import { FormSheetTrigger } from '@/components/erp/form-sheet-trigger';
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
import PageContainer from '@/components/layout/page-container';
import { codeNameLabel, getEntityId } from '@/lib/entity';
import { useListParams } from '@/hooks/use-list-params';
import { useOnHandQuery } from '../api/queries';
import { AdjustmentSheet, OpeningStockSheet } from './inventory-form-sheets';

function qty(row) {
  return (
    row.quantityOnHand ??
    row.onHand ??
    row.quantity ??
    row.qty ??
    '0'
  );
}

function OnHandTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } = useOnHandQuery({
    ...filters,
    nonZeroOnly: true
  });
  const items = (data?.items ?? []).filter((row) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    const haystack = `${row.item?.name ?? ''} ${row.item?.code ?? ''} ${row.store?.name ?? ''} ${row.store?.code ?? ''}`.toLowerCase();
    return haystack.includes(query);
  });
  const total = search.trim() ? items.length : (data?.total ?? items.length);
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Filter by item or store…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No stock on hand.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead className='text-right'>On hand</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={getEntityId(row) || `${row.itemId}-${row.storeId}-${row.batchId}`}>
              <TableCell className='font-medium'>
                {row.item ? codeNameLabel(row.item) : row.itemId || '—'}
              </TableCell>
              <TableCell>
                {row.store ? codeNameLabel(row.store) : row.storeId || '—'}
              </TableCell>
              <TableCell>
                {row.batch?.code || row.batchCode || row.serialNo || '—'}
              </TableCell>
              <TableCell className='text-right tabular-nums'>
                {qty(row)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableShell>
    </EntityList>
  );
}

export default function InventoryOnHandPage() {
  return (
    <PageContainer
      pageTitle='Stock on hand'
      pageDescription='Cached balances per item, store, and batch or serial.'
      pageHeaderAction={
        <div className='flex flex-wrap gap-2'>
          <FormSheetTrigger label='Opening stock'>
            {({ open, onOpenChange }) => (
              <OpeningStockSheet open={open} onOpenChange={onOpenChange} />
            )}
          </FormSheetTrigger>
          <FormSheetTrigger label='Adjust stock'>
            {({ open, onOpenChange }) => (
              <AdjustmentSheet open={open} onOpenChange={onOpenChange} />
            )}
          </FormSheetTrigger>
        </div>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <OnHandTable />
      </Suspense>
    </PageContainer>
  );
}
