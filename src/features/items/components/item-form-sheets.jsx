'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CrudFormSheet } from '@/components/erp/crud-form-sheet';
import { EntityCellAction } from '@/components/erp/entity-cell-action';
import { compactPayload } from '@/lib/compact-payload';
import {
  codeNameLabel,
  getEntityDescription,
  getEntityId,
  getEntityName,
  isEntityActive,
  mapToOptions
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useUomsOptionsQuery } from '@/features/uoms/api/queries';
import { useAttributeSetsQuery } from '@/features/attributes/api/queries';
import { useItemCategoriesQuery } from '../api/queries';
import {
  useCreateItemCategoryMutation,
  useCreateItemMutation,
  useDeleteItemMutation,
  useUpdateItemCategoryMutation,
  useUpdateItemMutation
} from '../api/mutations';
import {
  CATEGORY_DEFAULTS,
  ITEM_DEFAULTS,
  categorySchema,
  getCategoryFormSections,
  getItemFormSections,
  itemSchema
} from '../constants/item-form-config';

function valuesFromItem(item) {
  if (!item) return ITEM_DEFAULTS;
  return {
    code: item.code ?? '',
    name: getEntityName(item, ''),
    description: getEntityDescription(item),
    type: item.type ?? 'FINISHED_GOOD',
    categoryId: item.categoryId ?? item.category?.id ?? '__none__',
    baseUomId: item.baseUomId ?? item.baseUom?.id ?? '',
    purchaseUomId: item.purchaseUomId ?? item.purchaseUom?.id ?? '__none__',
    salesUomId: item.salesUomId ?? item.salesUom?.id ?? '__none__',
    attributeSetId: item.attributeSetId ?? item.attributeSet?.id ?? '__none__',
    tracking: item.tracking ?? 'NONE',
    barcode: item.barcode ?? '',
    purchasePrice: item.purchasePrice ?? '',
    salesPrice: item.salesPrice ?? '',
    isTemplate: Boolean(item.isTemplate),
    isActive: isEntityActive(item)
  };
}

export function ItemFormSheet({ item, open, onOpenChange }) {
  const isEdit = Boolean(item);
  const { data: categories = [] } = useItemCategoriesQuery({}, { enabled: open });
  const { data: uoms = [] } = useUomsOptionsQuery({ enabled: open });
  const { data: sets = [] } = useAttributeSetsQuery({ enabled: open });
  const sections = useMemo(
    () =>
      getItemFormSections({
        categoryOptions: mapToOptions(categories, codeNameLabel),
        uomOptions: mapToOptions(uoms, codeNameLabel),
        setOptions: mapToOptions(sets, codeNameLabel)
      }),
    [categories, uoms, sets]
  );
  const defaultValues = useMemo(() => valuesFromItem(item), [item]);
  const { mutate: createItem, isPending: isCreating } = useCreateItemMutation({
    onSuccess: () => {
      toast.success('Item created');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to create item'));
    }
  });
  const { mutate: updateItem, isPending: isUpdating } = useUpdateItemMutation({
    onSuccess: () => {
      toast.success('Item updated');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update item'));
    }
  });

  function onSubmit(values) {
    const payload = compactPayload(values);
    if (isEdit) {
      const { type: _type, isTemplate: _isTemplate, ...rest } = payload;
      updateItem({ id: getEntityId(item), payload: rest });
      return;
    }
    createItem(payload);
  }

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit item' : 'New item'}
      description='Flags default from the item type. A service item cannot be stockable.'
      schema={itemSchema}
      defaultValues={defaultValues}
      sections={sections}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New item',
        title: isEdit
          ? 'Update this item, then save.'
          : 'Start with SKU and type, then fill units and prices you know.',
        description:
          'Flags default from the item type. A service item cannot be stockable.'
      }}
      onSubmit={onSubmit}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='item-form-sheet'
      createLabel='Create item'
      resetKey={getEntityId(item) || 'new'}
    />
  );
}

export function CategoryFormSheet({ category, open, onOpenChange }) {
  const isEdit = Boolean(category);
  const { data: categories = [] } = useItemCategoriesQuery({}, { enabled: open });
  const { data: sets = [] } = useAttributeSetsQuery({ enabled: open });
  const parentOptions = useMemo(
    () =>
      mapToOptions(
        categories.filter((row) => getEntityId(row) !== getEntityId(category)),
        codeNameLabel
      ),
    [categories, category]
  );
  const sections = useMemo(
    () =>
      getCategoryFormSections({
        parentOptions,
        setOptions: mapToOptions(sets, codeNameLabel)
      }),
    [parentOptions, sets]
  );
  const defaultValues = useMemo(
    () =>
      category
        ? {
            code: category.code ?? '',
            name: getEntityName(category, ''),
            description: getEntityDescription(category),
            parentId: category.parentId ?? category.parent?.id ?? '__none__',
            attributeSetId:
              category.attributeSetId ?? category.attributeSet?.id ?? '__none__',
            isActive: isEntityActive(category)
          }
        : CATEGORY_DEFAULTS,
    [category]
  );
  const { mutate: createCategory, isPending: isCreating } =
    useCreateItemCategoryMutation({
      onSuccess: () => {
        toast.success('Category created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create category'));
      }
    });
  const { mutate: updateCategory, isPending: isUpdating } =
    useUpdateItemCategoryMutation({
      onSuccess: () => {
        toast.success('Category updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update category'));
      }
    });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit category' : 'New category'}
      description='Attribute set is prefilled on items created under this category.'
      schema={categorySchema}
      defaultValues={defaultValues}
      sections={sections}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New category',
        title: isEdit
          ? 'Update this category, then save.'
          : 'Start with a code and name, then nest it if needed.',
        description:
          'Attribute set is prefilled on items created under this category.'
      }}
      onSubmit={(values) => {
        const payload = compactPayload(values);
        if (isEdit) updateCategory({ id: getEntityId(category), payload });
        else createCategory(payload);
      }}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='category-form-sheet'
      createLabel='Create category'
      resetKey={getEntityId(category) || 'new-category'}
    />
  );
}

export function ItemCellAction({ data }) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: deleteItem, isPending } = useDeleteItemMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete item'));
    }
  });

  return (
    <>
      {editOpen ? (
        <ItemFormSheet item={data} open={editOpen} onOpenChange={setEditOpen} />
      ) : null}
      <EntityCellAction
        onEdit={() => setEditOpen(true)}
        deletePending={isPending}
        onDelete={(close) =>
          deleteItem(getEntityId(data), {
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
