'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import { CrudFormSheet } from '@/components/erp/crud-form-sheet';
import { compactPayload } from '@/lib/compact-payload';
import {
  codeNameLabel,
  getEntityId,
  getEntityName,
  isEntityActive,
  mapToOptions
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useUomsOptionsQuery } from '../api/queries';
import {
  useCreateUomConversionMutation,
  useCreateUomMutation,
  useUpdateUomMutation
} from '../api/mutations';
import {
  UOM_DEFAULTS,
  conversionSchema,
  getConversionFormSections,
  getUomFormSections,
  uomSchema
} from '../constants/uom-form-config';

function valuesFromUom(uom) {
  if (!uom) return UOM_DEFAULTS;
  return {
    code: uom.code ?? '',
    name: getEntityName(uom, ''),
    symbol: uom.symbol ?? '',
    isActive: isEntityActive(uom)
  };
}

export function UomFormSheet({ uom, open, onOpenChange }) {
  const isEdit = Boolean(uom);
  const defaultValues = useMemo(() => valuesFromUom(uom), [uom]);
  const { mutate: createUom, isPending: isCreating } = useCreateUomMutation({
    onSuccess: () => {
      toast.success('Unit created');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to create unit'));
    }
  });
  const { mutate: updateUom, isPending: isUpdating } = useUpdateUomMutation({
    onSuccess: () => {
      toast.success('Unit updated');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update unit'));
    }
  });

  function onSubmit(values) {
    const payload = compactPayload(values);
    if (isEdit) {
      updateUom({ id: getEntityId(uom), payload });
      return;
    }
    createUom(payload);
  }

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit unit' : 'New unit'}
      description='Short codes are stored uppercase, e.g. KG.'
      schema={uomSchema}
      defaultValues={defaultValues}
      sections={getUomFormSections()}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New unit',
        title: isEdit
          ? 'Update this unit, then save.'
          : 'Start with a short code, then the name people will recognise.',
        description: 'Short codes are stored uppercase, e.g. KG.'
      }}
      onSubmit={onSubmit}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='uom-form-sheet'
      createLabel='Create unit'
      resetKey={getEntityId(uom) || 'new'}
    />
  );
}

export function ConversionFormSheet({ open, onOpenChange }) {
  const { data: uoms = [] } = useUomsOptionsQuery({ enabled: open });
  const uomOptions = useMemo(() => mapToOptions(uoms, codeNameLabel), [uoms]);
  const sections = useMemo(
    () => getConversionFormSections(uomOptions),
    [uomOptions]
  );
  const { mutate: createConversion, isPending } =
    useCreateUomConversionMutation({
      onSuccess: () => {
        toast.success('Conversion created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create conversion'));
      }
    });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title='New conversion'
      description='Factor is how many to-units make one from-unit, e.g. 1 KG = 1000 G.'
      schema={conversionSchema}
      defaultValues={{ fromUomId: '', toUomId: '', factor: '' }}
      sections={sections}
      intro={{
        eyebrow: 'New conversion',
        title: 'Map one unit onto another.',
        description:
          'Factor is how many to-units make one from-unit, e.g. 1 KG = 1000 G.'
      }}
      onSubmit={(values) => createConversion(compactPayload(values))}
      isPending={isPending}
      formId='uom-conversion-form'
      createLabel='Create conversion'
      resetKey='conversion'
    />
  );
}
