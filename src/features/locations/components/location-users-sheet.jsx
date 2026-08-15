'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { CrudFormSheet } from '@/components/erp/crud-form-sheet';
import { getEntityId, getEntityName } from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import {
  mapUsersToOptions,
  useUsersOptionsQuery
} from '@/features/users/api/management-queries';
import { useAssignLocationUsersMutation } from '../api/mutations';
import { getLocationUserFormSections } from '../constants/location-form-config';

const schema = z.object({
  userId: z.string().min(1, 'Select a user'),
  isPrimary: z.boolean()
});

export function LocationUsersSheet({ location, open, onOpenChange }) {
  const { data: users = [] } = useUsersOptionsQuery({
    enabled: open,
    retry: false
  });
  const userOptions = useMemo(() => mapUsersToOptions(users), [users]);
  const sections = useMemo(
    () => getLocationUserFormSections(userOptions),
    [userOptions]
  );

  const { mutate: assignUsers, isPending } = useAssignLocationUsersMutation({
    onSuccess: () => {
      toast.success('User assigned to location');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to assign user'));
    }
  });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title='Assign users'
      description={`People assigned here can act on ${getEntityName(location)}.`}
      schema={schema}
      defaultValues={{ userId: '', isPrimary: false }}
      sections={sections}
      intro={{
        eyebrow: 'Assignment',
        title: 'Pick who belongs on this site.',
        description: 'Primary means this is the location they work from first.'
      }}
      onSubmit={(values) => {
        assignUsers({
          id: getEntityId(location),
          payload: {
            userIds: [values.userId],
            isPrimary: values.isPrimary
          }
        });
      }}
      isPending={isPending}
      formId='location-users-form'
      createLabel='Assign'
      resetAfterSubmit
      resetKey={getEntityId(location) || 'assign'}
    />
  );
}
