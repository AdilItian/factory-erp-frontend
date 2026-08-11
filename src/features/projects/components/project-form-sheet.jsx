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
import LoadingButton from '@/components/ui/loading-button';
import FormBuilder from '@/components/ui/form-builder';
import { Icons } from '@/components/icons';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useUsersOptionsQuery } from '@/features/users/api/management-queries';
import { mapUsersToOptions } from '@/features/users/api/live-service';
import {
  useCreateProjectMutation,
  useUpdateProjectMutation
} from '../api/mutations';
import {
  UPDATE_PROJECT_FIELDS,
  createProjectSchema,
  getCreateProjectFields,
  updateProjectSchema
} from '../constants/project-form-config';
import {
  getProjectDescription,
  getProjectId,
  getProjectName,
  getProjectStatus
} from '../utils/normalize-project';

const CREATE_DEFAULTS = {
  name: '',
  description: '',
  status: 'ACTIVE',
  projectManagerId: '__none__'
};

export function ProjectFormSheet({ project, open, onOpenChange }) {
  const isEdit = Boolean(project);

  const { data: users = [], isPending: isUsersLoading } = useUsersOptionsQuery({
    enabled: open && !isEdit,
    retry: false
  });

  const managerOptions = useMemo(() => mapUsersToOptions(users), [users]);

  const createFields = useMemo(
    () => getCreateProjectFields(managerOptions),
    [managerOptions]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(isEdit ? updateProjectSchema : createProjectSchema),
    defaultValues: CREATE_DEFAULTS
  });

  const { mutate: createProject, isPending: isCreating } =
    useCreateProjectMutation({
      onSuccess: () => {
        toast.success('Project created');
        reset(CREATE_DEFAULTS);
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create project'));
      }
    });

  const { mutate: updateProject, isPending: isUpdating } =
    useUpdateProjectMutation({
      onSuccess: () => {
        toast.success('Project updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update project'));
      }
    });

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!open) {
      reset(CREATE_DEFAULTS);
      return;
    }

    if (isEdit && project) {
      reset({
        name: getProjectName(project),
        description: getProjectDescription(project),
        status: getProjectStatus(project)
      });
    }
  }, [open, isEdit, project, reset]);

  function onSubmit(values) {
    if (isEdit) {
      updateProject({
        projectId: getProjectId(project),
        payload: {
          name: values.name.trim(),
          status: values.status,
          ...(values.description?.trim()
            ? { description: values.description.trim() }
            : { description: '' })
        }
      });
      return;
    }

    const managerId =
      values.projectManagerId && values.projectManagerId !== '__none__'
        ? values.projectManagerId
        : null;

    createProject({
      name: values.name.trim(),
      status: values.status || 'ACTIVE',
      ...(values.description?.trim()
        ? { description: values.description.trim() }
        : {}),
      ...(managerId ? { projectManagerIds: [managerId] } : {})
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>{isEdit ? 'Edit project' : 'New project'}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Update project details.'
              : 'Create a project and optionally assign a manager.'}
          </SheetDescription>
        </SheetHeader>

        <form
          id='project-form-sheet'
          className='flex-1 space-y-4 overflow-auto py-2'
          onSubmit={handleSubmit(onSubmit)}
        >
          {!isEdit && isUsersLoading ? (
            <p className='text-muted-foreground text-sm'>Loading managers...</p>
          ) : (
            <FormBuilder
              control={control}
              errors={errors}
              fields={isEdit ? UPDATE_PROJECT_FIELDS : createFields}
            />
          )}
        </form>

        <SheetFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            type='submit'
            form='project-form-sheet'
            isLoading={isPending}
            loadingText={isEdit ? 'Saving...' : 'Creating...'}
          >
            {isEdit ? (
              <>
                <Icons.check className='mr-2 h-4 w-4' />
                Save changes
              </>
            ) : (
              <>
                <Icons.add className='mr-2 h-4 w-4' />
                Create project
              </>
            )}
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
