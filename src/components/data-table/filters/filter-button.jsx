'use client';

import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';

export function FilterButton({ activeCount = 0, onClick }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='border-input bg-background text-muted-foreground hover:text-foreground flex h-10 w-md items-center gap-2 rounded-md border px-3 text-sm shadow-xs transition-colors'
    >
      <Icons.search className='h-3.5 w-3.5 shrink-0' />
      <span className='flex-1 text-left'>Filter projects...</span>
      {activeCount > 0 && (
        <Badge variant='secondary' className='rounded-sm px-1.5 py-0 text-xs font-normal'>
          {activeCount}
        </Badge>
      )}
    </button>
  );
}
