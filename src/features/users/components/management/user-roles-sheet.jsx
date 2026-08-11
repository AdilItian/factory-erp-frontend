'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import LoadingButton from '@/components/ui/loading-button';
import { Icons } from '@/components/icons';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useRolesQuery } from '@/features/roles/api/queries';
import {
  useAssignRoleMutation,
  useRevokeRoleMutation
} from '@/features/roles/api/mutations';
import {
  getRoleDescription,
  getRoleId,
  getRoleName
} from '@/features/roles/utils/normalize-role';
import {
  getUserDisplayName,
  getUserId,
  getUserRoleIdSet
} from '../../utils/normalize-user';

export function UserRolesSheet({ user, open, onOpenChange }) {
  const userId = getUserId(user);
  const displayName = getUserDisplayName(user);
  const [pendingRoleId, setPendingRoleId] = useState(null);

  const { data: roles = [], isPending: isRolesLoading } = useRolesQuery({
    enabled: open
  });

  const assignedRoleIds = useMemo(
    () => getUserRoleIdSet(user, roles),
    [user, roles]
  );

  const { mutate: assignRole, isPending: isAssigning } = useAssignRoleMutation({
    onSuccess: (_data, variables) => {
      const role = roles.find((item) => getRoleId(item) === variables.roleId);
      toast.success(`Assigned “${getRoleName(role) || 'role'}”`);
      setPendingRoleId(null);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to assign role'));
      setPendingRoleId(null);
    }
  });

  const { mutate: revokeRole, isPending: isRevoking } = useRevokeRoleMutation({
    onSuccess: (_data, variables) => {
      const role = roles.find((item) => getRoleId(item) === variables.roleId);
      toast.success(`Revoked “${getRoleName(role) || 'role'}”`);
      setPendingRoleId(null);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to revoke role'));
      setPendingRoleId(null);
    }
  });

  const isMutating = isAssigning || isRevoking;

  function handleToggle(roleId, currentlyAssigned) {
    if (!userId || !roleId || isMutating) return;

    setPendingRoleId(roleId);
    const payload = { userId, roleId };

    if (currentlyAssigned) {
      revokeRole(payload);
      return;
    }

    assignRole(payload);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>Manage roles</SheetTitle>
          <SheetDescription>
            Update roles for <span className='text-foreground font-medium'>{displayName}</span>.
            Changes apply immediately.
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 space-y-3 overflow-auto py-2'>
          {isRolesLoading ? (
            <p className='text-muted-foreground text-sm'>Loading roles...</p>
          ) : roles.length === 0 ? (
            <p className='text-muted-foreground text-sm'>
              No roles found. Create roles first under Roles Management.
            </p>
          ) : (
            roles.map((role) => {
              const roleId = getRoleId(role);
              const roleName = getRoleName(role);
              const description = getRoleDescription(role);
              const checked = assignedRoleIds.has(roleId);
              const isBusy = pendingRoleId === roleId && isMutating;

              return (
                <div
                  key={roleId}
                  className='bg-card flex items-start gap-3 rounded-xl border p-3'
                >
                  <Checkbox
                    id={`user-role-${roleId}`}
                    checked={checked}
                    disabled={isMutating}
                    onCheckedChange={() => handleToggle(roleId, checked)}
                    className='mt-0.5'
                  />
                  <div className='min-w-0 flex-1 space-y-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <Label
                        htmlFor={`user-role-${roleId}`}
                        className='cursor-pointer font-medium'
                      >
                        {roleName}
                      </Label>
                      {checked ? <Badge variant='secondary'>Assigned</Badge> : null}
                      {isBusy ? (
                        <Icons.spinner className='text-muted-foreground h-3.5 w-3.5 animate-spin' />
                      ) : null}
                    </div>
                    {description ? (
                      <p className='text-muted-foreground text-xs'>{description}</p>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <SheetFooter>
          <LoadingButton
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            isLoading={isMutating}
            loadingText='Updating...'
          >
            Done
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
