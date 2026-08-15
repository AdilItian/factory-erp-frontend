'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import { CrudFormSheet } from '@/components/erp/crud-form-sheet';
import { compactPayload } from '@/lib/compact-payload';
import { codeNameLabel, mapToOptions } from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useStoresOptionsQuery } from '@/features/stores/api/queries';
import { useItemsOptionsQuery } from '@/features/items/api/queries';
import {
  useAdjustStockMutation,
  useRecordOpeningMutation
} from '../api/mutations';
import {
  adjustmentSchema,
  getAdjustmentFormSections,
  getOpeningFormSections,
  openingSchema
} from '../constants/inventory-form-config';

function useStoreItemOptions(open) {
  const { data: stores = [] } = useStoresOptionsQuery({ enabled: open });
  const { data: items = [] } = useItemsOptionsQuery({ enabled: open });
  const storeOptions = useMemo(
    () => mapToOptions(stores, codeNameLabel),
    [stores]
  );
  const itemOptions = useMemo(
    () => mapToOptions(items, codeNameLabel),
    [items]
  );
  return { storeOptions, itemOptions };
}

function toLine(values) {
  return compactPayload({
    itemId: values.itemId,
    quantity: values.quantity,
    unitCost: values.unitCost,
    batchCode: values.batchCode,
    serialNo: values.serialNo,
    notes: values.notes
  });
}

export function OpeningStockSheet({ open, onOpenChange }) {
  const { storeOptions, itemOptions } = useStoreItemOptions(open);
  const sections = useMemo(
    () => getOpeningFormSections(storeOptions, itemOptions),
    [storeOptions, itemOptions]
  );
  const { mutate: recordOpening, isPending } = useRecordOpeningMutation({
    onSuccess: () => {
      toast.success('Opening stock posted');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to post opening stock'));
    }
  });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title='Opening stock'
      description='Allowed only while an item has no movements in that store.'
      schema={openingSchema}
      defaultValues={{
        storeId: '',
        notes: '',
        itemId: '',
        quantity: '',
        unitCost: '',
        batchCode: '',
        serialNo: ''
      }}
      sections={sections}
      intro={{
        eyebrow: 'Opening stock',
        title: 'Post a starting balance for one item in one store.',
        description: 'Allowed only while an item has no movements in that store.'
      }}
      onSubmit={(values) =>
        recordOpening({
          storeId: values.storeId,
          notes: values.notes?.trim() || undefined,
          lines: [toLine(values)]
        })
      }
      isPending={isPending}
      formId='opening-stock-form'
      createLabel='Post opening'
      loadingText='Posting...'
      resetKey='opening'
    />
  );
}

export function AdjustmentSheet({ open, onOpenChange }) {
  const { storeOptions, itemOptions } = useStoreItemOptions(open);
  const sections = useMemo(
    () => getAdjustmentFormSections(storeOptions, itemOptions),
    [storeOptions, itemOptions]
  );
  const { mutate: adjustStock, isPending } = useAdjustStockMutation({
    onSuccess: () => {
      toast.success('Adjustment posted');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to post adjustment'));
    }
  });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title='Stock adjustment'
      description='Positive quantity writes stock on; negative writes it off.'
      schema={adjustmentSchema}
      defaultValues={{
        storeId: '',
        reason: '',
        notes: '',
        itemId: '',
        quantity: '',
        unitCost: '',
        batchCode: '',
        serialNo: ''
      }}
      sections={sections}
      intro={{
        eyebrow: 'Stock adjustment',
        title: 'Write stock on or off with a signed quantity.',
        description: 'Positive quantity writes stock on; negative writes it off.'
      }}
      onSubmit={(values) =>
        adjustStock({
          storeId: values.storeId,
          reason: values.reason.trim(),
          notes: values.notes?.trim() || undefined,
          lines: [toLine(values)]
        })
      }
      isPending={isPending}
      formId='stock-adjustment-form'
      createLabel='Post adjustment'
      loadingText='Posting...'
      resetKey='adjustment'
    />
  );
}
