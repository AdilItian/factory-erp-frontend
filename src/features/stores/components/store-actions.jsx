'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { EntityCellAction } from '@/components/erp/entity-cell-action';
import { FormSheetTrigger } from '@/components/erp/form-sheet-trigger';
import { Icons } from '@/components/icons';
import {
  codeNameLabel,
  getEntityId,
  getEntityName,
  mapToOptions
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useLocationsOptionsQuery } from '@/features/locations/api/queries';
import {
  useDeleteStoreMutation,
  useProvisionStoresMutation
} from '../api/mutations';
import { StoreFormSheet } from './store-form-sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export function StoreFormSheetTrigger() {
  return (
    <FormSheetTrigger label='Add store'>
      {({ open, onOpenChange }) => (
        <StoreFormSheet open={open} onOpenChange={onOpenChange} />
      )}
    </FormSheetTrigger>
  );
}

export function ProvisionStoresButton() {
  const [locationId, setLocationId] = useState('');
  const { data: locations = [] } = useLocationsOptionsQuery();
  const options = useMemo(
    () => mapToOptions(locations, codeNameLabel),
    [locations]
  );

  const { mutate: provision, isPending } = useProvisionStoresMutation({
    onSuccess: () => {
      toast.success('Standard stores provisioned');
      setLocationId('');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to provision stores'));
    }
  });

  return (
    <div className='flex items-center gap-2'>
      <Select
        items={options}
        value={locationId || null}
        onValueChange={setLocationId}
      >
        <SelectTrigger className='h-8 w-44'>
          <SelectValue placeholder='Provision at…' />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type='button'
        variant='outline'
        disabled={!locationId || isPending}
        onClick={() => provision(locationId)}
      >
        <Icons.add className='mr-2 h-4 w-4' />
        {isPending ? 'Provisioning…' : 'Standard stores'}
      </Button>
    </div>
  );
}

export function StoreCellAction({ data }) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: deleteStore, isPending } = useDeleteStoreMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete store'));
    }
  });

  return (
    <>
      {editOpen ? (
        <StoreFormSheet
          store={data}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
      <EntityCellAction
        onEdit={() => setEditOpen(true)}
        deletePending={isPending}
        onDelete={(close) =>
          deleteStore(getEntityId(data), {
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
