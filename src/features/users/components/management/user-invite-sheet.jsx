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
import { useRolesQuery, mapRolesToOptions } from '@/features/roles/api/queries';
import { useInviteUserMutation } from '../../api/management-mutations';
import {
  getInviteUserFields,
  inviteUserSchema
} from '../../constants/user-form-config';

const DEFAULT_VALUES = {
  email: '',
  roleId: '__none__'
};

export function UserInviteSheet({ open, onOpenChange }) {
  const { data: roles = [], isPending: isRolesLoading } = useRolesQuery({
    enabled: open
  });

  const roleOptions = useMemo(() => mapRolesToOptions(roles), [roles]);
  const fields = useMemo(() => getInviteUserFields(roleOptions), [roleOptions]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: DEFAULT_VALUES
  });

  const { mutate: inviteUser, isPending } = useInviteUserMutation({
    onSuccess: () => {
      toast.success('Invitation sent');
      reset(DEFAULT_VALUES);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to invite user'));
    }
  });

  useEffect(() => {
    if (!open) {
      reset(DEFAULT_VALUES);
    }
  }, [open, reset]);

  function onSubmit(values) {
    const roleId = values.roleId && values.roleId !== '__none__' ? values.roleId : null;

    inviteUser({
      email: values.email.trim(),
      ...(roleId ? { roleIds: [roleId] } : {})
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>Invite user</SheetTitle>
          <SheetDescription>
            Send an invite by email. The default <span className='text-foreground font-medium'>user</span> role
            is always included.
          </SheetDescription>
        </SheetHeader>

        <form
          id='user-invite-sheet'
          className='flex-1 space-y-4 overflow-auto py-2'
          onSubmit={handleSubmit(onSubmit)}
        >
          {isRolesLoading ? (
            <p className='text-muted-foreground text-sm'>Loading roles...</p>
          ) : (
            <FormBuilder control={control} errors={errors} fields={fields} />
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
            form='user-invite-sheet'
            isLoading={isPending}
            loadingText='Sending...'
            disabled={isRolesLoading}
          >
            <Icons.add className='mr-2 h-4 w-4' />
            Send invite
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
