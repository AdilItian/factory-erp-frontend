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
import { Icons } from '@/components/icons';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { getAuthUser } from '@/features/auth/utils/get-auth-user';
import { useUsersOptionsQuery } from '@/features/users/api/management-queries';
import { mapUsersToOptions } from '@/features/users/api/live-service';
import {
  useCreateProjectTaskMutation,
  useUpdateTaskMutation
} from '../api/mutations';
import {
  TASK_FORM_DEFAULTS,
  buildTaskPayload,
  mergeAssigneeOptions,
  taskFormSchema
} from '../constants/task-form-config';
import {
  getTaskAssigneeId,
  getTaskDescription,
  getTaskId,
  getTaskIssueKey,
  getTaskIssueType,
  getTaskPriority,
  getTaskStatus,
  getTaskTitle
} from '../utils/normalize-task';
import { TaskDetailsEditForm } from './task-details-edit-form';

const FORM_ID = 'task-form-sheet';

export function TaskFormSheet({ projectId, task, open, onOpenChange }) {
  const isEdit = Boolean(task);
  const authUser = getAuthUser();

  const { data: users = [], isPending: isUsersLoading } = useUsersOptionsQuery({
    enabled: open,
    retry: false
  });

  const assigneeOptions = useMemo(
    () => mergeAssigneeOptions(mapUsersToOptions(users), task),
    [users, task]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: TASK_FORM_DEFAULTS
  });

  const { mutate: createTask, isPending: isCreating } =
    useCreateProjectTaskMutation({
      onSuccess: () => {
        toast.success('Task created');
        reset(TASK_FORM_DEFAULTS);
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create task'));
      }
    });

  const { mutate: updateTask, isPending: isUpdating } = useUpdateTaskMutation({
    onSuccess: () => {
      toast.success('Task updated');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update task'));
    }
  });

  const isPending = isCreating || isUpdating;
  const issueKey = isEdit ? getTaskIssueKey(task) : '';

  useEffect(() => {
    if (!open) {
      reset(TASK_FORM_DEFAULTS);
      return;
    }

    if (isEdit && task) {
      reset({
        title: getTaskTitle(task),
        description: getTaskDescription(task),
        issueType: getTaskIssueType(task),
        status: getTaskStatus(task),
        priority: getTaskPriority(task),
        severity: task.severity ?? '__none__',
        assigneeId: getTaskAssigneeId(task) || '__none__',
        storyPoints:
          task.storyPoints != null || task.story_points != null
            ? String(task.storyPoints ?? task.story_points)
            : '',
        dueDate: (task.dueDate ?? task.due_date ?? '')
          .toString()
          .slice(0, 10)
      });
    }
  }, [open, isEdit, task, reset]);

  function onSubmit(values) {
    if (isEdit) {
      updateTask({
        taskId: getTaskId(task),
        payload: buildTaskPayload(values)
      });
      return;
    }

    if (!authUser.id) {
      toast.error(
        'Could not resolve your user id for watchers. Please sign in again.'
      );
      return;
    }

    createTask({
      projectId,
      payload: buildTaskPayload(values, {
        forCreate: true,
        creatorId: authUser.id
      })
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col gap-0 border-l p-0 sm:max-w-xl'>
        <SheetHeader className='border-b px-6 py-5 text-left'>
          <SheetTitle className='text-base font-semibold tracking-tight'>
            {isEdit ? 'Edit task' : 'New task'}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? issueKey
                ? `${issueKey} · ${getTaskTitle(task)}`
                : getTaskTitle(task)
              : 'Create a task with the same structured details as edit.'}
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto px-6 py-5'>
          <TaskDetailsEditForm
            mode={isEdit ? 'edit' : 'create'}
            task={task}
            formId={FORM_ID}
            control={control}
            errors={errors}
            assigneeOptions={assigneeOptions}
            isUsersLoading={isUsersLoading}
            onSubmit={handleSubmit(onSubmit)}
          />
        </div>

        <SheetFooter className='bg-muted/20 border-t px-6 py-4 sm:flex-row sm:justify-end'>
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
            form={FORM_ID}
            isLoading={isPending}
            loadingText={isEdit ? 'Saving...' : 'Creating...'}
            disabled={isUsersLoading}
          >
            {isEdit ? (
              <>
                <Icons.check className='mr-2 size-4' />
                Save changes
              </>
            ) : (
              <>
                <Icons.add className='mr-2 size-4' />
                Create task
              </>
            )}
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
