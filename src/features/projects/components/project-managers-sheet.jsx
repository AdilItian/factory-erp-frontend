'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingButton from '@/components/ui/loading-button';
import FormBuilder from '@/components/ui/form-builder';
import { Icons } from '@/components/icons';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useUsersOptionsQuery } from '@/features/users/api/management-queries';
import { mapUsersToOptions } from '@/features/users/api/live-service';
import {
  getUserDisplayName,
  getUserEmail,
  getUserId
} from '@/features/users/utils/normalize-user';
import {
  useAssignProjectManagersMutation,
  useRemoveProjectManagerMutation
} from '../api/mutations';
import {
  assignManagersSchema,
  getAssignManagerFields
} from '../constants/project-form-config';
import {
  getProjectId,
  getProjectManagers,
  getProjectName
} from '../utils/normalize-project';

const DEFAULT_VALUES = { projectManagerId: '' };

export function ProjectManagersSheet({ project, open, onOpenChange }) {
  const projectId = getProjectId(project);
  const projectName = getProjectName(project);
  const managers = getProjectManagers(project);

  const { data: users = [], isPending: isUsersLoading } = useUsersOptionsQuery({
    enabled: open
  });

  const managerOptions = useMemo(() => mapUsersToOptions(users), [users]);

  const fields = useMemo(
    () => getAssignManagerFields(managerOptions),
    [managerOptions]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(assignManagersSchema),
    defaultValues: DEFAULT_VALUES
  });

  const { mutate: assignManagers, isPending: isAssigning } =
    useAssignProjectManagersMutation({
      onSuccess: () => {
        toast.success('Manager assigned');
        reset(DEFAULT_VALUES);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to assign manager'));
      }
    });

  const { mutate: removeManager, isPending: isRemoving } =
    useRemoveProjectManagerMutation({
      onSuccess: () => {
        toast.success('Manager removed');
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to remove manager'));
      }
    });

  useEffect(() => {
    if (!open) reset(DEFAULT_VALUES);
  }, [open, reset]);

  function onSubmit(values) {
    assignManagers({
      projectId,
      projectManagerIds: [values.projectManagerId]
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>Project managers</SheetTitle>
          <SheetDescription>
            Manage managers for <span className='text-foreground font-medium'>{projectName}</span>.
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 space-y-4 overflow-auto py-2'>
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Current managers</p>
            {managers.length === 0 ? (
              <p className='text-muted-foreground text-sm'>No managers assigned.</p>
            ) : (
              managers.map((manager) => {
                const managerId = getUserId(manager);
                return (
                  <div
                    key={managerId}
                    className='bg-card flex items-center justify-between gap-2 rounded-xl border p-3'
                  >
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium'>
                        {getUserDisplayName(manager)}
                      </p>
                      <p className='text-muted-foreground truncate text-xs'>
                        {getUserEmail(manager) || managerId}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge variant='secondary'>Manager</Badge>
                      <Button
                        type='button'
                        size='sm'
                        variant='outline'
                        disabled={isRemoving}
                        onClick={() =>
                          removeManager({ projectId, userId: managerId })
                        }
                      >
                        <Icons.trash className='h-3.5 w-3.5' />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form
            id='project-managers-sheet'
            className='space-y-4 border-t pt-4'
            onSubmit={handleSubmit(onSubmit)}
          >
            <p className='text-sm font-medium'>Assign manager</p>
            {isUsersLoading ? (
              <p className='text-muted-foreground text-sm'>Loading users...</p>
            ) : (
              <FormBuilder control={control} errors={errors} fields={fields} />
            )}
          </form>
        </div>

        <SheetFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isAssigning || isRemoving}
          >
            Close
          </Button>
          <LoadingButton
            type='submit'
            form='project-managers-sheet'
            isLoading={isAssigning}
            loadingText='Assigning...'
            disabled={isUsersLoading || managerOptions.length === 0}
          >
            <Icons.userPen className='mr-2 h-4 w-4' />
            Assign
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
