'use client';

import { Suspense } from 'react';
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
import {
  codeNameLabel,
  formatEntityDate,
  formatEnumLabel,
  getEntityId
} from '@/lib/entity';
import { useListParams } from '@/hooks/use-list-params';
import { useLedgerQuery } from '../api/queries';

function LedgerTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 50
  });
  const { data, isPending, isError, error, refetch } = useLedgerQuery({
    ...filters,
    limit: perPage
  });
  const items = (data?.items ?? []).filter((row) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    const haystack = `${row.item?.name ?? ''} ${row.item?.code ?? ''} ${row.store?.name ?? ''} ${row.movementType ?? ''}`.toLowerCase();
    return haystack.includes(query);
  });
  const total = search.trim() ? items.length : (data?.total ?? items.length);
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Filter movements…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No stock movements yet.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>When</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Store</TableHead>
            <TableHead className='text-right'>Qty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow
              key={
                getEntityId(row) ||
                `${row.postedAt}-${row.itemId}-${row.storeId}`
              }
            >
              <TableCell className='text-muted-foreground whitespace-nowrap text-xs'>
                {formatEntityDate(row.postedAt ?? row.createdAt)}
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {formatEnumLabel(row.movementType ?? row.type)}
              </TableCell>
              <TableCell>
                {row.item ? codeNameLabel(row.item) : row.itemId || '—'}
              </TableCell>
              <TableCell>
                {row.store ? codeNameLabel(row.store) : row.storeId || '—'}
              </TableCell>
              <TableCell className='text-right tabular-nums font-medium'>
                {row.quantity ?? row.qty ?? '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableShell>
    </EntityList>
  );
}

export default function InventoryLedgerPage() {
  return (
    <PageContainer
      pageTitle='Stock movements'
      pageDescription='Append-only ledger, newest first.'
    >
      <Suspense fallback={<TableSkeleton />}>
        <LedgerTable />
      </Suspense>
    </PageContainer>
  );
}
