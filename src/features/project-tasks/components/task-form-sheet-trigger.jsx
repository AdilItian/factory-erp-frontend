'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { TaskFormSheet } from './task-form-sheet';

export function TaskFormSheetTrigger({ projectId }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type='button' onClick={() => setOpen(true)}>
        <Icons.add className='mr-2 h-4 w-4' />
        Add task
      </Button>
      {open ? (
        <TaskFormSheet
          projectId={projectId}
          open={open}
          onOpenChange={setOpen}
        />
      ) : null}
    </>
  );
}
