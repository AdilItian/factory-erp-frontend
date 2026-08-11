'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { UserInviteSheet } from './user-invite-sheet';

export function UserInviteSheetTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className='mr-2 h-4 w-4' />
        Invite user
      </Button>
      {open ? <UserInviteSheet open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
