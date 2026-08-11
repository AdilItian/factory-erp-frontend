'use client';

import { useEffect } from 'react';
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
import { useCreateRoleMutation } from '../api/mutations';
import {
  CREATE_ROLE_FIELDS,
  createRoleSchema
} from '../constants/role-form-config';

const DEFAULT_VALUES = {
  name: '',
  description: ''
};

export function RoleFormSheet({ open, onOpenChange }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createRoleSchema),
    defaultValues: DEFAULT_VALUES
  });

  const { mutate: createRole, isPending } = useCreateRoleMutation({
    onSuccess: () => {
      toast.success('Role created successfully');
      reset(DEFAULT_VALUES);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to create role'));
    }
  });

  useEffect(() => {
    if (!open) {
      reset(DEFAULT_VALUES);
    }
  }, [open, reset]);

  function onSubmit(values) {
    createRole({
      name: values.name.trim(),
      ...(values.description?.trim()
        ? { description: values.description.trim() }
        : {})
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>New role</SheetTitle>
          <SheetDescription>
            Create a role that can be assigned to users. Use a snake_case name
            like <span className='text-foreground font-medium'>project_manager</span>.
          </SheetDescription>
        </SheetHeader>

        <form
          id='role-form-sheet'
          className='flex-1 space-y-4 overflow-auto py-2'
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormBuilder
            control={control}
            errors={errors}
            fields={CREATE_ROLE_FIELDS}
          />
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
            form='role-form-sheet'
            isLoading={isPending}
            loadingText='Creating...'
          >
            <Icons.add className='mr-2 h-4 w-4' />
            Create role
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
