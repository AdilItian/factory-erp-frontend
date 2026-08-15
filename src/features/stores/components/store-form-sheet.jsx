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
import { useLocationsOptionsQuery } from '@/features/locations/api/queries';
import {
  useCreateStoreMutation,
  useUpdateStoreMutation
} from '../api/mutations';
import {
  STORE_DEFAULTS,
  getStoreFormSections,
  storeSchema
} from '../constants/store-form-config';

function valuesFromStore(store) {
  if (!store) return STORE_DEFAULTS;
  return {
    locationId: refId(store.locationId) || refId(store.location) || refId(store.location_id),
    code: store.code ?? '',
    name: getEntityName(store, ''),
    type: store.type ?? 'RAW',
    isDefault: Boolean(store.isDefault ?? store.is_default),
    allowNegativeStock: Boolean(
      store.allowNegativeStock ?? store.allow_negative_stock
    ),
    isActive: isEntityActive(store)
  };
}

export function StoreFormSheet({ store, open, onOpenChange }) {
  const isEdit = Boolean(store);
  const { data: locations = [] } = useLocationsOptionsQuery({
    enabled: open
  });
  const locationOptions = useMemo(
    () => mapToOptions(locations, codeNameLabel),
    [locations]
  );
  const sections = useMemo(
    () => getStoreFormSections(locationOptions),
    [locationOptions]
  );
  const defaultValues = useMemo(() => valuesFromStore(store), [store]);

  const { mutate: createStore, isPending: isCreating } = useCreateStoreMutation({
    onSuccess: () => {
      toast.success('Store created');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to create store'));
    }
  });

  const { mutate: updateStore, isPending: isUpdating } = useUpdateStoreMutation({
    onSuccess: () => {
      toast.success('Store updated');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update store'));
    }
  });

  function onSubmit(values) {
    const payload = compactPayload(values);
    if (isEdit) {
      const { locationId: _locationId, ...rest } = payload;
      updateStore({ id: getEntityId(store), payload: rest });
      return;
    }
    createStore(payload);
  }

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit store' : 'New store'}
      description='Store type must be valid for the location, e.g. WIP only at a factory.'
      schema={storeSchema}
      defaultValues={defaultValues}
      sections={sections}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New store',
        title: isEdit
          ? 'Update this store, then save.'
          : 'Start with location and type, then name the room.',
        description:
          'Store type must be valid for the location, e.g. WIP only at a factory.'
      }}
      onSubmit={onSubmit}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='store-form-sheet'
      createLabel='Create store'
      resetKey={getEntityId(store) || 'new'}
    />
  );
}
