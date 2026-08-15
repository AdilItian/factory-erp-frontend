'use client';

import { useEffect, useMemo, useState } from 'react';
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
  isEntityActive,
  mapToOptions,
  refId
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import productionService from '../api/service';
import {
  useBomDetailQuery,
  useBomTemplatesOptionsQuery,
  useWorkCentersOptionsQuery
} from '../api/queries';
import {
  useAddBomLineMutation,
  useCreateBomMutation,
  useRemoveBomLineMutation,
  useUpdateBomMutation
} from '../api/mutations';
import {
  BOM_DEFAULTS,
  BOM_LINE_DEFAULTS,
  bomLineSchema,
  bomSchema,
  getBomFormSections,
  getBomLineFormSections
} from '../constants/bom-form-config';
import { formatBomLine } from '../utils/bom-label';
import {
  BomComponentsEditor,
  toBomLinesPayload
} from './bom-components-editor';
import { BomTemplateApplyPanel } from './bom-template-apply-panel';

function valuesFromBom(row) {
  if (!row) return BOM_DEFAULTS;
  return {
    code: row.code ?? '',
    name: getEntityName(row, ''),
    itemId: refId(row.itemId) || refId(row.item),
    version: row.version ?? '1',
    outputQty: String(row.outputQty ?? '1'),
    isActive: isEntityActive(row)
  };
}

export function BomFormSheet({ bom, open, onOpenChange }) {
  const isEdit = Boolean(bom);
  const catalog = productionService.getCatalog();
  const [lines, setLines] = useState([]);
  const { data: workCenters = [] } = useWorkCentersOptionsQuery({
    enabled: open
  });
  const { data: templates = [] } = useBomTemplatesOptionsQuery({
    enabled: open && !isEdit
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
    () => getBomFormSections(itemOptions),
    [itemOptions]
  );
  const defaultValues = useMemo(() => valuesFromBom(bom), [bom]);

  useEffect(() => {
    if (!open) return;
    setLines(
      Array.isArray(bom?.lines) ? bom.lines.map((line) => ({ ...line })) : []
    );
  }, [open, bom]);

  const { mutate: createRow, isPending: isCreating } = useCreateBomMutation({
    onSuccess: () => {
      toast.success('BoM created');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to create BoM'));
    }
  });
  const { mutate: updateRow, isPending: isUpdating } = useUpdateBomMutation({
    onSuccess: () => {
      toast.success('BoM updated');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update BoM'));
    }
  });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit BoM' : 'New BoM'}
      description='Add the finished good, then each raw material this recipe consumes — or start from a template.'
      schema={bomSchema}
      defaultValues={defaultValues}
      sections={sections}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New bill of materials',
        title: isEdit
          ? 'Update this recipe, then save.'
          : 'Start from a template for speed, or build the recipe by hand.',
        description:
          'Output qty is how many finished pieces this BoM covers. Template lines scale to that qty.'
      }}
      extra={({ setValue }) => (
        <>
          {!isEdit ? (
            <BomTemplateApplyPanel
              templates={templates}
              setValue={setValue}
              onLinesChange={setLines}
            />
          ) : null}
          <BomComponentsEditor
            catalog={catalog}
            itemOptions={itemOptions}
            workCenterOptions={workCenterOptions}
            lines={lines}
            onChange={setLines}
          />
        </>
      )}
      onSubmit={(values) => {
        const payload = {
          ...compactPayload(values),
          lines: toBomLinesPayload(lines)
        };
        if (isEdit) {
          updateRow({ id: getEntityId(bom), payload });
          return;
        }
        createRow(payload);
      }}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='bom-form'
      createLabel='Create BoM'
      resetKey={getEntityId(bom) || 'new'}
    />
  );
}

export function BomLinesSheet({ bom, open, onOpenChange }) {
  const bomId = getEntityId(bom);
  const catalog = productionService.getCatalog();
  const { data: detail } = useBomDetailQuery(bomId, {
    enabled: open && Boolean(bomId)
  });
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
    () => getBomLineFormSections(itemOptions, workCenterOptions),
    [itemOptions, workCenterOptions]
  );
  const lines = detail?.lines ?? bom?.lines ?? [];

  const { mutate: addLine, isPending } = useAddBomLineMutation({
    onSuccess: () => toast.success('Component added'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to add component'));
    }
  });
  const { mutate: removeLine } = useRemoveBomLineMutation({
    onSuccess: () => toast.success('Component removed'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to remove component'));
    }
  });

  return (
    <LinesSheet
      open={open}
      onOpenChange={onOpenChange}
      title='BoM components'
      description={`How much of each raw material one ${getEntityName(bom)} needs.`}
      schema={bomLineSchema}
      defaultValues={BOM_LINE_DEFAULTS}
      sections={sections}
      intro={{
        eyebrow: 'Recipe line',
        title: 'Add one component at a time.',
        description: 'Fabric, buttons, zips, thread — each is a line on this BoM.'
      }}
      listTitle='On this recipe'
      listDescription='Remove a line if this finished piece no longer needs it.'
      listIcon='bom'
      rows={lines}
      emptyMessage='No components yet.'
      addLabel='Add component'
      isPending={isPending}
      formId='bom-line-form'
      onAdd={(values) =>
        addLine({ id: bomId, payload: compactPayload(values) })
      }
      renderRow={(line) => (
        <div
          key={line.id}
          className='flex items-center justify-between gap-3 px-4 py-2.5'
        >
          <div className='min-w-0'>
            <p className='truncate text-sm font-medium'>
              {formatBomLine(line)}
            </p>
            <p className='text-muted-foreground text-xs'>
              {line.workCenterId ? `Used at ${line.workCenterId}` : 'No work center'}
            </p>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='text-muted-foreground size-8'
            onClick={() => removeLine({ id: bomId, lineId: line.id })}
          >
            <Icons.trash className='size-4' />
          </Button>
        </div>
      )}
    />
  );
}
