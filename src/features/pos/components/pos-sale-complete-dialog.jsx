'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Icons } from '@/components/icons';
import { codeNameLabel, formatEnumLabel } from '@/lib/entity';
import { formatMoney } from '../utils/cart';
import { printPosReceipt } from '../utils/print-receipt';
import { toast } from 'sonner';

export function PosSaleCompleteDialog({ sale, open, onOpenChange }) {
  if (!sale) return null;

  function handlePrint() {
    const ok = printPosReceipt(sale);
    if (!ok) {
      toast.error('Allow pop-ups to print the receipt');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Sale complete</DialogTitle>
          <DialogDescription>
            {sale.code} · {formatEnumLabel(sale.paymentMethod)} ·{' '}
            {formatMoney(sale.total)}
          </DialogDescription>
        </DialogHeader>

        <div className='bg-muted/30 space-y-2 rounded-xl border px-4 py-3 text-sm'>
          <div className='flex justify-between gap-3'>
            <span className='text-muted-foreground'>Outlet</span>
            <span className='text-right font-medium'>
              {sale.location ? codeNameLabel(sale.location) : '—'}
            </span>
          </div>
          <div className='flex justify-between gap-3'>
            <span className='text-muted-foreground'>Items</span>
            <span className='tabular-nums'>{sale.lines?.length ?? 0}</span>
          </div>
          <div className='flex justify-between gap-3'>
            <span className='text-muted-foreground'>Total</span>
            <span className='font-semibold tabular-nums'>
              {formatMoney(sale.total)}
            </span>
          </div>
          {sale.paymentMethod === 'CASH' ? (
            <div className='text-muted-foreground flex justify-between gap-3 text-xs'>
              <span>Change</span>
              <span className='tabular-nums'>{formatMoney(sale.change)}</span>
            </div>
          ) : null}
        </div>

        <DialogFooter className='sm:justify-between'>
          <Button type='button' variant='outline' onClick={handlePrint}>
            <Icons.print className='mr-2 size-4' />
            Print receipt
          </Button>
          <Button type='button' onClick={() => onOpenChange(false)}>
            New sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
