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
  formatEnumLabel,
  getEntityId,
  getEntityName
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useListParams } from '@/hooks/use-list-params';
import { useWarehouseDocsListQuery } from '../api/queries';
import {
  useDeleteWarehouseDocMutation,
  useSetWarehouseDocStatusMutation
} from '../api/mutations';
import {
  WAREHOUSE_DOC_TYPES,
  nextWarehouseDocStatus
} from '../constants/doc-types';
import {
  WarehouseDocFormSheet,
  WarehouseDocLinesSheet
} from './warehouse-doc-form-sheets';

function lineSummary(lines = []) {
  if (!lines.length) return 'No lines yet';
  return lines
    .map((line) => {
      const name = line.item ? codeNameLabel(line.item) : line.itemId;
      return `${line.quantity} ${name}`;
    })
    .join(' · ');
}

function CellAction({ type, data }) {
  const [editOpen, setEditOpen] = useState(false);
  const [linesOpen, setLinesOpen] = useState(false);
  const next = nextWarehouseDocStatus(data.status);
  const { mutate: remove, isPending } = useDeleteWarehouseDocMutation(type, {
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete'));
    }
  });
  const { mutate: setStatus } = useSetWarehouseDocStatusMutation(type, {
    onSuccess: (_res, variables) => {
      toast.success(`Marked ${variables.status.toLowerCase()}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update status'));
    }
  });

  return (
    <>
      {editOpen ? (
        <WarehouseDocFormSheet
          type={type}
          doc={data}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
      {linesOpen ? (
        <WarehouseDocLinesSheet
          type={type}
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

function DocsTable({ type }) {
  const meta = WAREHOUSE_DOC_TYPES[type];
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    useWarehouseDocsListQuery(type, filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder={meta.searchPlaceholder}
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage={meta.emptyMessage}
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>{meta.short}</TableHead>
            {type === 'MTN' ? (
              <>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
              </>
            ) : (
              <TableHead>Store</TableHead>
            )}
            {type === 'MRN' || type === 'MRR' ? (
              <TableHead>Supplier</TableHead>
            ) : null}
            {type === 'MIN' ? <TableHead>Issued to</TableHead> : null}
            {type === 'MRR' ? <TableHead>Reason</TableHead> : null}
            <TableHead>Lines</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={getEntityId(row)}>
              <TableCell className='font-medium'>{row.code}</TableCell>
              {type === 'MTN' ? (
                <>
                  <TableCell>
                    {row.fromStore ? codeNameLabel(row.fromStore) : '—'}
                  </TableCell>
                  <TableCell>
                    {row.toStore ? codeNameLabel(row.toStore) : '—'}
                  </TableCell>
                </>
              ) : (
                <TableCell className='text-muted-foreground'>
                  {row.store ? codeNameLabel(row.store) : '—'}
                </TableCell>
              )}
              {type === 'MRN' || type === 'MRR' ? (
                <TableCell>
                  {row.supplier ? codeNameLabel(row.supplier) : '—'}
                </TableCell>
              ) : null}
              {type === 'MIN' ? (
                <TableCell>{row.issuedTo || '—'}</TableCell>
              ) : null}
              {type === 'MRR' ? (
                <TableCell>{formatEnumLabel(row.reason)}</TableCell>
              ) : null}
              <TableCell className='max-w-[220px] truncate text-sm'>
                {lineSummary(row.lines)}
              </TableCell>
              <TableCell>{formatEntityDate(row.docDate)}</TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell>
                <CellAction type={type} data={row} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableShell>
    </EntityList>
  );
}

export default function WarehouseDocsPage({ type }) {
  const meta = WAREHOUSE_DOC_TYPES[type];

  return (
    <PageContainer
      pageTitle={meta.title}
      pageDescription={meta.description}
      pageHeaderAction={
        <FormSheetTrigger label={meta.addLabel}>
          {({ open, onOpenChange }) => (
            <WarehouseDocFormSheet
              type={type}
              open={open}
              onOpenChange={onOpenChange}
            />
          )}
        </FormSheetTrigger>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <DocsTable type={type} />
      </Suspense>
    </PageContainer>
  );
}
