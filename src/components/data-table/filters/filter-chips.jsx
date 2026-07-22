'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { FilterChip } from './filter-chip';

export function FilterChips({ conditions, filterConfig, onEdit, onRemove, onClearAll }) {
  if (!conditions || conditions.length === 0) return null;

  return (
    <div className='flex flex-wrap items-center gap-2'>
      {conditions.map((condition, index) => (
        <FilterChip
          key={`${condition.id}-${index}`}
          condition={condition}
          filterConfig={filterConfig}
          onEdit={() => onEdit(condition, index)}
          onRemove={() => onRemove(index)}
        />
      ))}
      {conditions.length >= 2 && (
        <Button
          variant='ghost'
          size='sm'
          className='h-7 px-2 text-muted-foreground hover:text-foreground text-xs'
          onClick={onClearAll}
        >
          <Icons.close className='mr-1 h-3 w-3' />
          Clear all
        </Button>
      )}
    </div>
  );
}
