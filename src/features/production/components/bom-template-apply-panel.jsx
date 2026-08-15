'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import {
  FormSection,
  SOFT_FIELD_CLASS,
  SOFT_LABEL_CLASS,
  SOFT_SELECT_CLASS
} from '@/components/erp/form-sections';
import { cn } from '@/lib/utils';
import { codeNameLabel, getEntityId, getEntityName } from '@/lib/entity';
import { valuesFromTemplateApply } from '../utils/bom-template';

export function BomTemplateApplyPanel({
  templates = [],
  setValue,
  onLinesChange
}) {
  const [templateId, setTemplateId] = useState('');
  const [qty, setQty] = useState('1');
  const [appliedName, setAppliedName] = useState('');

  const options = useMemo(
    () =>
      templates.map((row) => ({
        value: getEntityId(row),
        label: `${codeNameLabel(row)}${row.item ? ` · ${getEntityName(row.item)}` : ''}`
      })),
    [templates]
  );

  function apply() {
    const template = templates.find(
      (row) => getEntityId(row) === String(templateId)
    );
    if (!template) return;
    const applied = valuesFromTemplateApply(template, qty);
    if (!applied) return;
    setValue('itemId', applied.itemId, { shouldDirty: true });
    setValue('name', applied.name, { shouldDirty: true });
    setValue('outputQty', applied.outputQty, { shouldDirty: true });
    setValue('version', applied.version, { shouldDirty: true });
    setValue('isActive', true, { shouldDirty: true });
    if (!applied.code) {
      // leave code for the user — suggest from template code
      setValue('code', `${template.code || 'BOM'}-${qty}`, {
        shouldDirty: true
      });
    }
    onLinesChange(applied.lines);
    setAppliedName(getEntityName(template));
  }

  return (
    <FormSection
      section={{
        id: 'from-template',
        title: 'From template',
        description:
          'Pick a per-piece recipe and how many finished pieces — components fill in scaled.',
        icon: 'bomTemplate',
        fields: []
      }}
    >
      <div className='space-y-4 p-4'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2 sm:col-span-2'>
            <Label className={SOFT_LABEL_CLASS}>Template</Label>
            <Select
              items={options}
              value={templateId || null}
              onValueChange={setTemplateId}
            >
              <SelectTrigger className={cn(SOFT_SELECT_CLASS, 'w-full')}>
                <SelectValue placeholder='Select a BoM template' />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label className={SOFT_LABEL_CLASS}>Finished pieces</Label>
            <Input
              className={SOFT_FIELD_CLASS}
              value={qty}
              onChange={(event) => setQty(event.target.value)}
              placeholder='500'
              inputMode='decimal'
            />
          </div>
          <div className='flex items-end'>
            <Button
              type='button'
              variant='outline'
              className='w-full'
              disabled={!templateId || !qty}
              onClick={apply}
            >
              <Icons.bomTemplate className='mr-2 h-4 w-4' />
              Prefill from template
            </Button>
          </div>
        </div>
        {appliedName ? (
          <p className='text-muted-foreground text-xs'>
            Loaded “{appliedName}” for {qty} pc — tweak lines below if needed.
          </p>
        ) : null}
      </div>
    </FormSection>
  );
}
