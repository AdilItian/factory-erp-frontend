'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CrudFormSheet } from '@/components/erp/crud-form-sheet';
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
import productionService from '../api/service';
import { useGatePassDetailQuery } from '../api/queries';
import {
  useAddGatePassLineMutation,
  useCreateGatePassMutation,
  useRemoveGatePassLineMutation,
  useUpdateGatePassMutation
} from '../api/mutations';
import {
  GATE_PASS_DEFAULTS,
  gatePassLineSchema,
  gatePassSchema,
  getGatePassFormSections,
  getGatePassLineFormSections
} from '../constants/gate-pass-form-config';
import { LinesSheet } from '@/components/erp/lines-sheet';

function valuesFromGatePass(row) {
  if (!row) return GATE_PASS_DEFAULTS;
  return {
    type: row.type ?? 'OUTWARD',
    reason: row.reason ?? 'DISPATCH',
    locationId: refId(row.locationId) || refId(row.location),
    destinationId: refId(row.destinationId) || refId(row.destination) || '__none__',
    vehicleNo: row.vehicleNo ?? '',
    driverName: row.driverName ?? '',
    notes: row.notes ?? ''
  };
}

export function GatePassFormSheet({ gatePass, open, onOpenChange }) {
  const isEdit = Boolean(gatePass);
  const catalog = productionService.getCatalog();
  const locationOptions = useMemo(
    () => mapToOptions(catalog.locations, codeNameLabel),
    [catalog.locations]
  );
  const sections = useMemo(
    () => getGatePassFormSections(locationOptions),
    [locationOptions]
  );
  const defaultValues = useMemo(
    () => valuesFromGatePass(gatePass),
    [gatePass]
  );

  const { mutate: createRow, isPending: isCreating } =
    useCreateGatePassMutation({
      onSuccess: () => {
        toast.success('Gate pass created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create gate pass'));
      }
    });
  const { mutate: updateRow, isPending: isUpdating } =
    useUpdateGatePassMutation({
      onSuccess: () => {
        toast.success('Gate pass updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update gate pass'));
      }
    });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit gate pass' : 'New gate pass'}
      description='Add lines, then issue at the gate. Factories can require this on dispatch.'
      schema={gatePassSchema}
      defaultValues={defaultValues}
      sections={sections}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New gate pass',
        title: isEdit
          ? 'Update this pass, then save.'
          : 'Set direction and the gate, then add items from the table.',
        description: 'Outward passes are for dispatch and transfers; inward for returns.'
      }}
      onSubmit={(values) => {
        const payload = compactPayload(values);
        if (isEdit) {
          updateRow({ id: getEntityId(gatePass), payload });
          return;
        }
        createRow(payload);
      }}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='gate-pass-form'
      createLabel='Create gate pass'
      resetKey={getEntityId(gatePass) || 'new'}
    />
  );
}

export function GatePassLinesSheet({ gatePass, open, onOpenChange }) {
  const passId = getEntityId(gatePass);
  const catalog = productionService.getCatalog();
  const { data: detail } = useGatePassDetailQuery(passId, {
    enabled: open && Boolean(passId)
  });
  const itemOptions = useMemo(
    () => mapToOptions(catalog.items, codeNameLabel),
    [catalog.items]
  );
  const sections = useMemo(
    () => getGatePassLineFormSections(itemOptions),
    [itemOptions]
  );
  const lines = detail?.lines ?? gatePass?.lines ?? [];

  const { mutate: addLine, isPending } = useAddGatePassLineMutation({
    onSuccess: () => toast.success('Line added'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to add line'));
    }
  });
  const { mutate: removeLine } = useRemoveGatePassLineMutation({
    onSuccess: () => toast.success('Line removed'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to remove line'));
    }
  });

  return (
    <LinesSheet
      open={open}
      onOpenChange={onOpenChange}
      title='Gate pass lines'
      description={`Items on ${getEntityName(gatePass, gatePass?.code)}.`}
      schema={gatePassLineSchema}
      defaultValues={{ itemId: '', quantity: '', remarks: '' }}
      sections={sections}
      intro={{
        eyebrow: 'Pass line',
        title: 'Add one item at a time.',
        description: 'Each line is what the gate will check against this pass.'
      }}
      listTitle='On this pass'
      listDescription='Remove a line if it should not leave or enter with this pass.'
      listIcon='gatePass'
      rows={lines}
      emptyMessage='No items on this pass yet.'
      addLabel='Add item'
      isPending={isPending}
      formId='gate-pass-line-form'
      onAdd={(values) =>
        addLine({ id: passId, payload: compactPayload(values) })
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
              {line.quantity}
              {line.remarks ? ` · ${line.remarks}` : ''}
            </p>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='text-muted-foreground size-8'
            onClick={() => removeLine({ id: passId, lineId: line.id })}
          >
            <Icons.trash className='size-4' />
          </Button>
        </div>
      )}
    />
  );
}
