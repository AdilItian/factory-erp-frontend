'use client';

import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { formatChipParts } from './chip-value-formatter';

export function FilterChip({ condition, filterConfig, onEdit, onRemove }) {
  const { fieldLabel, operatorLabel, valueLabel } = formatChipParts(condition, filterConfig);

  return (
    <Badge
      variant='secondary'
      className='flex h-7 cursor-pointer items-center gap-1 rounded-md px-2 font-normal hover:bg-secondary/80'
      onClick={onEdit}
    >
      <span className='font-medium text-foreground'>{fieldLabel}</span>
      <span className='text-muted-foreground'>·</span>
      <span className='text-muted-foreground'>{operatorLabel}</span>
      {valueLabel && (
        <>
          <span className='text-muted-foreground'>·</span>
          <span className='max-w-[120px] truncate text-foreground'>{valueLabel}</span>
        </>
      )}
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className='ml-1 rounded-sm opacity-60 hover:opacity-100'
        aria-label='Remove filter'
      >
        <Icons.close className='h-3 w-3' />
      </button>
    </Badge>
  );
}
