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
import { useGatePassesListQuery } from '../api/queries';
import {
  useDeleteGatePassMutation,
  useSetGatePassStatusMutation
} from '../api/mutations';
import { nextGatePassStatus } from '../constants/gate-pass-form-config';
import { GatePassFormSheet, GatePassLinesSheet } from './gate-pass-form-sheets';
import { StatusBadge } from './status-badge';

function CellAction({ data }) {
  const [editOpen, setEditOpen] = useState(false);
  const [linesOpen, setLinesOpen] = useState(false);
  const next = nextGatePassStatus(data.status);
  const { mutate: remove, isPending } = useDeleteGatePassMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete gate pass'));
    }
  });
  const { mutate: setStatus } = useSetGatePassStatusMutation({
    onSuccess: (_res, variables) => {
      toast.success(
        variables.status === 'ISSUED' ? 'Gate pass issued' : 'Gate pass closed'
      );
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update gate pass'));
    }
  });

  return (
    <>
      {editOpen ? (
        <GatePassFormSheet
          gatePass={data}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
      {linesOpen ? (
        <GatePassLinesSheet
          gatePass={data}
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

function GatePassesTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    useGatePassesListQuery(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search gate passes…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No gate passes found.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Pass</TableHead>
            <TableHead>Direction</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Issued</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={getEntityId(row)}>
              <TableCell className='font-medium'>
                {row.code}
                <span className='text-muted-foreground ml-2 text-xs'>
                  {formatEnumLabel(row.reason)}
                </span>
              </TableCell>
              <TableCell>{formatEnumLabel(row.type)}</TableCell>
              <TableCell className='text-muted-foreground'>
                {row.location ? codeNameLabel(row.location) : '—'}
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {row.vehicleNo || '—'}
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {formatEntityDate(row.issuedAt)}
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

export default function GatePassesPage() {
  return (
    <PageContainer
      pageTitle='Gate passes'
      pageDescription='Inward and outward material movement at the factory gate.'
      pageHeaderAction={
        <FormSheetTrigger label='Add gate pass'>
          {({ open, onOpenChange }) => (
            <GatePassFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <GatePassesTable />
      </Suspense>
    </PageContainer>
  );
}
