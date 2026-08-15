'use client';

import { useState } from 'react';
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
  TableShell
} from '@/components/erp/entity-list';
import {
  codeNameLabel,
  formatEnumLabel,
  getEntityId,
  getEntityName,
  isEntityActive
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useListParams } from '@/hooks/use-list-params';
import { Icons } from '@/components/icons';
import { useAttributesListQuery } from '../api/queries';
import { useDeleteAttributeMutation } from '../api/mutations';
import { AttributeFormSheet } from './attribute-form-sheets';
import { AttributeOptionsSheet } from './attribute-nested-sheets';

export function AttributesPanel() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    useAttributesListQuery(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search attributes…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No attributes found.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Code / name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Flags</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((attribute) => (
            <AttributeRow key={getEntityId(attribute)} attribute={attribute} />
          ))}
        </TableBody>
      </TableShell>
    </EntityList>
  );
}

function AttributeRow({ attribute }) {
  const [editOpen, setEditOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const { mutate: deleteAttribute, isPending } = useDeleteAttributeMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete attribute'));
    }
  });
  const isEnum = String(attribute.dataType).toUpperCase() === 'ENUM';
  const flags = [
    attribute.isRequired ? 'Required' : null,
    attribute.isVariantAxis ? 'Variant axis' : null
  ].filter(Boolean);

  return (
    <TableRow>
      <TableCell className='font-medium'>{codeNameLabel(attribute)}</TableCell>
      <TableCell>{formatEnumLabel(attribute.dataType)}</TableCell>
      <TableCell className='text-muted-foreground'>
        {flags.length ? flags.join(', ') : '—'}
      </TableCell>
      <TableCell>
        <StatusLabel active={isEntityActive(attribute)} />
      </TableCell>
      <TableCell>
        {editOpen ? (
          <AttributeFormSheet
            attribute={attribute}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
        ) : null}
        {optionsOpen ? (
          <AttributeOptionsSheet
            attribute={attribute}
            open={optionsOpen}
            onOpenChange={setOptionsOpen}
          />
        ) : null}
        <EntityCellAction
          onEdit={() => setEditOpen(true)}
          extraItems={
            isEnum
              ? [
                  {
                    label: 'Manage options',
                    icon: Icons.tags,
                    onClick: () => setOptionsOpen(true)
                  }
                ]
              : []
          }
          deletePending={isPending}
          onDelete={(close) =>
            deleteAttribute(getEntityId(attribute), {
              onSuccess: () => {
                toast.success(`Deleted “${getEntityName(attribute)}”`);
                close();
              }
            })
          }
        />
      </TableCell>
    </TableRow>
  );
}
