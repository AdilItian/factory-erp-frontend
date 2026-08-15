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
import { Icons } from '@/components/icons';
import {
  codeNameLabel,
  getEntityId,
  getEntityName,
  isEntityActive
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useListParams } from '@/hooks/use-list-params';
import { useBomsListQuery } from '../api/queries';
import { useDeleteBomMutation } from '../api/mutations';
import { formatBomLine } from '../utils/bom-label';
import { BomFormSheet, BomLinesSheet } from './bom-form-sheets';

function CellAction({ data }) {
  const [editOpen, setEditOpen] = useState(false);
  const [linesOpen, setLinesOpen] = useState(false);
  const { mutate: remove, isPending } = useDeleteBomMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete BoM'));
    }
  });

  return (
    <>
      {editOpen ? (
        <BomFormSheet bom={data} open={editOpen} onOpenChange={setEditOpen} />
      ) : null}
      {linesOpen ? (
        <BomLinesSheet bom={data} open={linesOpen} onOpenChange={setLinesOpen} />
      ) : null}
      <EntityCellAction
        extraItems={[
          {
            label: 'Components',
            icon: Icons.bom,
            onClick: () => setLinesOpen(true)
          }
        ]}
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

function BomsTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    useBomsListQuery(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search bills of materials…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No bills of materials found.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Finished good</TableHead>
            <TableHead>Makes</TableHead>
            <TableHead>Raw materials / components</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={getEntityId(row)}>
              <TableCell>
                <p className='font-medium'>
                  {row.item ? codeNameLabel(row.item) : codeNameLabel(row)}
                </p>
                <p className='text-muted-foreground text-xs'>{row.code}</p>
              </TableCell>
              <TableCell className='tabular-nums'>
                {row.outputQty || '1'} pc
              </TableCell>
              <TableCell>
                {(row.lines ?? []).length === 0 ? (
                  <span className='text-muted-foreground text-sm'>
                    No recipe yet — add components
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

export default function BomsPage() {
  return (
    <PageContainer
      pageTitle='Bills of materials'
      pageDescription='The recipe for a finished good. Start from a BoM template to prefill scaled components, or build by hand.'
      pageHeaderAction={
        <FormSheetTrigger label='Add BoM'>
          {({ open, onOpenChange }) => (
            <BomFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <BomsTable />
      </Suspense>
    </PageContainer>
  );
}
