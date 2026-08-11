'use client';

import { useEffect, useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TIP_STORAGE_KEY = 'kanban-board-pan-tip-dismissed-v7';

export function BoardPanTip({ className } = {}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(TIP_STORAGE_KEY) !== '1');
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(TIP_STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  }

  if (!visible) return null;

  return (
    <div
      className={cn(
        'bg-muted/40 text-muted-foreground mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs',
        className
      )}
      role='note'
    >
      <Icons.handMove className='size-3.5 shrink-0' />
      <p className='min-w-0 flex-1'>
        Drag cards to change status. Hold{' '}
        <span className='text-foreground font-medium'>Space</span> and drag to pan the
        board.
      </p>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='size-6 shrink-0'
        onClick={dismiss}
        aria-label='Dismiss tip'
      >
        <Icons.close className='size-3.5' />
      </Button>
    </div>
  );
}
