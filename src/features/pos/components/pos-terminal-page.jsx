'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { codeNameLabel, getEntityId } from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { SOFT_SELECT_CLASS } from '@/components/erp/form-sections';
import { cn } from '@/lib/utils';
import { usePosCatalogQuery, usePosOutletsQuery } from '../api/queries';
import { useCreatePosSaleMutation } from '../api/mutations';
import {
  cartTotals,
  setCartLineQty,
  upsertCartLine
} from '../utils/cart';
import { PosProductGrid } from './pos-product-grid';
import { PosCart } from './pos-cart';
import { PosSaleCompleteDialog } from './pos-sale-complete-dialog';

const OUTLET_STORAGE_KEY = 'pos:outletId:v1';

export default function PosTerminalPage() {
  const { data: outlets = [], isPending: outletsLoading } = usePosOutletsQuery();
  const { data: items = [], isPending: catalogLoading } = usePosCatalogQuery();
  const [outletId, setOutletId] = useState('');
  const [search, setSearch] = useState('');
  const [lines, setLines] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [discount, setDiscount] = useState('0');
  const [discountType, setDiscountType] = useState('amount');
  const [tendered, setTendered] = useState('');
  const [completedSale, setCompletedSale] = useState(null);

  const outletOptions = useMemo(
    () =>
      outlets.map((row) => ({
        value: getEntityId(row),
        label: codeNameLabel(row)
      })),
    [outlets]
  );

  useEffect(() => {
    if (!outlets.length) return;
    try {
      const saved = localStorage.getItem(OUTLET_STORAGE_KEY);
      if (saved && outlets.some((row) => getEntityId(row) === saved)) {
        setOutletId(saved);
        return;
      }
    } catch {
      // ignore
    }
    setOutletId((current) => current || getEntityId(outlets[0]));
  }, [outlets]);

  useEffect(() => {
    if (!outletId) return;
    try {
      localStorage.setItem(OUTLET_STORAGE_KEY, outletId);
    } catch {
      // ignore
    }
  }, [outletId]);

  const totals = cartTotals(lines, discount, discountType);

  useEffect(() => {
    if (paymentMethod === 'CARD') {
      setTendered(String(totals.total || ''));
    }
  }, [paymentMethod, totals.total]);

  const { mutate: createSale, isPending } = useCreatePosSaleMutation({
    onSuccess: (sale) => {
      toast.success(
        sale.paymentMethod === 'CARD'
          ? `Card charged · ${sale.code}`
          : `Sale ${sale.code} recorded`
      );
      setLines([]);
      setDiscount('0');
      setDiscountType('amount');
      setTendered('');
      setPaymentMethod('CASH');
      setCompletedSale(sale);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to complete sale'));
    }
  });

  function checkout() {
    if (!outletId) {
      toast.error('Select an outlet first');
      return;
    }
    if (!lines.length) {
      toast.error('Add at least one item');
      return;
    }
    const tenderedValue =
      paymentMethod === 'CARD'
        ? totals.total
        : Number(tendered || totals.total);
    if (tenderedValue < totals.total) {
      toast.error('Tendered amount is less than total');
      return;
    }
    createSale({
      locationId: outletId,
      paymentMethod,
      discountType,
      discountValue: discount,
      discount: totals.discount,
      tendered: String(tenderedValue),
      lines: lines.map((line) => ({
        itemId: line.itemId,
        quantity: line.quantity,
        unitPrice: line.unitPrice
      }))
    });
  }

  return (
    <PageContainer
      pageTitle='Outlet POS'
      pageDescription='Ring up finished goods at an outlet — scan a barcode or search by name.'
      pageHeaderAction={
        <Button variant='outline' render={<Link href='/dashboard/sales/pos/history' />}>
          <Icons.inventory className='mr-2 size-4' />
          Sale history
        </Button>
      }
    >
      <PosSaleCompleteDialog
        sale={completedSale}
        open={Boolean(completedSale)}
        onOpenChange={(open) => {
          if (!open) setCompletedSale(null);
        }}
      />

      <div className='flex flex-col gap-4'>
        <div className='bg-card flex flex-wrap items-end gap-3 rounded-2xl border p-4'>
          <div className='min-w-[14rem] flex-1 space-y-1.5'>
            <p className='text-muted-foreground text-[11px] font-medium tracking-[0.12em] uppercase'>
              Outlet
            </p>
            <Select
              items={outletOptions}
              value={outletId || null}
              onValueChange={setOutletId}
            >
              <SelectTrigger className={cn(SOFT_SELECT_CLASS, 'w-full')}>
                <SelectValue placeholder='Select outlet' />
              </SelectTrigger>
              <SelectContent>
                {outletOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className='text-muted-foreground pb-2 text-xs'>
            {outletsLoading || catalogLoading
              ? 'Loading catalog…'
              : `${items.length} sellable SKUs`}
          </p>
        </div>

        <div className='grid min-h-[32rem] gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]'>
          <PosProductGrid
            items={items}
            search={search}
            onSearchChange={setSearch}
            onAdd={(item) => setLines((curr) => upsertCartLine(curr, item, 1))}
          />
          <PosCart
            lines={lines}
            paymentMethod={paymentMethod}
            discount={discount}
            discountType={discountType}
            tendered={tendered}
            isPending={isPending}
            onPaymentMethodChange={setPaymentMethod}
            onDiscountChange={setDiscount}
            onDiscountTypeChange={(type) => {
              setDiscountType(type);
              setDiscount('0');
            }}
            onTenderedChange={setTendered}
            onQtyChange={(itemId, quantity) =>
              setLines((curr) => setCartLineQty(curr, itemId, quantity))
            }
            onRemove={(itemId) =>
              setLines((curr) => curr.filter((line) => line.itemId !== itemId))
            }
            onClear={() => {
              setLines([]);
              setDiscount('0');
              setDiscountType('amount');
              setTendered('');
            }}
            onCheckout={checkout}
          />
        </div>
      </div>
    </PageContainer>
  );
}
