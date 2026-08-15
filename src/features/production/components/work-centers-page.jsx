'use client';

import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import { EntityCellAction } from '@/components/erp/entity-cell-action';
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
import {
  codeNameLabel,
  formatEnumLabel,
  getEntityId,
  getEntityName,
  isEntityActive
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useListParams } from '@/hooks/use-list-params';
import { useWorkCentersListQuery } from '../api/queries';
import { useDeleteWorkCenterMutation } from '../api/mutations';
import { WorkCenterFormSheet } from './work-center-form-sheet';

function CellAction({ data }) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: remove, isPending } = useDeleteWorkCenterMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete work center'));
    }
  });

  return (
    <>
      {editOpen ? (
        <WorkCenterFormSheet
          workCenter={data}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
      <EntityCellAction
        onEdit={() => setEditOpen(true)}
        deletePending={isPending}
        onDelete={(close) =>
          remove(getEntityId(data), {
            onSuccess: () => {
              toast.success(`Deleted “${getEntityName(data)}”`);
              close();
            }
          })
        }
      />
    </>
  );
}

function WorkCentersTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    useWorkCentersListQuery(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search work centers…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No work centers found.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Code / name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className='text-right'>Capacity / day</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={getEntityId(row)}>
              <TableCell className='font-medium'>{codeNameLabel(row)}</TableCell>
              <TableCell>{formatEnumLabel(row.type)}</TableCell>
              <TableCell className='text-muted-foreground'>
                {row.location ? codeNameLabel(row.location) : '—'}
              </TableCell>
              <TableCell className='text-right tabular-nums'>
                {row.capacityPerDay || '—'}
              </TableCell>
              <TableCell>
                <StatusLabel active={isEntityActive(row)} />
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

export default function WorkCentersPage() {
  return (
    <PageContainer
      pageTitle='Work centers'
      pageDescription='Cutting, sewing, finishing, and other shop-floor stations.'
      pageHeaderAction={
        <FormSheetTrigger label='Add work center'>
          {({ open, onOpenChange }) => (
            <WorkCenterFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <WorkCentersTable />
      </Suspense>
    </PageContainer>
  );
}
