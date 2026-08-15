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
import { FormSheetTrigger } from '@/components/erp/form-sheet-trigger';
import PageContainer from '@/components/layout/page-container';
import {
  codeNameLabel,
  getEntityId,
  getEntityName,
  isEntityActive
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useItemCategoriesQuery } from '../api/queries';
import { useDeleteItemCategoryMutation } from '../api/mutations';
import { CategoryFormSheet } from './item-form-sheets';

function CategoriesTable() {
  const { data: categories = [], isPending, isError, error, refetch } =
    useItemCategoriesQuery();

  return (
    <EntityList
      hideSearch
      total={categories.length}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No categories yet.'
      isEmpty={categories.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Code / name</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <CategoryRow key={getEntityId(category)} category={category} />
          ))}
        </TableBody>
      </TableShell>
    </EntityList>
  );
}

function CategoryRow({ category }) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: deleteCategory, isPending } = useDeleteItemCategoryMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete category'));
    }
  });

  return (
    <TableRow>
      <TableCell className='font-medium'>{codeNameLabel(category)}</TableCell>
      <TableCell className='text-muted-foreground'>
        {category.parent?.name || 'Top level'}
      </TableCell>
      <TableCell>
        <StatusLabel active={isEntityActive(category)} />
      </TableCell>
      <TableCell>
        {editOpen ? (
          <CategoryFormSheet
            category={category}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
        ) : null}
        <EntityCellAction
          onEdit={() => setEditOpen(true)}
          deletePending={isPending}
          onDelete={(close) =>
            deleteCategory(getEntityId(category), {
              onSuccess: () => {
                toast.success(`Deleted “${getEntityName(category)}”`);
                close();
              }
            })
          }
        />
      </TableCell>
    </TableRow>
  );
}

export default function ItemCategoriesManagementPage() {
  return (
    <PageContainer
      pageTitle='Item categories'
      pageDescription='Group items and optionally attach an attribute set.'
      pageHeaderAction={
        <FormSheetTrigger label='Add category'>
          {({ open, onOpenChange }) => (
            <CategoryFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <CategoriesTable />
    </PageContainer>
  );
}
