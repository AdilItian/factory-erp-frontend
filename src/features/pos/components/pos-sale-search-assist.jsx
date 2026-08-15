'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import {
  SOFT_FIELD_CLASS,
  SOFT_LABEL_CLASS
} from '@/components/erp/form-sections';
import {
  codeNameLabel,
  formatEntityDate,
  formatEnumLabel,
  getEntityId,
  getEntityName
} from '@/lib/entity';
import { cn } from '@/lib/utils';
import { formatMoney } from '../utils/cart';
import { usePosCompletedSalesOptionsQuery } from '../api/queries';
import { matchesSaleSearch } from '../constants/pos-return-form-config';

function lineSummary(lines = []) {
  if (!lines.length) return 'No items';
  return lines
    .map((line) => `${line.quantity}× ${getEntityName(line.item, line.itemId)}`)
    .join(' · ');
}

function SelectedSaleCard({ sale, onClear, locked }) {
  return (
    <div className='bg-muted/30 space-y-2 rounded-xl border px-4 py-3'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-muted-foreground text-[11px] font-medium tracking-[0.12em] uppercase'>
            Original sale
          </p>
          <p className='mt-1 text-sm font-semibold tracking-tight'>
            {sale.code}
          </p>
          <p className='text-muted-foreground mt-0.5 text-xs'>
            {sale.location ? codeNameLabel(sale.location) : '—'} ·{' '}
            {formatEntityDate(sale.soldAt)}
          </p>
        </div>
        <div className='text-right'>
          <p className='text-base font-semibold tabular-nums'>
            {formatMoney(sale.total)}
          </p>
          <p className='text-muted-foreground text-xs'>
            {formatEnumLabel(sale.paymentMethod)}
          </p>
        </div>
      </div>
      <p className='text-muted-foreground truncate text-xs'>
        {lineSummary(sale.lines)}
      </p>
      {!locked ? (
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='-ml-2 h-8'
          onClick={onClear}
        >
          <Icons.search className='mr-1.5 size-3.5' />
          Search another sale
        </Button>
      ) : null}
    </div>
  );
}

export function SaleSearchAssist({
  value,
  onSelect,
  onClear,
  locked = false,
  error
}) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const { data: sales = [], isPending } = usePosCompletedSalesOptionsQuery();

  const selected = useMemo(
    () => sales.find((sale) => getEntityId(sale) === value) ?? null,
    [sales, value]
  );

  const results = useMemo(() => {
    if (selected || locked) return [];
    const filtered = sales.filter((sale) =>
      matchesSaleSearch(sale, deferredQuery)
    );
    return filtered.slice(0, 8);
  }, [sales, deferredQuery, selected, locked]);

  function selectExactMatch(raw) {
    const needle = String(raw ?? '').trim().toLowerCase();
    if (!needle) return false;
    const match = sales.find(
      (sale) => String(sale.code ?? '').toLowerCase() === needle
    );
    if (!match) return false;
    onSelect(match);
    setQuery('');
    return true;
  }

  useEffect(() => {
    if (selected || locked || isPending) return;
    const needle = String(deferredQuery ?? '').trim().toLowerCase();
    if (!needle) return;
    const match = sales.find(
      (sale) => String(sale.code ?? '').toLowerCase() === needle
    );
    if (!match) return;
    onSelect(match);
    setQuery('');
  }, [deferredQuery, sales, selected, locked, isPending, onSelect]);

  if (locked && !selected && value) {
    return (
      <div className='bg-muted/20 text-muted-foreground rounded-xl border px-4 py-3 text-sm'>
        Linked to sale {value}
      </div>
    );
  }

  if (selected) {
    return (
      <SelectedSaleCard
        sale={selected}
        locked={locked}
        onClear={() => {
          setQuery('');
          onClear?.();
        }}
      />
    );
  }

  return (
    <div className='space-y-3'>
      <div className='space-y-1.5'>
        <Label className={SOFT_LABEL_CLASS}>Find original sale</Label>
        <div className='relative'>
          <Icons.search className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            className={cn(SOFT_FIELD_CLASS, 'pl-9')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;
              event.preventDefault();
              if (selectExactMatch(query)) return;
              if (results.length === 1) {
                onSelect(results[0]);
                setQuery('');
              }
            }}
            placeholder='Scan receipt barcode or search sale…'
            autoComplete='off'
            autoFocus
          />
        </div>
        <p className='text-muted-foreground text-xs'>
          Scan the barcode on the customer receipt, or search by sale code /
          outlet.
        </p>
        {error ? (
          <p className='text-destructive text-xs'>{error}</p>
        ) : null}
      </div>

      <div className='overflow-hidden rounded-xl border'>
        {isPending ? (
          <p className='text-muted-foreground px-4 py-6 text-center text-sm'>
            Loading sales…
          </p>
        ) : results.length === 0 ? (
          <p className='text-muted-foreground px-4 py-6 text-center text-sm'>
            {deferredQuery.trim()
              ? 'No completed sales match that search.'
              : 'Scan the receipt barcode, or type a sale code to find it.'}
          </p>
        ) : (
          <ul className='divide-border max-h-64 divide-y overflow-y-auto'>
            {results.map((sale) => (
              <li key={getEntityId(sale)}>
                <button
                  type='button'
                  className='hover:bg-muted/40 flex w-full items-start gap-3 px-4 py-3 text-left transition-colors'
                  onClick={() => onSelect(sale)}
                >
                  <Icons.receipt className='text-muted-foreground mt-0.5 size-4 shrink-0' />
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-baseline justify-between gap-2'>
                      <p className='truncate text-sm font-medium'>{sale.code}</p>
                      <p className='shrink-0 text-sm font-semibold tabular-nums'>
                        {formatMoney(sale.total)}
                      </p>
                    </div>
                    <p className='text-muted-foreground mt-0.5 text-xs'>
                      {sale.location ? codeNameLabel(sale.location) : '—'} ·{' '}
                      {formatEntityDate(sale.soldAt)}
                    </p>
                    <p className='text-muted-foreground mt-0.5 truncate text-xs'>
                      {lineSummary(sale.lines)}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
