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
import { useUsersOptionsQuery } from '@/features/users/api/options-queries';
import { mapUsersToOptions } from '@/features/users/api/live-service';
import {
  useAssignRoleMutation,
  useRevokeRoleMutation
} from '../api/mutations';
import {
  assignRoleSchema,
  getAssignRoleFields
} from '../constants/role-form-config';
import { getRoleId, getRoleName } from '../utils/normalize-role';

const DEFAULT_VALUES = { userId: '' };

export function RoleAssignSheet({ role, mode = 'assign', open, onOpenChange }) {
  const isAssign = mode === 'assign';
  const roleId = getRoleId(role);
  const roleName = getRoleName(role);

  const { data: users = [], isPending: isUsersLoading } = useUsersOptionsQuery({
    enabled: open
  });

  const userOptions = useMemo(() => mapUsersToOptions(users), [users]);
  const fields = useMemo(() => getAssignRoleFields(userOptions), [userOptions]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: DEFAULT_VALUES
  });

  const { mutate: assignRole, isPending: isAssigning } = useAssignRoleMutation({
    onSuccess: () => {
      toast.success(`Assigned “${roleName}” successfully`);
      reset(DEFAULT_VALUES);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to assign role'));
    }
  });

  const { mutate: revokeRole, isPending: isRevoking } = useRevokeRoleMutation({
    onSuccess: () => {
      toast.success(`Revoked “${roleName}” successfully`);
      reset(DEFAULT_VALUES);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to revoke role'));
    }
  });

  const isPending = isAssigning || isRevoking;

  useEffect(() => {
    if (!open) {
      reset(DEFAULT_VALUES);
    }
  }, [open, reset]);

  function onSubmit(values) {
    const payload = { userId: values.userId, roleId };

    if (isAssign) {
      assignRole(payload);
      return;
    }

    revokeRole(payload);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>{isAssign ? 'Assign role' : 'Revoke role'}</SheetTitle>
          <SheetDescription>
            {isAssign
              ? `Assign “${roleName}” to a user.`
              : `Revoke “${roleName}” from a user.`}
          </SheetDescription>
        </SheetHeader>

        <form
          id='role-assign-sheet'
          className='flex-1 space-y-4 overflow-auto py-2'
          onSubmit={handleSubmit(onSubmit)}
        >
          {isUsersLoading ? (
            <p className='text-muted-foreground text-sm'>Loading users...</p>
          ) : userOptions.length === 0 ? (
            <p className='text-muted-foreground text-sm'>
              No users available. Invite users first, then assign roles.
            </p>
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
            form='role-assign-sheet'
            isLoading={isPending}
            loadingText={isAssign ? 'Assigning...' : 'Revoking...'}
            disabled={userOptions.length === 0}
            variant={isAssign ? 'default' : 'destructive'}
          >
            {isAssign ? (
              <>
                <Icons.userPen className='mr-2 h-4 w-4' />
                Assign
              </>
            ) : (
              <>
                <Icons.employee className='mr-2 h-4 w-4' />
                Revoke
              </>
            )}
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
