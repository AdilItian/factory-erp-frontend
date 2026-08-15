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
import salesService from '../api/service';
import {
  useCustomersOptionsQuery,
  useSalesOrderDetailQuery
} from '../api/queries';
import {
  useAddSalesOrderLineMutation,
  useCreateSalesOrderMutation,
  useRemoveSalesOrderLineMutation,
  useUpdateSalesOrderMutation
} from '../api/mutations';
import {
  SALES_ORDER_DEFAULTS,
  SO_LINE_DEFAULTS,
  getSalesOrderFormSections,
  getSalesOrderLineFormSections,
  salesOrderLineSchema,
  salesOrderSchema
} from '../constants/sales-order-form-config';

function valuesFromOrder(row) {
  if (!row) return SALES_ORDER_DEFAULTS;
  return {
    customerId: refId(row.customerId) || refId(row.customer),
    locationId: refId(row.locationId) || refId(row.location),
    shipToId: refId(row.shipToId) || refId(row.shipTo) || '__none__',
    orderDate: (row.orderDate ?? '').toString().slice(0, 10),
    dueDate: (row.dueDate ?? '').toString().slice(0, 10),
    notes: row.notes ?? ''
  };
}

export function SalesOrderFormSheet({ order, open, onOpenChange }) {
  const isEdit = Boolean(order);
  const catalog = salesService.getCatalog();
  const { data: customers = [] } = useCustomersOptionsQuery({ enabled: open });
  const customerOptions = useMemo(
    () => mapToOptions(customers, codeNameLabel),
    [customers]
  );
  const locationOptions = useMemo(
    () => mapToOptions(catalog.locations, codeNameLabel),
    [catalog.locations]
  );
  const sections = useMemo(
    () => getSalesOrderFormSections(customerOptions, locationOptions),
    [customerOptions, locationOptions]
  );
  const defaultValues = useMemo(() => valuesFromOrder(order), [order]);

  const { mutate: createRow, isPending: isCreating } =
    useCreateSalesOrderMutation({
      onSuccess: () => {
        toast.success('Sales order created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create sales order'));
      }
    });
  const { mutate: updateRow, isPending: isUpdating } =
    useUpdateSalesOrderMutation({
      onSuccess: () => {
        toast.success('Sales order updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update sales order'));
      }
    });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit sales order' : 'New sales order'}
      description='Add lines from the table after create, then confirm and ship.'
      schema={salesOrderSchema}
      defaultValues={defaultValues}
      sections={sections}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New sales order',
        title: isEdit
          ? 'Update this order, then save.'
          : 'Pick the customer and where finished goods ship from.',
        description: 'Open Lines from the row menu to add finished goods.'
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
      formId='sales-order-form'
      createLabel='Create sales order'
      resetKey={getEntityId(order) || 'new'}
    />
  );
}

export function SalesOrderLinesSheet({ order, open, onOpenChange }) {
  const orderId = getEntityId(order);
  const catalog = salesService.getCatalog();
  const { data: detail } = useSalesOrderDetailQuery(orderId, {
    enabled: open && Boolean(orderId)
  });
  const itemOptions = useMemo(
    () => mapToOptions(catalog.items, codeNameLabel),
    [catalog.items]
  );
  const sections = useMemo(
    () => getSalesOrderLineFormSections(itemOptions),
    [itemOptions]
  );
  const lines = detail?.lines ?? order?.lines ?? [];

  const { mutate: addLine, isPending } = useAddSalesOrderLineMutation({
    onSuccess: () => toast.success('Line added'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to add line'));
    }
  });
  const { mutate: removeLine } = useRemoveSalesOrderLineMutation({
    onSuccess: () => toast.success('Line removed'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to remove line'));
    }
  });

  return (
    <LinesSheet
      open={open}
      onOpenChange={onOpenChange}
      title='Sales order lines'
      description={`Items on ${getEntityName(order, order?.code)}.`}
      schema={salesOrderLineSchema}
      defaultValues={SO_LINE_DEFAULTS}
      sections={sections}
      intro={{
        eyebrow: 'SO line',
        title: 'Add one finished good at a time.',
        description: 'Quantity is what the customer ordered.'
      }}
      listTitle='On this order'
      listDescription='Remove a line if it should not ship with this order.'
      listIcon='salesOrder'
      rows={lines}
      emptyMessage='No lines yet.'
      addLabel='Add line'
      isPending={isPending}
      formId='so-line-form'
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
