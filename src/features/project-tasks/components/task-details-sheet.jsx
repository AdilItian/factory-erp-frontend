'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { useUsersOptionsQuery } from '@/features/users/api/management-queries';
import { mapUsersToOptions } from '@/features/users/api/live-service';
import { useUpdateTaskMutation } from '../api/mutations';
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
import { TaskDetailsView } from './task-details-view';

export function TaskDetailsSheet({ task, open, onOpenChange }) {
  const [isEditing, setIsEditing] = useState(false);

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

  const { mutate: updateTask, isPending } = useUpdateTaskMutation({
    onSuccess: (_data, variables) => {
      const onlyStatus =
        variables?.payload &&
        Object.keys(variables.payload).length === 1 &&
        'status' in variables.payload;

      toast.success(onlyStatus ? 'Status updated' : 'Task updated');
      if (!onlyStatus) setIsEditing(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update task'));
    }
  });

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      reset(TASK_FORM_DEFAULTS);
      return;
    }

    if (!task) return;

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
  }, [open, task, reset]);

  function onSubmit(values) {
    updateTask({
      taskId: getTaskId(task),
      payload: buildTaskPayload(values)
    });
  }

  function handleStatusChange(status) {
    updateTask({
      taskId: getTaskId(task),
      payload: { status }
    });
  }

  const issueKey = getTaskIssueKey(task);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col gap-0 border-l p-0 sm:max-w-xl'>
        <SheetHeader className='border-b px-6 py-5 text-left'>
          <div className='flex items-start justify-between gap-3 pr-8'>
            <div className='space-y-1'>
              <SheetTitle className='text-base font-semibold tracking-tight'>
                {isEditing ? 'Edit task' : 'Task details'}
              </SheetTitle>
              <SheetDescription>
                {issueKey
                  ? `${issueKey} · ${getTaskTitle(task)}`
                  : getTaskTitle(task)}
              </SheetDescription>
            </div>
            {!isEditing ? (
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='shrink-0'
                onClick={() => setIsEditing(true)}
              >
                <Icons.edit className='mr-1.5 size-3.5' />
                Edit
              </Button>
            ) : null}
          </div>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto px-6 py-5'>
          {isEditing ? (
            <TaskDetailsEditForm
              task={task}
              control={control}
              errors={errors}
              assigneeOptions={assigneeOptions}
              isUsersLoading={isUsersLoading}
              onSubmit={handleSubmit(onSubmit)}
            />
          ) : (
            <TaskDetailsView
              task={task}
              users={users}
              canUpdateStatus
              isUpdatingStatus={isPending}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>

        <SheetFooter className='border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-between'>
          {isEditing ? (
            <>
              <Button
                type='button'
                variant='ghost'
                onClick={() => setIsEditing(false)}
                disabled={isPending}
              >
                Cancel edit
              </Button>
              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                >
                  Close
                </Button>
                <LoadingButton
                  type='submit'
                  form='task-details-edit-form'
                  isLoading={isPending}
                  loadingText='Saving...'
                  disabled={isUsersLoading}
                >
                  <Icons.check className='mr-2 size-4' />
                  Save changes
                </LoadingButton>
              </div>
            </>
          ) : (
            <Button
              type='button'
              variant='outline'
              className='ml-auto'
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
