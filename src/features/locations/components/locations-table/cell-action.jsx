'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { EntityCellAction } from '@/components/erp/entity-cell-action';
import { Icons } from '@/components/icons';
import { getEntityId, getEntityName } from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useDeleteLocationMutation } from '../../api/mutations';
import { LocationFormSheet } from '../location-form-sheet';
import { LocationUsersSheet } from '../location-users-sheet';

export function CellAction({ data }) {
  const [editOpen, setEditOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);

  const { mutate: deleteLocation, isPending } = useDeleteLocationMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete location'));
    }
  });

  return (
    <>
      {editOpen ? (
        <LocationFormSheet
          location={data}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
      {usersOpen ? (
        <LocationUsersSheet
          location={data}
          open={usersOpen}
          onOpenChange={setUsersOpen}
        />
      ) : null}
      <EntityCellAction
        onEdit={() => setEditOpen(true)}
        extraItems={[
          {
            label: 'Assign users',
            icon: Icons.userPen,
            onClick: () => setUsersOpen(true)
          }
        ]}
        deletePending={isPending}
        onDelete={(close) =>
          deleteLocation(getEntityId(data), {
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
