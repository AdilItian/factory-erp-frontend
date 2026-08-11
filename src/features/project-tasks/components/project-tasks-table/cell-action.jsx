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
import { useDeleteTaskMutation } from '../../api/mutations';
import { getTaskId, getTaskTitle } from '../../utils/normalize-task';
import { TaskFormSheet } from '../task-form-sheet';

export function CellAction({ data, projectId }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const taskId = getTaskId(data);
  const taskTitle = getTaskTitle(data);

  const { mutate: deleteTask, isPending } = useDeleteTaskMutation({
    onSuccess: () => {
      toast.success(`Deleted “${taskTitle}”`);
      setDeleteOpen(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete task'));
    }
  });

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => deleteTask(taskId)}
        loading={isPending}
      />
      {editOpen ? (
        <TaskFormSheet
          projectId={projectId}
          task={data}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
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
