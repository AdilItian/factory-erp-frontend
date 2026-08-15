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
import purchasingService from '../api/service';
import {
  usePurchaseOrderDetailQuery,
  useSuppliersOptionsQuery
} from '../api/queries';
import {
  useAddPurchaseOrderLineMutation,
  useCreatePurchaseOrderMutation,
  useRemovePurchaseOrderLineMutation,
  useUpdatePurchaseOrderMutation
} from '../api/mutations';
import {
  PO_LINE_DEFAULTS,
  PURCHASE_ORDER_DEFAULTS,
  getPurchaseOrderFormSections,
  getPurchaseOrderLineFormSections,
  purchaseOrderLineSchema,
  purchaseOrderSchema
} from '../constants/purchase-order-form-config';

function valuesFromOrder(row) {
  if (!row) return PURCHASE_ORDER_DEFAULTS;
  return {
    supplierId: refId(row.supplierId) || refId(row.supplier),
    locationId: refId(row.locationId) || refId(row.location),
    orderDate: (row.orderDate ?? '').toString().slice(0, 10),
    expectedDate: (row.expectedDate ?? '').toString().slice(0, 10),
    notes: row.notes ?? ''
  };
}

export function PurchaseOrderFormSheet({ order, open, onOpenChange }) {
  const isEdit = Boolean(order);
  const catalog = purchasingService.getCatalog();
  const { data: suppliers = [] } = useSuppliersOptionsQuery({ enabled: open });
  const supplierOptions = useMemo(
    () => mapToOptions(suppliers, codeNameLabel),
    [suppliers]
  );
  const locationOptions = useMemo(
    () => mapToOptions(catalog.locations, codeNameLabel),
    [catalog.locations]
  );
  const sections = useMemo(
    () => getPurchaseOrderFormSections(supplierOptions, locationOptions),
    [supplierOptions, locationOptions]
  );
  const defaultValues = useMemo(() => valuesFromOrder(order), [order]);

  const { mutate: createRow, isPending: isCreating } =
    useCreatePurchaseOrderMutation({
      onSuccess: () => {
        toast.success('Purchase order created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create PO'));
      }
    });
  const { mutate: updateRow, isPending: isUpdating } =
    useUpdatePurchaseOrderMutation({
      onSuccess: () => {
        toast.success('Purchase order updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update PO'));
      }
    });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit purchase order' : 'New purchase order'}
      description='Add lines from the table after create, then confirm and receive.'
      schema={purchaseOrderSchema}
      defaultValues={defaultValues}
      sections={sections}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New purchase order',
        title: isEdit
          ? 'Update this order, then save.'
          : 'Pick the supplier and where goods will be received.',
        description: 'Open Lines from the row menu to add fabric, trims, and more.'
      }}
      onSubmit={(values) => {
        const payload = compactPayload(values);
        if (isEdit) {
          updateRow({ id: getEntityId(order), payload });
          return;
        }
        createRow(payload);
      }}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='purchase-order-form'
      createLabel='Create PO'
      resetKey={getEntityId(order) || 'new'}
    />
  );
}

export function PurchaseOrderLinesSheet({ order, open, onOpenChange }) {
  const orderId = getEntityId(order);
  const catalog = purchasingService.getCatalog();
  const { data: detail } = usePurchaseOrderDetailQuery(orderId, {
    enabled: open && Boolean(orderId)
  });
  const itemOptions = useMemo(
    () => mapToOptions(catalog.items, codeNameLabel),
    [catalog.items]
  );
  const sections = useMemo(
    () => getPurchaseOrderLineFormSections(itemOptions),
    [itemOptions]
  );
  const lines = detail?.lines ?? order?.lines ?? [];

  const { mutate: addLine, isPending } = useAddPurchaseOrderLineMutation({
    onSuccess: () => toast.success('Line added'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to add line'));
    }
  });
  const { mutate: removeLine } = useRemovePurchaseOrderLineMutation({
    onSuccess: () => toast.success('Line removed'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to remove line'));
    }
  });

  return (
    <LinesSheet
      open={open}
      onOpenChange={onOpenChange}
      title='Purchase order lines'
      description={`Items on ${getEntityName(order, order?.code)}.`}
      schema={purchaseOrderLineSchema}
      defaultValues={PO_LINE_DEFAULTS}
      sections={sections}
      intro={{
        eyebrow: 'PO line',
        title: 'Add one item at a time.',
        description: 'Quantity is what you expect to receive.'
      }}
      listTitle='On this PO'
      listDescription='Remove a line if it should not be purchased.'
      listIcon='purchaseOrder'
      rows={lines}
      emptyMessage='No lines yet.'
      addLabel='Add line'
      isPending={isPending}
      formId='po-line-form'
      onAdd={(values) =>
        addLine({ id: orderId, payload: compactPayload(values) })
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
            <p className='text-muted-foreground text-xs'>
              {line.quantity}
              {line.unitPrice ? ` · ${line.unitPrice}/unit` : ''}
            </p>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='text-muted-foreground size-8'
            onClick={() => removeLine({ id: orderId, lineId: line.id })}
          >
            <Icons.trash className='size-4' />
          </Button>
        </div>
      )}
    />
  );
}
