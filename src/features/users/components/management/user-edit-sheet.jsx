'use client';

import { useEffect } from 'react';
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
import { useUpdateUserMutation } from '../../api/management-mutations';
import {
  UPDATE_USER_FIELDS,
  updateUserSchema
} from '../../constants/user-form-config';
import {
  getUserEmail,
  getUserId,
  isUserActive
} from '../../utils/normalize-user';

export function UserEditSheet({ user, open, onOpenChange }) {
  const userId = getUserId(user);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: getUserEmail(user),
      isActive: isUserActive(user)
    }
  });

  const { mutate: updateUser, isPending } = useUpdateUserMutation({
    onSuccess: () => {
      toast.success('User updated');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update user'));
    }
  });

  useEffect(() => {
    if (open && user) {
      reset({
        email: getUserEmail(user),
        isActive: isUserActive(user)
      });
    }
  }, [open, user, reset]);

  function onSubmit(values) {
    updateUser({
      userId,
      payload: {
        email: values.email.trim(),
        isActive: Boolean(values.isActive)
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>Edit user</SheetTitle>
          <SheetDescription>Update email or active status for this user.</SheetDescription>
        </SheetHeader>

        <form
          id='user-edit-sheet'
          className='flex-1 space-y-4 overflow-auto py-2'
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormBuilder control={control} errors={errors} fields={UPDATE_USER_FIELDS} />
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
            form='user-edit-sheet'
            isLoading={isPending}
            loadingText='Saving...'
          >
            <Icons.check className='mr-2 h-4 w-4' />
            Save changes
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
