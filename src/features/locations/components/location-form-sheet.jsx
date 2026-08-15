'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import { CrudFormSheet } from '@/components/erp/crud-form-sheet';
import { compactPayload } from '@/lib/compact-payload';
import { getEntityId, getEntityName, isEntityActive } from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import {
  useCreateLocationMutation,
  useUpdateLocationMutation
} from '../api/mutations';
import {
  LOCATION_DEFAULTS,
  getLocationFormSections,
  locationSchema
} from '../constants/location-form-config';

function valuesFromLocation(location) {
  if (!location) return LOCATION_DEFAULTS;
  return {
    code: location.code ?? '',
    name: getEntityName(location, ''),
    type: location.type ?? 'FACTORY',
    addressLine: location.addressLine ?? location.address ?? '',
    city: location.city ?? '',
    country: location.country ?? '',
    phone: location.phone ?? '',
    gatePassRequiredOnDispatch: Boolean(
      location.gatePassRequiredOnDispatch ?? location.type === 'FACTORY'
    ),
    isActive: isEntityActive(location)
  };
}

export function LocationFormSheet({ location, open, onOpenChange }) {
  const isEdit = Boolean(location);
  const defaultValues = useMemo(
    () => valuesFromLocation(location),
    [location]
  );

  const { mutate: createLocation, isPending: isCreating } =
    useCreateLocationMutation({
      onSuccess: () => {
        toast.success('Location created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create location'));
      }
    });

  const { mutate: updateLocation, isPending: isUpdating } =
    useUpdateLocationMutation({
      onSuccess: () => {
        toast.success('Location updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update location'));
      }
    });

  function onSubmit(values) {
    const payload = compactPayload(values);
    if (isEdit) {
      updateLocation({ id: getEntityId(location), payload });
      return;
    }
    createLocation(payload);
  }

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit location' : 'New location'}
      description={
        isEdit
          ? 'Update this factory, outlet, warehouse, or office.'
          : 'Factories default to requiring a gate pass on dispatch.'
      }
      schema={locationSchema}
      defaultValues={defaultValues}
      sections={getLocationFormSections()}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New location',
        title: isEdit
          ? 'Update this site, then save.'
          : 'Start with the site type, then fill the address you know.',
        description: isEdit
          ? 'Soft changes only — save when the details feel right.'
          : 'Factories default to requiring a gate pass on dispatch.'
      }}
      onSubmit={onSubmit}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='location-form-sheet'
      createLabel='Create location'
      resetKey={getEntityId(location) || 'new'}
    />
  );
}
