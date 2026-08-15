'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CrudFormSheet } from '@/components/erp/crud-form-sheet';
import { compactPayload } from '@/lib/compact-payload';
import {
  codeNameLabel,
  getEntityId,
  getEntityName,
  isEntityActive,
  mapToOptions,
  refId
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import productionService from '../api/service';
import { useWorkCentersOptionsQuery } from '../api/queries';
import {
  useCreateBomTemplateMutation,
  useUpdateBomTemplateMutation
} from '../api/mutations';
import {
  BOM_TEMPLATE_DEFAULTS,
  bomTemplateSchema,
  getBomTemplateFormSections
} from '../constants/bom-template-form-config';
import {
  BomComponentsEditor,
  toBomLinesPayload
} from './bom-components-editor';

function valuesFromTemplate(row) {
  if (!row) return BOM_TEMPLATE_DEFAULTS;
  return {
    code: row.code ?? '',
    name: getEntityName(row, ''),
    itemId: refId(row.itemId) || refId(row.item),
    baseQty: String(row.baseQty ?? '1'),
    notes: row.notes ?? '',
    isActive: isEntityActive(row)
  };
}

export function BomTemplateFormSheet({ template, open, onOpenChange }) {
  const isEdit = Boolean(template);
  const catalog = productionService.getCatalog();
  const [lines, setLines] = useState([]);
  const { data: workCenters = [] } = useWorkCentersOptionsQuery({
    enabled: open
  });
  const itemOptions = useMemo(
    () => mapToOptions(catalog.items, codeNameLabel),
    [catalog.items]
  );
  const workCenterOptions = useMemo(
    () => mapToOptions(workCenters, codeNameLabel),
    [workCenters]
  );
  const sections = useMemo(
    () => getBomTemplateFormSections(itemOptions),
    [itemOptions]
  );
  const defaultValues = useMemo(
    () => valuesFromTemplate(template),
    [template]
  );

  useEffect(() => {
    if (!open) return;
    setLines(
      Array.isArray(template?.lines)
        ? template.lines.map((line) => ({ ...line }))
        : []
    );
  }, [open, template]);

  const { mutate: createRow, isPending: isCreating } =
    useCreateBomTemplateMutation({
      onSuccess: () => {
        toast.success('BoM template created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create template'));
      }
    });
  const { mutate: updateRow, isPending: isUpdating } =
    useUpdateBomTemplateMutation({
      onSuccess: () => {
        toast.success('BoM template updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update template'));
      }
    });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit BoM template' : 'New BoM template'}
      description='Define how much of each component one finished piece needs. Use this later to prefill BoMs.'
      schema={bomTemplateSchema}
      defaultValues={defaultValues}
      sections={sections}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New template',
        title: isEdit
          ? 'Update this per-piece recipe, then save.'
          : 'Configure once for a finished good — apply it when creating BoMs.',
        description:
          'Base qty is usually 1. Component quantities are for that base.'
      }}
      extra={
        <BomComponentsEditor
          catalog={catalog}
          itemOptions={itemOptions}
          workCenterOptions={workCenterOptions}
          lines={lines}
          onChange={setLines}
          listTitle='On this template'
          listDescription='Per-piece lines — BoMs scale these by finished quantity.'
          emptyMessage='No components yet — add what one finished piece needs.'
        />
      }
      onSubmit={(values) => {
        const payload = {
          ...compactPayload(values),
          lines: toBomLinesPayload(lines)
        };
        if (isEdit) {
          updateRow({ id: getEntityId(template), payload });
          return;
        }
        createRow(payload);
      }}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='bom-template-form'
      createLabel='Create template'
      resetKey={getEntityId(template) || 'new'}
    />
  );
}
