'use client';

import { useState } from 'react';
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

export function EntityCellAction({
  onEdit,
  onDelete,
  deletePending = false,
  extraItems = []
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const hasDelete = typeof onDelete === 'function';
  const hasMenu = onEdit || hasDelete || extraItems.length > 0;

  if (!hasMenu) return null;

  return (
    <>
      {hasDelete ? (
        <AlertModal
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={() => onDelete(() => setDeleteOpen(false))}
          loading={deletePending}
        />
      ) : null}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          render={<Button variant='ghost' size='icon' className='text-muted-foreground size-8' />}
        >
          <span className='sr-only'>Open menu</span>
          <Icons.ellipsis className='size-4' />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuGroup>
          {extraItems.map((item) => (
            <DropdownMenuItem key={item.label} onClick={item.onClick}>
              {item.icon ? <item.icon className='mr-2 h-4 w-4' /> : null}
              {item.label}
            </DropdownMenuItem>
          ))}
          {onEdit ? (
            <DropdownMenuItem onClick={onEdit}>
              <Icons.edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
          ) : null}
          {hasDelete ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                <Icons.trash className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
