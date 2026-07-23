'use client';

import type { Option } from '@/types/data-table';
import type { Column } from '@tanstack/react-table';
import * as React from 'react';
import { Icons } from '@/components/icons';
import { DataTableFilterClear } from '@/components/ui/table/data-table-filter-clear';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DataTableRadioFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Option[];
}

export function DataTableRadioFilter<TData, TValue>({
  column,
  title,
  options
}: DataTableRadioFilterProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false);

  const columnFilterValue = column?.getFilterValue();
  // stored as iLike string value e.g. "%value%"
  const selectedRaw = typeof columnFilterValue === 'string' ? columnFilterValue : null;
  const selectedValue = selectedRaw ? selectedRaw.replace(/%/g, '') : null;

  const onItemSelect = React.useCallback(
    (option: Option) => {
      if (!column) return;
      if (selectedValue === option.value) {
        column.setFilterValue(undefined);
      } else {
        // wrap in % for LIKE/iLike operator
        column.setFilterValue(`%${option.value}%`);
      }
      setOpen(false);
    },
    [column, selectedValue]
  );

  const onReset = React.useCallback(
    (event?: React.MouseEvent | React.KeyboardEvent) => {
      event?.stopPropagation();
      column?.setFilterValue(undefined);
    },
    [column]
  );

  const selectedOption = options.find((o) => o.value === selectedValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant='outline' size='sm' className='border-dashed' />}>
        {selectedValue ? (
          <DataTableFilterClear title={title} onReset={onReset} />
        ) : (
          <Icons.plusCircle />
        )}
        {title}
        {selectedOption && (
          <>
            <Separator orientation='vertical' className='mx-0.5 data-[orientation=vertical]:h-4' />
            <Badge variant='secondary' className='rounded-sm px-1 font-normal'>
              {selectedOption.label}
            </Badge>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent className='w-[12.5rem] p-2' align='start'>
        <div className='space-y-1'>
          {options.map((option) => {
            const isSelected = selectedValue === option.value;
            return (
              <button
                key={option.value}
                type='button'
                onClick={() => onItemSelect(option)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isSelected && 'bg-accent text-accent-foreground'
                )}
              >
                <div
                  className={cn(
                    'flex size-4 shrink-0 items-center justify-center rounded-full border',
                    isSelected ? 'border-primary' : 'border-muted-foreground'
                  )}
                >
                  {isSelected && (
                    <div className='bg-primary size-2 rounded-full' />
                  )}
                </div>
                {option.icon && <option.icon className='size-4 shrink-0' />}
                <span className='truncate'>{option.label}</span>
                {option.count !== undefined && (
                  <span className='text-muted-foreground ml-auto font-mono text-xs'>
                    {option.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {selectedValue && (
          <>
            <Separator className='my-1' />
            <button
              type='button'
              onClick={() => onReset()}
              className='text-muted-foreground hover:text-foreground w-full rounded-sm py-1 text-center text-sm'
            >
              Clear filter
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
