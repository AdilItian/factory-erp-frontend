'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AlertModal } from '@/components/modal/alert-modal';
import { Icons } from '@/components/icons';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useDeleteRoleMutation } from '../../api/mutations';
import { getRoleId, getRoleName } from '../../utils/normalize-role';
import { RoleAssignSheet } from '../role-assign-sheet';

export function CellAction({ data }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);

  const roleId = getRoleId(data);
  const roleName = getRoleName(data);

  const { mutate: deleteRole, isPending } = useDeleteRoleMutation({
    onSuccess: () => {
      toast.success(`Deleted “${roleName}”`);
      setDeleteOpen(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete role'));
    }
  });

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => deleteRole(roleId)}
        loading={isPending}
      />
      <RoleAssignSheet
        role={data}
        mode='assign'
        open={assignOpen}
        onOpenChange={setAssignOpen}
      />
      <RoleAssignSheet
        role={data}
        mode='revoke'
        open={revokeOpen}
        onOpenChange={setRevokeOpen}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger render={<Button variant='ghost' className='h-8 w-8 p-0' />}>
          <span className='sr-only'>Open menu</span>
          <Icons.ellipsis className='h-4 w-4' />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setAssignOpen(true)}>
            <Icons.userPen className='mr-2 h-4 w-4' />
            Assign to user
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRevokeOpen(true)}>
            <Icons.employee className='mr-2 h-4 w-4' />
            Revoke from user
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            <Icons.trash className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
