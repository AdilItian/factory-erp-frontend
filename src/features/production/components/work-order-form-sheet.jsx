'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import { CrudFormSheet } from '@/components/erp/crud-form-sheet';
import { compactPayload } from '@/lib/compact-payload';
import {
  codeNameLabel,
  getEntityId,
  mapToOptions,
  refId
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import productionService from '../api/service';
import { useBomsOptionsQuery } from '../api/queries';
import {
  useCreateWorkOrderMutation,
  useUpdateWorkOrderMutation
} from '../api/mutations';
import {
  WORK_ORDER_DEFAULTS,
  getWorkOrderFormSections,
  workOrderSchema
} from '../constants/work-order-form-config';

function valuesFromWorkOrder(row) {
  if (!row) return WORK_ORDER_DEFAULTS;
  return {
    itemId: refId(row.itemId) || refId(row.item),
    bomId: refId(row.bomId) || refId(row.bom),
    locationId: refId(row.locationId) || refId(row.location),
    quantity: String(row.quantity ?? ''),
    dueDate: (row.dueDate ?? '').toString().slice(0, 10),
    notes: row.notes ?? ''
  };
}

export function WorkOrderFormSheet({ workOrder, open, onOpenChange }) {
  const isEdit = Boolean(workOrder);
  const catalog = productionService.getCatalog();
  const { data: boms = [] } = useBomsOptionsQuery({ enabled: open });
  const itemOptions = useMemo(
    () => mapToOptions(catalog.items, codeNameLabel),
    [catalog.items]
  );
  const locationOptions = useMemo(
    () => mapToOptions(catalog.locations, codeNameLabel),
    [catalog.locations]
  );
  const bomOptions = useMemo(
    () => mapToOptions(boms, codeNameLabel),
    [boms]
  );
  const sections = useMemo(
    () =>
      getWorkOrderFormSections({ itemOptions, bomOptions, locationOptions }),
    [itemOptions, bomOptions, locationOptions]
  );
  const defaultValues = useMemo(
    () => valuesFromWorkOrder(workOrder),
    [workOrder]
  );

  const { mutate: createRow, isPending: isCreating } =
    useCreateWorkOrderMutation({
      onSuccess: () => {
        toast.success('Work order created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create work order'));
      }
    });
  const { mutate: updateRow, isPending: isUpdating } =
    useUpdateWorkOrderMutation({
      onSuccess: () => {
        toast.success('Work order updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update work order'));
      }
    });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit work order' : 'New work order'}
      description='Draft orders can be released, started, then completed from the row menu.'
      schema={workOrderSchema}
      defaultValues={defaultValues}
      sections={sections}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New work order',
        title: isEdit
          ? 'Update this job, then save.'
          : 'Pick the finished item and its BoM, then set how many to make.',
        description: 'Materials are planned from the BoM when you release the order.'
      }}
      onSubmit={(values) => {
        const payload = compactPayload(values);
        if (isEdit) {
          updateRow({ id: getEntityId(workOrder), payload });
          return;
        }
        createRow(payload);
      }}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='work-order-form'
      createLabel='Create work order'
      resetKey={getEntityId(workOrder) || 'new'}
    />
  );
}
