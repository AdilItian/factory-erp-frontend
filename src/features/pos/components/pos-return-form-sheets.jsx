'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CrudFormSheet } from '@/components/erp/crud-form-sheet';
import { LinesSheet } from '@/components/erp/lines-sheet';
import { Icons } from '@/components/icons';
import { compactPayload } from '@/lib/compact-payload';
import {
  codeNameLabel,
  getEntityId,
  getEntityName,
  mapToOptions,
  refId
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { formatMoney } from '../utils/cart';
import {
  usePosCatalogQuery,
  usePosReturnDetailQuery
} from '../api/queries';
import {
  useAddPosReturnLineMutation,
  useCreatePosReturnMutation,
  useRemovePosReturnLineMutation,
  useUpdatePosReturnMutation
} from '../api/mutations';
import {
  POS_RETURN_DEFAULTS,
  POS_RETURN_LINE_DEFAULTS,
  getPosReturnFormSections,
  getPosReturnLineFormSections,
  posReturnLineSchema,
  posReturnSchema
} from '../constants/pos-return-form-config';
import { SaleSearchAssist } from './pos-sale-search-assist';

function valuesFromReturn(row, saleIdPrefill) {
  if (!row) {
    return {
      ...POS_RETURN_DEFAULTS,
      ...(saleIdPrefill ? { saleId: saleIdPrefill } : {})
    };
  }
  return {
    saleId: refId(row.saleId) || '',
    reason: row.reason ?? 'SIZE_FIT',
    refundMethod: row.refundMethod ?? 'ORIGINAL',
    notes: row.notes ?? ''
  };
}

export function PosReturnFormSheet({
  doc,
  saleId: saleIdPrefill,
  open,
  onOpenChange
}) {
  const isEdit = Boolean(doc);
  const sections = useMemo(() => getPosReturnFormSections(), []);
  const defaultValues = useMemo(
    () => valuesFromReturn(doc, saleIdPrefill),
    [doc, saleIdPrefill]
  );

  const { mutate: createRow, isPending: isCreating } =
    useCreatePosReturnMutation({
      onSuccess: () => {
        toast.success('Return draft created — adjust lines, then refund');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create return'));
      }
    });
  const { mutate: updateRow, isPending: isUpdating } =
    useUpdatePosReturnMutation({
      onSuccess: () => {
        toast.success('Return updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update return'));
      }
    });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit return' : 'New customer return'}
      description='Find the sale the customer already paid for, then refund it.'
      schema={posReturnSchema}
      defaultValues={defaultValues}
      sections={sections}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'Customer return',
        title: isEdit
          ? 'Update reason or refund method.'
          : 'Search the original sale, then refund.',
        description:
          'After create, open Lines to change quantities, then Refund customer.'
      }}
      extraPosition='start'
      extra={({ setValue, watch, errors }) => (
        <SaleSearchAssist
          value={watch('saleId')}
          locked={isEdit}
          error={errors?.saleId?.message}
          onSelect={(sale) =>
            setValue('saleId', getEntityId(sale), {
              shouldValidate: true,
              shouldDirty: true
            })
          }
          onClear={() =>
            setValue('saleId', '', { shouldValidate: true, shouldDirty: true })
          }
        />
      )}
      onSubmit={(values) => {
        const payload = compactPayload(values);
        if (isEdit) {
          updateRow({ id: getEntityId(doc), payload });
          return;
        }
        createRow(payload);
      }}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='pos-return-form'
      createLabel='Create return'
      resetKey={`${getEntityId(doc) || 'new'}-${saleIdPrefill || ''}`}
    />
  );
}

export function PosReturnLinesSheet({ doc, open, onOpenChange }) {
  const docId = getEntityId(doc);
  const { data: items = [] } = usePosCatalogQuery({ enabled: open });
  const { data: detail } = usePosReturnDetailQuery(docId, {
    enabled: open && Boolean(docId)
  });
  const lines = detail?.lines ?? doc?.lines ?? [];
  const itemOptions = useMemo(
    () => mapToOptions(items, codeNameLabel),
    [items]
  );
  const sections = useMemo(
    () => getPosReturnLineFormSections(itemOptions),
    [itemOptions]
  );

  const { mutate: addLine, isPending } = useAddPosReturnLineMutation({
    onSuccess: () => toast.success('Line added'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to add line'));
    }
  });
  const { mutate: removeLine } = useRemovePosReturnLineMutation({
    onSuccess: () => toast.success('Line removed'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to remove line'));
    }
  });

  return (
    <LinesSheet
      open={open}
      onOpenChange={onOpenChange}
      title='Return lines'
      description={`Items to refund on ${getEntityName(doc, doc?.code)}.`}
      schema={posReturnLineSchema}
      defaultValues={POS_RETURN_LINE_DEFAULTS}
      sections={sections}
      intro={{
        eyebrow: 'Return line',
        title: 'What is coming back?',
        description: 'Refund amount updates from quantity × unit price.'
      }}
      listTitle='On this return'
      listDescription={`Refund total: ${formatMoney(detail?.refundTotal ?? doc?.refundTotal)}`}
      listIcon='refund'
      rows={lines}
      emptyMessage='No return lines yet.'
      addLabel='Add line'
      isPending={isPending}
      formId='pos-return-line-form'
      onAdd={(values) =>
        addLine({ id: docId, payload: compactPayload(values) })
      }
      renderRow={(line) => (
        <div
          key={line.id}
          className='flex items-center justify-between gap-3 px-4 py-2.5'
        >
          <div className='min-w-0'>
            <p className='truncate text-sm font-medium'>
              {line.item ? codeNameLabel(line.item) : line.itemId}
            </p>
            <p className='text-muted-foreground text-xs'>
              {line.quantity} × {formatMoney(line.unitPrice)} ={' '}
              {formatMoney(line.lineTotal)}
            </p>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='text-muted-foreground size-8'
            disabled={doc?.status === 'REFUNDED'}
            onClick={() => removeLine({ id: docId, lineId: line.id })}
          >
            <Icons.trash className='size-4' />
          </Button>
        </div>
      )}
    />
  );
}
