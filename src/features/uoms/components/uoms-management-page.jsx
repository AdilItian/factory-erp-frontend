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
import { useUomConversionsQuery, useUomsListQuery } from '../api/queries';
import {
  useDeleteUomConversionMutation,
  useDeleteUomMutation
} from '../api/mutations';
import { ConversionFormSheet, UomFormSheet } from './uom-form-sheets';

function UomsTable() {
  const { search, setSearch } = useListParams({ searchKey: 'q', perPage: 50 });
  const { data: uoms = [], isPending, isError, error, refetch } =
    useUomsListQuery({ search: search.trim() || undefined });
  const { data: conversions = [] } = useUomConversionsQuery();
  const items = uoms.filter((uom) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return `${codeNameLabel(uom)} ${uom.symbol ?? ''}`
      .toLowerCase()
      .includes(query);
  });

  return (
    <div className='flex flex-col gap-6'>
      <EntityList
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder='Search units…'
        total={items.length}
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        emptyMessage='No units found.'
        isEmpty={items.length === 0}
      >
        <TableShell>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-12' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((uom) => (
              <UomRow key={getEntityId(uom)} uom={uom} />
            ))}
          </TableBody>
        </TableShell>
      </EntityList>

      <div>
        <div className='mb-2 flex items-center justify-between'>
          <h2 className='text-sm font-semibold tracking-tight'>Conversions</h2>
          <FormSheetTrigger label='Add conversion'>
            {({ open, onOpenChange }) => (
              <ConversionFormSheet open={open} onOpenChange={onOpenChange} />
            )}
          </FormSheetTrigger>
        </div>
        {conversions.length === 0 ? (
          <p className='text-muted-foreground text-sm'>No conversions yet.</p>
        ) : (
          <TableShell>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead className='text-right'>Factor</TableHead>
                <TableHead className='w-12' />
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversions.map((conversion) => (
                <ConversionRow
                  key={getEntityId(conversion)}
                  conversion={conversion}
                />
              ))}
            </TableBody>
          </TableShell>
        )}
      </div>
    </div>
  );
}

function UomRow({ uom }) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: deleteUom, isPending } = useDeleteUomMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete unit'));
    }
  });

  return (
    <TableRow>
      <TableCell className='font-mono text-xs font-semibold'>{uom.code}</TableCell>
      <TableCell className='font-medium'>{getEntityName(uom)}</TableCell>
      <TableCell className='text-muted-foreground'>{uom.symbol || '—'}</TableCell>
      <TableCell>
        <StatusLabel active={isEntityActive(uom)} />
      </TableCell>
      <TableCell>
        {editOpen ? (
          <UomFormSheet uom={uom} open={editOpen} onOpenChange={setEditOpen} />
        ) : null}
        <EntityCellAction
          onEdit={() => setEditOpen(true)}
          deletePending={isPending}
          onDelete={(close) =>
            deleteUom(getEntityId(uom), {
              onSuccess: () => {
                toast.success(`Deleted “${getEntityName(uom)}”`);
                close();
              }
            })
          }
        />
      </TableCell>
    </TableRow>
  );
}

function ConversionRow({ conversion }) {
  const { mutate: deleteConversion, isPending } =
    useDeleteUomConversionMutation({
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to delete conversion'));
      }
    });
  const fromLabel = conversion.fromUom?.code || conversion.fromUomId || 'From';
  const toLabel = conversion.toUom?.code || conversion.toUomId || 'To';

  return (
    <TableRow>
      <TableCell>{fromLabel}</TableCell>
      <TableCell>{toLabel}</TableCell>
      <TableCell className='text-right tabular-nums font-medium'>
        {conversion.factor}
      </TableCell>
      <TableCell>
        <EntityCellAction
          deletePending={isPending}
          onDelete={(close) =>
            deleteConversion(getEntityId(conversion), {
              onSuccess: () => {
                toast.success('Conversion deleted');
                close();
              }
            })
          }
        />
      </TableCell>
    </TableRow>
  );
}

export default function UomsManagementPage() {
  return (
    <PageContainer
      pageTitle='Units of measure'
      pageDescription='Base units and how they convert.'
      pageHeaderAction={
        <FormSheetTrigger label='Add unit'>
          {({ open, onOpenChange }) => (
            <UomFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <UomsTable />
      </Suspense>
    </PageContainer>
  );
}
