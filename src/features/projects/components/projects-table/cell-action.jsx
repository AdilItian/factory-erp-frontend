'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useDeleteProjectMutation } from '../../api/mutations';
import {
  getProjectId,
  getProjectName
} from '../../utils/normalize-project';
import { ProjectFormSheet } from '../project-form-sheet';
import { ProjectManagersSheet } from '../project-managers-sheet';

export function CellAction({ data }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [managersOpen, setManagersOpen] = useState(false);

  const projectId = getProjectId(data);
  const projectName = getProjectName(data);

  const { mutate: deleteProject, isPending } = useDeleteProjectMutation({
    onSuccess: () => {
      toast.success(`Deleted “${projectName}”`);
      setDeleteOpen(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete project'));
    }
  });

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => deleteProject(projectId)}
        loading={isPending}
      />
      {editOpen ? (
        <ProjectFormSheet
          project={data}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
      {managersOpen ? (
        <ProjectManagersSheet
          project={data}
          open={managersOpen}
          onOpenChange={setManagersOpen}
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
          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/projects/${projectId}/tasks`)
            }
          >
            <Icons.kanban className='mr-2 h-4 w-4' />
            View tasks
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Icons.edit className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setManagersOpen(true)}>
            <Icons.userPen className='mr-2 h-4 w-4' />
            Manage managers
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
