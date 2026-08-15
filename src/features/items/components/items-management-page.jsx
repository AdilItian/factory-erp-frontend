'use client';

import { Suspense } from 'react';
import {
  EntityList,
  StatusLabel,
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
import { Badge } from '@/components/ui/badge';
import {
  codeNameLabel,
  formatEnumLabel,
  getEntityId,
  isEntityActive
} from '@/lib/entity';
import { useListParams } from '@/hooks/use-list-params';
import { useItemsListQuery } from '../api/queries';
import { ItemCellAction, ItemFormSheet } from './item-form-sheets';

function ItemsTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    useItemsListQuery(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search SKU, name, or barcode…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No items found.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Code / name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Tracking</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={getEntityId(item)}>
              <TableCell className='font-medium'>
                {codeNameLabel(item)}
                {item.isTemplate ? (
                  <Badge variant='secondary' className='ml-2'>
                    Template
                  </Badge>
                ) : null}
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {item.category?.name || item.baseUom?.code || '—'}
              </TableCell>
              <TableCell>{formatEnumLabel(item.type)}</TableCell>
              <TableCell className='text-muted-foreground'>
                {item.tracking && item.tracking !== 'NONE'
                  ? formatEnumLabel(item.tracking)
                  : '—'}
              </TableCell>
              <TableCell>
                <StatusLabel active={isEntityActive(item)} />
              </TableCell>
              <TableCell>
                <ItemCellAction data={item} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableShell>
    </EntityList>
  );
}

export default function ItemsManagementPage() {
  return (
    <PageContainer
      pageTitle='Items'
      pageDescription='SKUs, templates, and sellable or stockable items.'
      pageHeaderAction={
        <FormSheetTrigger label='Add item'>
          {({ open, onOpenChange }) => (
            <ItemFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <ItemsTable />
      </Suspense>
    </PageContainer>
  );
}
