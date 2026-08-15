'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function ListToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  total = 0,
  page = 1,
  pageCount = 1,
  onPageChange,
  className
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2',
        className
      )}
    >
      <div className='relative min-w-[12rem] flex-1 sm:max-w-sm'>
        <Icons.search className='text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2' />
        <Input
          value={search ?? ''}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={searchPlaceholder}
          className='h-9 rounded-lg pl-8 text-sm shadow-none'
        />
      </div>

      <div className='text-muted-foreground flex items-center gap-2 text-xs'>
        <span className='tabular-nums'>
          <span className='text-foreground font-medium'>{total}</span> total
        </span>
        {pageCount > 1 ? (
          <>
            <span className='bg-border h-3 w-px' />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-7'
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              <Icons.chevronLeft className='size-3.5' />
            </Button>
            <span className='tabular-nums'>
              {page}/{pageCount}
            </span>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-7'
              disabled={page >= pageCount}
              onClick={() => onPageChange?.(page + 1)}
            >
              <Icons.chevronRight className='size-3.5' />
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
