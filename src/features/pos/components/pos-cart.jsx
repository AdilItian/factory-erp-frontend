'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingButton from '@/components/ui/loading-button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { getEntityName } from '@/lib/entity';
import { SOFT_FIELD_CLASS, SOFT_LABEL_CLASS } from '@/components/erp/form-sections';
import { cartTotals, formatMoney } from '../utils/cart';

const PAYMENTS = [
  { value: 'CASH', label: 'Cash', icon: Icons.billing },
  { value: 'CARD', label: 'Card', icon: Icons.creditCard }
];

export function PosCart({
  lines,
  paymentMethod,
  discount,
  discountType = 'amount',
  tendered,
  isPending,
  onPaymentMethodChange,
  onDiscountChange,
  onDiscountTypeChange,
  onTenderedChange,
  onQtyChange,
  onRemove,
  onClear,
  onCheckout
}) {
  const [isCharging, setIsCharging] = useState(false);
  const totals = cartTotals(lines, discount, discountType);
  const isCard = paymentMethod === 'CARD';
  const isPercent = discountType === 'percent';
  const tenderedNum = Number(tendered);
  const change =
    Number.isFinite(tenderedNum) && tenderedNum >= totals.total
      ? tenderedNum - totals.total
      : 0;
  const busy = isPending || isCharging;

  async function handleCheckout() {
    if (!lines.length || busy) return;

    if (isCard) {
      setIsCharging(true);
      try {
        // Simulated terminal approve — swap for a real card SDK later.
        await new Promise((resolve) => setTimeout(resolve, 700));
        onCheckout();
      } finally {
        setIsCharging(false);
      }
      return;
    }

    onCheckout();
  }

  return (
    <aside className='bg-card flex h-full min-h-[28rem] flex-col overflow-hidden rounded-2xl border lg:min-h-0'>
      <div className='bg-muted/25 flex items-center justify-between border-b px-4 py-3'>
        <div>
          <p className='text-sm font-semibold tracking-tight'>Cart</p>
          <p className='text-muted-foreground text-xs'>
            {lines.length} line{lines.length === 1 ? '' : 's'}
          </p>
        </div>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          disabled={!lines.length || busy}
          onClick={onClear}
        >
          Clear
        </Button>
      </div>

      <div className='min-h-0 flex-1 overflow-y-auto'>
        {lines.length === 0 ? (
          <p className='text-muted-foreground px-4 py-8 text-center text-sm'>
            Tap products to build the sale.
          </p>
        ) : (
          <ul className='divide-border divide-y'>
            {lines.map((line) => (
              <li key={line.itemId} className='flex gap-3 px-4 py-3'>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>
                    {getEntityName(line.item, line.itemId)}
                  </p>
                  <p className='text-muted-foreground text-xs tabular-nums'>
                    {formatMoney(line.unitPrice)} each
                  </p>
                  <div className='mt-2 flex items-center gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      className='size-8'
                      onClick={() =>
                        onQtyChange(line.itemId, Number(line.quantity) - 1)
                      }
                    >
                      <Icons.minus className='size-3.5' />
                    </Button>
                    <Input
                      className='h-8 w-14 rounded-lg text-center tabular-nums'
                      value={line.quantity}
                      onChange={(event) =>
                        onQtyChange(line.itemId, event.target.value)
                      }
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      className='size-8'
                      onClick={() =>
                        onQtyChange(line.itemId, Number(line.quantity) + 1)
                      }
                    >
                      <Icons.add className='size-3.5' />
                    </Button>
                  </div>
                </div>
                <div className='flex flex-col items-end gap-2'>
                  <p className='text-sm font-semibold tabular-nums'>
                    {formatMoney(Number(line.quantity) * Number(line.unitPrice))}
                  </p>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='text-muted-foreground size-8'
                    onClick={() => onRemove(line.itemId)}
                  >
                    <Icons.trash className='size-4' />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='space-y-4 border-t p-4'>
        <div className='grid grid-cols-2 gap-2'>
          {PAYMENTS.map((option) => {
            const Icon = option.icon;
            const selected = paymentMethod === option.value;
            return (
              <button
                key={option.value}
                type='button'
                onClick={() => onPaymentMethodChange(option.value)}
                aria-pressed={selected}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                  selected
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                )}
              >
                <Icon className='size-4' />
                {option.label}
              </button>
            );
          })}
        </div>

        {isCard ? (
          <div className='bg-muted/30 space-y-2 rounded-xl border px-4 py-3'>
            <p className='text-muted-foreground text-[11px] font-medium tracking-[0.12em] uppercase'>
              Card terminal
            </p>
            <p className='text-sm font-medium tracking-tight'>
              {isCharging
                ? 'Present card… approving'
                : 'Charge the customer’s card for this total.'}
            </p>
            <p className='text-2xl font-semibold tabular-nums tracking-tight'>
              {formatMoney(totals.total)}
            </p>
          </div>
        ) : null}

        <div className={cn('grid gap-3', isCard ? 'grid-cols-1' : 'sm:grid-cols-2')}>
          <div className='space-y-1.5'>
            <div className='flex items-center justify-between gap-2'>
              <Label className={SOFT_LABEL_CLASS}>Discount</Label>
              <div className='flex rounded-lg border p-0.5'>
                {[
                  { value: 'amount', label: 'Rs' },
                  { value: 'percent', label: '%' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => onDiscountTypeChange?.(option.value)}
                    className={cn(
                      'rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors',
                      discountType === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className='relative'>
              <Input
                className={cn(SOFT_FIELD_CLASS, isPercent && 'pr-8')}
                value={discount}
                onChange={(event) => onDiscountChange(event.target.value)}
                inputMode='decimal'
                placeholder={isPercent ? '10' : '0'}
              />
              {isPercent ? (
                <span className='text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm'>
                  %
                </span>
              ) : null}
            </div>
          </div>
          {!isCard ? (
            <div className='space-y-1.5'>
              <Label className={SOFT_LABEL_CLASS}>Tendered</Label>
              <Input
                className={SOFT_FIELD_CLASS}
                value={tendered}
                onChange={(event) => onTenderedChange(event.target.value)}
                inputMode='decimal'
                placeholder={String(totals.total || '')}
              />
            </div>
          ) : null}
        </div>

        <dl className='space-y-1.5 text-sm'>
          <div className='flex justify-between'>
            <dt className='text-muted-foreground'>Subtotal</dt>
            <dd className='tabular-nums'>{formatMoney(totals.subtotal)}</dd>
          </div>
          <div className='flex justify-between'>
            <dt className='text-muted-foreground'>
              Discount
              {isPercent && totals.discountPercent != null
                ? ` (${formatMoney(totals.discountPercent)}%)`
                : ''}
            </dt>
            <dd className='tabular-nums'>-{formatMoney(totals.discount)}</dd>
          </div>
          <div className='flex justify-between text-base font-semibold'>
            <dt>{isCard ? 'Charge' : 'Total'}</dt>
            <dd className='tabular-nums'>{formatMoney(totals.total)}</dd>
          </div>
          {!isCard ? (
            <div className='text-muted-foreground flex justify-between text-xs'>
              <dt>Change</dt>
              <dd className='tabular-nums'>{formatMoney(change)}</dd>
            </div>
          ) : null}
        </dl>

        <LoadingButton
          type='button'
          className='h-11 w-full'
          isLoading={busy}
          loadingText={isCard ? 'Charging card…' : 'Recording…'}
          disabled={!lines.length}
          onClick={handleCheckout}
        >
          {isCard ? (
            <>
              <Icons.creditCard className='mr-2 size-4' />
              Charge card
            </>
          ) : (
            <>
              <Icons.pos className='mr-2 size-4' />
              Complete sale
            </>
          )}
        </LoadingButton>
      </div>
    </aside>
  );
}
