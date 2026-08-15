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
  getEntityId,
  getEntityName,
  isEntityActive
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useListParams } from '@/hooks/use-list-params';
import { useBomTemplatesListQuery } from '../api/queries';
import { useDeleteBomTemplateMutation } from '../api/mutations';
import { formatBomLine } from '../utils/bom-label';
import { BomTemplateFormSheet } from './bom-template-form-sheets';

function CellAction({ data }) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: remove, isPending } = useDeleteBomTemplateMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete template'));
    }
  });

  return (
    <>
      {editOpen ? (
        <BomTemplateFormSheet
          template={data}
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

function BomTemplatesTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    useBomTemplatesListQuery(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search BoM templates…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No BoM templates found.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Template</TableHead>
            <TableHead>Finished good</TableHead>
            <TableHead>Per</TableHead>
            <TableHead>Components</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={getEntityId(row)}>
              <TableCell>
                <p className='font-medium'>{getEntityName(row)}</p>
                <p className='text-muted-foreground text-xs'>{row.code}</p>
              </TableCell>
              <TableCell>
                {row.item ? codeNameLabel(row.item) : '—'}
              </TableCell>
              <TableCell className='tabular-nums'>
                {row.baseQty || '1'} pc
              </TableCell>
              <TableCell>
                {(row.lines ?? []).length === 0 ? (
                  <span className='text-muted-foreground text-sm'>
                    No components yet
                  </span>
                ) : (
                  <ul className='space-y-0.5 text-sm'>
                    {(row.lines ?? []).map((line) => (
                      <li key={line.id}>{formatBomLine(line)}</li>
                    ))}
                  </ul>
                )}
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

export default function BomTemplatesPage() {
  return (
    <PageContainer
      pageTitle='BoM templates'
      pageDescription='Configure per-piece recipes once. When you create a BoM, pick a template and finished quantity — components prefill scaled.'
      pageHeaderAction={
        <FormSheetTrigger label='Add template'>
          {({ open, onOpenChange }) => (
            <BomTemplateFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <BomTemplatesTable />
      </Suspense>
    </PageContainer>
  );
}
