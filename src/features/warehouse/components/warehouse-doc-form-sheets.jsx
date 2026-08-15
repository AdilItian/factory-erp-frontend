'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CrudFormSheet } from '@/components/erp/crud-form-sheet';
import { LinesSheet } from '@/components/erp/lines-sheet';
import { Icons } from '@/components/icons';
import { compactPayload } from '@/lib/compact-payload';
import {
  codeNameLabel,
  getEntityId,
  getEntityName,
  mapToOptions,
  refId
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import warehouseService from '../api/service';
import { useWarehouseDocDetailQuery } from '../api/queries';
import {
  useAddWarehouseDocLineMutation,
  useCreateWarehouseDocMutation,
  useRemoveWarehouseDocLineMutation,
  useUpdateWarehouseDocMutation
} from '../api/mutations';
import { WAREHOUSE_DOC_TYPES } from '../constants/doc-types';
import {
  DOC_DEFAULTS,
  WAREHOUSE_LINE_DEFAULTS,
  getDocFormSections,
  getDocSchema,
  getLineFormSections,
  warehouseLineSchema
} from '../constants/warehouse-form-config';

function valuesFromDoc(type, row) {
  const defaults = DOC_DEFAULTS[type];
  if (!row) return defaults;
  return {
    ...defaults,
    storeId: refId(row.storeId) || refId(row.store),
    fromStoreId: refId(row.fromStoreId) || refId(row.fromStore),
    toStoreId: refId(row.toStoreId) || refId(row.toStore),
    supplierId: refId(row.supplierId) || refId(row.supplier),
    purchaseOrderCode: row.purchaseOrderCode ?? '',
    issuedTo: row.issuedTo ?? '',
    reason: row.reason ?? 'DAMAGED',
    docDate: (row.docDate ?? '').toString().slice(0, 10),
    reference: row.reference ?? '',
    notes: row.notes ?? ''
  };
}

export function WarehouseDocFormSheet({ type, doc, open, onOpenChange }) {
  const meta = WAREHOUSE_DOC_TYPES[type];
  const isEdit = Boolean(doc);
  const catalog = warehouseService.getCatalog();
  const storeOptions = useMemo(
    () => mapToOptions(catalog.stores, codeNameLabel),
    [catalog.stores]
  );
  const supplierOptions = useMemo(
    () => mapToOptions(catalog.suppliers, codeNameLabel),
    [catalog.suppliers]
  );
  const sections = useMemo(
    () => getDocFormSections(type, { storeOptions, supplierOptions }),
    [type, storeOptions, supplierOptions]
  );
  const defaultValues = useMemo(() => valuesFromDoc(type, doc), [type, doc]);

  const { mutate: createRow, isPending: isCreating } =
    useCreateWarehouseDocMutation(type, {
      onSuccess: () => {
        toast.success(`${meta.short} created`);
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, `Failed to create ${meta.short}`));
      }
    });
  const { mutate: updateRow, isPending: isUpdating } =
    useUpdateWarehouseDocMutation(type, {
      onSuccess: () => {
        toast.success(`${meta.short} updated`);
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, `Failed to update ${meta.short}`));
      }
    });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? `Edit ${meta.short}` : `New ${meta.short}`}
      description='Add lines from the table after create, then post when ready.'
      schema={getDocSchema(type)}
      defaultValues={defaultValues}
      sections={sections}
      intro={{
        eyebrow: isEdit ? 'Editing' : `New ${meta.short}`,
        title: isEdit
          ? 'Update this document, then save.'
          : meta.description,
        description: 'Open Lines from the row menu to add items.'
      }}
      onSubmit={(values) => {
        const payload = compactPayload(values);
        if (isEdit) {
          updateRow({ id: getEntityId(doc), payload });
          return;
        }
        createRow(payload);
      }}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId={`${type.toLowerCase()}-form`}
      createLabel={`Create ${meta.short}`}
      resetKey={getEntityId(doc) || 'new'}
    />
  );
}

export function WarehouseDocLinesSheet({ type, doc, open, onOpenChange }) {
  const meta = WAREHOUSE_DOC_TYPES[type];
  const docId = getEntityId(doc);
  const catalog = warehouseService.getCatalog();
  const { data: detail } = useWarehouseDocDetailQuery(type, docId, {
    enabled: open && Boolean(docId)
  });
  const itemOptions = useMemo(
    () => mapToOptions(catalog.items, codeNameLabel),
    [catalog.items]
  );
  const sections = useMemo(
    () => getLineFormSections(itemOptions),
    [itemOptions]
  );
  const lines = detail?.lines ?? doc?.lines ?? [];

  const { mutate: addLine, isPending } = useAddWarehouseDocLineMutation(type, {
    onSuccess: () => toast.success('Line added'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to add line'));
    }
  });
  const { mutate: removeLine } = useRemoveWarehouseDocLineMutation(type, {
    onSuccess: () => toast.success('Line removed'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to remove line'));
    }
  });

  return (
    <LinesSheet
      open={open}
      onOpenChange={onOpenChange}
      title={`${meta.short} lines`}
      description={`Items on ${getEntityName(doc, doc?.code)}.`}
      schema={warehouseLineSchema}
      defaultValues={WAREHOUSE_LINE_DEFAULTS}
      sections={sections}
      intro={{
        eyebrow: `${meta.short} line`,
        title: 'Add one item at a time.',
        description: 'Quantity moves when you post the document.'
      }}
      listTitle='On this document'
      listDescription='Remove a line if it should not be included.'
      listIcon={meta.icon}
      rows={lines}
      emptyMessage='No lines yet.'
      addLabel='Add line'
      isPending={isPending}
      formId={`${type.toLowerCase()}-line-form`}
      onAdd={(values) =>
        addLine({ id: docId, payload: compactPayload(values) })
      }
      renderRow={(line) => (
        <div
          key={line.id}
          className='flex items-center justify-between gap-3 px-4 py-2.5'
        >
          <div className='min-w-0'>
            <p className='truncate text-sm font-medium'>
              {line.item ? codeNameLabel(line.item) : line.itemId}
            </p>
            <p className='text-muted-foreground text-xs'>{line.quantity}</p>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='text-muted-foreground size-8'
            onClick={() => removeLine({ id: docId, lineId: line.id })}
          >
            <Icons.trash className='size-4' />
          </Button>
        </div>
      )}
    />
  );
}
