'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormBuilder from '@/components/ui/form-builder';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { FormSection, styleField } from '@/components/erp/form-sections';
import { compactPayload } from '@/lib/compact-payload';
import { getEntityId } from '@/lib/entity';
import {
  BOM_LINE_DEFAULTS,
  bomLineSchema,
  getBomLineFormSections
} from '../constants/bom-form-config';
import { formatBomLine } from '../utils/bom-label';

function workCenterLabel(line, workCenterOptions) {
  if (!line.workCenterId) return 'No work center';
  const match = workCenterOptions.find(
    (option) => option.value === String(line.workCenterId)
  );
  return match?.label || `Used at ${line.workCenterId}`;
}

export function BomComponentsEditor({
  catalog,
  itemOptions,
  workCenterOptions = [],
  lines,
  onChange,
  listTitle = 'On this recipe',
  listDescription = 'These lines save with the BoM.',
  emptyMessage = 'No components yet — add fabric, buttons, zips, or thread above.'
}) {
  const sections = getBomLineFormSections(itemOptions, workCenterOptions);
  const section = sections[0];
  const fields = (section.fields ?? []).map(styleField);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(bomLineSchema),
    defaultValues: BOM_LINE_DEFAULTS
  });

  function addLine(values) {
    const payload = compactPayload(values);
    const item = catalog.items.find(
      (row) => getEntityId(row) === String(payload.itemId)
    );
    onChange([
      ...lines,
      {
        id: crypto.randomUUID(),
        itemId: payload.itemId,
        item,
        quantity: payload.quantity,
        scrapPercent: payload.scrapPercent || '0',
        workCenterId: payload.workCenterId || ''
      }
    ]);
    reset(BOM_LINE_DEFAULTS);
  }

  return (
    <div
      className='space-y-5'
      onKeyDown={(event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        event.stopPropagation();
        handleSubmit(addLine)();
      }}
    >
      <FormSection
        section={{ ...section, fields: [] }}
        control={control}
        errors={errors}
      >
        <div className='space-y-4 p-4'>
          <FormBuilder
            control={control}
            errors={errors}
            fields={fields}
            className='grid gap-4 space-y-0 sm:grid-cols-2'
          />
          <Button
            type='button'
            variant='outline'
            onClick={handleSubmit(addLine)}
          >
            <Icons.add className='mr-2 h-4 w-4' />
            Add component
          </Button>
        </div>
      </FormSection>

      <FormSection
        section={{
          id: 'added',
          title: listTitle,
          description: listDescription,
          icon: 'bom',
          fields: []
        }}
        control={control}
        errors={errors}
      >
        {lines.length === 0 ? (
          <p className='text-muted-foreground px-4 py-3 text-sm'>
            {emptyMessage}
          </p>
        ) : (
          <div className='divide-border divide-y'>
            {lines.map((line) => (
              <div
                key={line.id}
                className='flex items-center justify-between gap-3 px-4 py-2.5'
              >
                <div className='min-w-0'>
                  <p className='truncate text-sm font-medium'>
                    {formatBomLine(line)}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    {workCenterLabel(line, workCenterOptions)}
                  </p>
                </div>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='text-muted-foreground size-8'
                  onClick={() =>
                    onChange(lines.filter((row) => row.id !== line.id))
                  }
                >
                  <Icons.trash className='size-4' />
                </Button>
              </div>
            ))}
          </div>
        )}
      </FormSection>
    </div>
  );
}

export function toBomLinesPayload(lines = []) {
  return lines.map((line) =>
    compactPayload({
      id: line.id,
      itemId: line.itemId,
      quantity: String(line.quantity ?? ''),
      scrapPercent: line.scrapPercent,
      workCenterId: line.workCenterId
    })
  );
}
