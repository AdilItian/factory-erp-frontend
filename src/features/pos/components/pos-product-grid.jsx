'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getEntityName } from '@/lib/entity';
import {
  findByBarcode,
  formatMoney,
  matchesPosSearch
} from '../utils/cart';

export function PosProductGrid({
  items = [],
  search,
  onSearchChange,
  onAdd
}) {
  const inputRef = useRef(null);
  const filtered = items.filter((item) => matchesPosSearch(item, search));

  function handleScanSubmit() {
    const raw = String(search ?? '').trim();
    if (!raw) return;

    const match = findByBarcode(items, raw);
    if (match) {
      onAdd(match);
      toast.success(`Added ${getEntityName(match)}`);
      onSearchChange('');
      inputRef.current?.focus();
      return;
    }

    if (/^\d{8,}$/.test(raw)) {
      toast.error(`No product for barcode ${raw}`);
      onSearchChange('');
      inputRef.current?.focus();
    }
  }

  return (
    <div className='flex min-h-0 flex-1 flex-col gap-3'>
      <div className='relative'>
        <Icons.barcode className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
        <Input
          ref={inputRef}
          value={search}
          autoFocus
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            handleScanSubmit();
          }}
          placeholder='Scan or search…'
          className='h-10 rounded-xl pl-9'
          inputMode='search'
          autoComplete='off'
          spellCheck={false}
        />
      </div>

      {filtered.length === 0 ? (
        <div className='bg-muted/20 text-muted-foreground flex flex-1 items-center justify-center rounded-xl border border-dashed px-4 py-10 text-sm'>
          No products match.
        </div>
      ) : (
        <div className='grid min-h-0 flex-1 content-start gap-2 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {filtered.map((item) => (
            <button
              key={item.id}
              type='button'
              onClick={() => onAdd(item)}
              className={cn(
                'group bg-card border-border',
                'hover:border-primary hover:bg-primary/5',
                'focus-visible:border-primary focus-visible:ring-ring',
                'flex flex-col justify-between gap-2 rounded-xl border px-3 py-2.5 text-left',
                'transition-colors duration-150',
                'focus-visible:ring-2 focus-visible:outline-none'
              )}
            >
              <div className='flex items-start justify-between gap-2'>
                <div className='min-w-0'>
                  <p className='text-muted-foreground truncate font-mono text-[10px] tracking-wide uppercase'>
                    {item.code}
                  </p>
                  <p className='mt-0.5 line-clamp-2 text-sm leading-snug font-medium tracking-tight'>
                    {item.name}
                  </p>
                  {item.barcode ? (
                    <p className='text-muted-foreground mt-1 truncate font-mono text-[10px] tabular-nums'>
                      {item.barcode}
                    </p>
                  ) : null}
                </div>
                <span
                  className={cn(
                    'bg-muted text-muted-foreground',
                    'group-hover:bg-primary group-hover:text-primary-foreground',
                    'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full transition-colors'
                  )}
                  aria-hidden
                >
                  <Icons.add className='size-3.5 text-current' />
                </span>
              </div>
              <p className='text-sm font-semibold tabular-nums tracking-tight'>
                {formatMoney(item.retailPrice)}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
