'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

export function RadioSelectFilterInput({ value = '', onChange, options }) {
  function select(optionValue) {
    onChange(optionValue === value ? '' : optionValue);
  }

  return (
    <Command>
      <CommandInput placeholder='Search options...' />
      <CommandList>
        <CommandEmpty>No options found.</CommandEmpty>
        <CommandGroup>
          {options.map((opt) => {
            const selected = value === opt.value;
            return (
              <CommandItem key={opt.value} value={opt.label} onSelect={() => select(opt.value)}>
                <div className='flex size-4 shrink-0 items-center justify-center rounded-full border border-primary'>
                  <div
                    className={cn(
                      'size-2 rounded-full transition-colors',
                      selected ? 'bg-primary' : 'bg-transparent'
                    )}
                  />
                </div>
                {opt.icon && <opt.icon className='h-4 w-4 text-muted-foreground' />}
                <span>{opt.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
