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
import { useCustomersListQuery } from '../api/queries';
import { useDeleteCustomerMutation } from '../api/mutations';
import { CustomerFormSheet } from './customer-form-sheet';

function CellAction({ data }) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: remove, isPending } = useDeleteCustomerMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete customer'));
    }
  });

  return (
    <>
      {editOpen ? (
        <CustomerFormSheet
          customer={data}
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

function CustomersTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    useCustomersListQuery(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search customers…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No customers found.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
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

export default function CustomersPage() {
  return (
    <PageContainer
      pageTitle='Customers'
      pageDescription='Outlets, wholesalers, and export buyers you sell finished goods to.'
      pageHeaderAction={
        <FormSheetTrigger label='Add customer'>
          {({ open, onOpenChange }) => (
            <CustomerFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <CustomersTable />
      </Suspense>
    </PageContainer>
  );
}
