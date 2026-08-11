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
import { useDeleteUserMutation } from '../../../api/management-mutations';
import { getUserDisplayName, getUserId } from '../../../utils/normalize-user';
import { UserEditSheet } from '../user-edit-sheet';
import { UserRolesSheet } from '../user-roles-sheet';

export function CellAction({ data }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);

  const userId = getUserId(data);
  const displayName = getUserDisplayName(data);

  const { mutate: deleteUser, isPending } = useDeleteUserMutation({
    onSuccess: () => {
      toast.success(`Deleted “${displayName}”`);
      setDeleteOpen(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete user'));
    }
  });

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => deleteUser(userId)}
        loading={isPending}
      />
      {editOpen ? (
        <UserEditSheet user={data} open={editOpen} onOpenChange={setEditOpen} />
      ) : null}
      {rolesOpen ? (
        <UserRolesSheet user={data} open={rolesOpen} onOpenChange={setRolesOpen} />
      ) : null}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger render={<Button variant='ghost' className='h-8 w-8 p-0' />}>
          <span className='sr-only'>Open menu</span>
          <Icons.ellipsis className='h-4 w-4' />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Icons.edit className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRolesOpen(true)}>
            <Icons.shield className='mr-2 h-4 w-4' />
            Manage roles
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
