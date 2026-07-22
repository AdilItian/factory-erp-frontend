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
import { cn } from '@/lib/utils';

export function MultiSelectFilterInput({ value = [], onChange, options }) {
  function toggle(optionValue) {
    const next = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(next);
  }

  return (
    <Command>
      <CommandInput placeholder='Search options...' />
      <CommandList>
        <CommandEmpty>No options found.</CommandEmpty>
        <CommandGroup>
          {options.map((opt) => {
            const selected = value.includes(opt.value);
            return (
              <CommandItem key={opt.value} value={opt.label} onSelect={() => toggle(opt.value)}>
                <div
                  className={cn(
                    'border-primary flex h-4 w-4 items-center justify-center rounded-sm border',
                    selected ? 'bg-primary' : 'opacity-50 [&_svg]:invisible'
                  )}
                >
                  <Icons.check className='h-3 w-3 text-primary-foreground' />
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
