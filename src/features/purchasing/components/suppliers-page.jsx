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
import { useSuppliersListQuery } from '../api/queries';
import { useDeleteSupplierMutation } from '../api/mutations';
import { SupplierFormSheet } from './supplier-form-sheet';

function CellAction({ data }) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: remove, isPending } = useDeleteSupplierMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete supplier'));
    }
  });

  return (
    <>
      {editOpen ? (
        <SupplierFormSheet
          supplier={data}
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

function SuppliersTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    useSuppliersListQuery(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search suppliers…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No suppliers found.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Terms</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={getEntityId(row)}>
              <TableCell>
                <p className='font-medium'>{codeNameLabel(row)}</p>
                {row.email ? (
                  <p className='text-muted-foreground text-xs'>{row.email}</p>
                ) : null}
              </TableCell>
              <TableCell>
                <p className='text-sm'>{row.contactName || '—'}</p>
                <p className='text-muted-foreground text-xs'>
                  {row.phone || ''}
                </p>
              </TableCell>
              <TableCell>{row.city || '—'}</TableCell>
              <TableCell>{row.paymentTerms || '—'}</TableCell>
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

export default function SuppliersPage() {
  return (
    <PageContainer
      pageTitle='Suppliers'
      pageDescription='Vendors you buy fabric, trims, and packaging from.'
      pageHeaderAction={
        <FormSheetTrigger label='Add supplier'>
          {({ open, onOpenChange }) => (
            <SupplierFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <SuppliersTable />
      </Suspense>
    </PageContainer>
  );
}
