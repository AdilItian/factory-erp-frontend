'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import { CrudFormSheet } from '@/components/erp/crud-form-sheet';
import { compactPayload } from '@/lib/compact-payload';
import {
  codeNameLabel,
  getEntityId,
  getEntityName,
  isEntityActive,
  mapToOptions,
  refId
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import productionService from '../api/service';
import {
  useCreateWorkCenterMutation,
  useUpdateWorkCenterMutation
} from '../api/mutations';
import {
  WORK_CENTER_DEFAULTS,
  getWorkCenterFormSections,
  workCenterSchema
} from '../constants/work-center-form-config';

function valuesFromWorkCenter(row) {
  if (!row) return WORK_CENTER_DEFAULTS;
  return {
    code: row.code ?? '',
    name: getEntityName(row, ''),
    type: row.type ?? 'SEWING',
    locationId: refId(row.locationId) || refId(row.location),
    capacityPerDay: String(row.capacityPerDay ?? ''),
    isActive: isEntityActive(row)
  };
}

export function WorkCenterFormSheet({ workCenter, open, onOpenChange }) {
  const isEdit = Boolean(workCenter);
  const catalog = productionService.getCatalog();
  const locationOptions = useMemo(
    () => mapToOptions(catalog.locations, codeNameLabel),
    [catalog.locations]
  );
  const sections = useMemo(
    () => getWorkCenterFormSections(locationOptions),
    [locationOptions]
  );
  const defaultValues = useMemo(
    () => valuesFromWorkCenter(workCenter),
    [workCenter]
  );

  const { mutate: createRow, isPending: isCreating } =
    useCreateWorkCenterMutation({
      onSuccess: () => {
        toast.success('Work center created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create work center'));
      }
    });
  const { mutate: updateRow, isPending: isUpdating } =
    useUpdateWorkCenterMutation({
      onSuccess: () => {
        toast.success('Work center updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update work center'));
      }
    });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit work center' : 'New work center'}
      description='Stations used on BoM lines and the shop floor.'
      schema={workCenterSchema}
      defaultValues={defaultValues}
      sections={sections}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New work center',
        title: isEdit
          ? 'Update this station, then save.'
          : 'Start with a short code and the work this station does.',
        description: 'Capacity is a planning hint, not a hard limit yet.'
      }}
      onSubmit={(values) => {
        const payload = compactPayload(values);
        if (isEdit) {
          updateRow({ id: getEntityId(workCenter), payload });
          return;
        }
        createRow(payload);
      }}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='work-center-form'
      createLabel='Create work center'
      resetKey={getEntityId(workCenter) || 'new'}
    />
  );
}
