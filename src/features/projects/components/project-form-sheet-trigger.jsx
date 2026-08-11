'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ProjectFormSheet } from './project-form-sheet';

export function ProjectFormSheetTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className='mr-2 h-4 w-4' />
        Add project
      </Button>
      {open ? <ProjectFormSheet open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
