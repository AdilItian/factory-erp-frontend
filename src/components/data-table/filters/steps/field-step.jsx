'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Icons } from '@/components/icons';
import { FILTER_TYPES } from '../filter-schema';

const TYPE_ICONS = {
  [FILTER_TYPES.TEXT]: Icons.text,
  [FILTER_TYPES.NUMBER]: Icons.trendingUp,
  [FILTER_TYPES.DATE]: Icons.calendar,
  [FILTER_TYPES.ENUM]: Icons.checks,
  [FILTER_TYPES.BOOLEAN]: Icons.circleCheck
};

export function FieldStep({ filterConfig, onSelect }) {
  return (
    <Command>
      <CommandInput placeholder='Search fields...' autoFocus />
      <CommandList>
        <CommandEmpty>No fields found.</CommandEmpty>
        <CommandGroup>
          {filterConfig.columns.map((col) => {
            const Icon = TYPE_ICONS[col.type] ?? Icons.adjustments;
            return (
              <CommandItem key={col.id} value={col.label} onSelect={() => onSelect(col.id)}>
                <Icon className='h-4 w-4 text-muted-foreground' />
                <span>{col.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
