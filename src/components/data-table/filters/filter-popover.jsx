'use client';

import { useState, useCallback } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import { FilterButton } from './filter-button';
import { FilterBreadcrumb } from './filter-breadcrumb';
import { FilterChips } from './filter-chips';
import { FieldStep } from './steps/field-step';
import { OperatorStep } from './steps/operator-step';
import { ValueStep } from './steps/value-step';
import { useFilterWizard, WIZARD_STEPS } from './use-filter-wizard';
import { NO_VALUE_OPERATORS } from './filter-schema';

/**
 * Self-contained SQL-style filter builder.
 *
 * Props:
 *  - filterConfig: { columns: [{ id, label, type, options? }] }
 *  - conditions: FilterCondition[]   (current active filters)
 *  - onChange: (conditions) => void  (called on every add/edit/remove)
 */
export function FilterPopover({ filterConfig, conditions = [], onChange }) {
  const [open, setOpen] = useState(false);

  const handleApply = useCallback(
    (draft, editingIndex) => {
      const next = [...conditions];
      if (editingIndex !== null && editingIndex >= 0) {
        next[editingIndex] = draft;
      } else {
        next.push(draft);
      }
      onChange(next);
      setOpen(false);
    },
    [conditions, onChange]
  );

  const handleRemove = useCallback(
    (index) => {
      onChange(conditions.filter((_, i) => i !== index));
    },
    [conditions, onChange]
  );

  const handleClearAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  const {
    step,
    draft,
    reset,
    selectField,
    selectOperator,
    setValue,
    applyFilter,
    editFilter,
    goToStep,
    goBack
  } = useFilterWizard({ onApply: handleApply, onRemove: handleRemove });

  function handleOpenChange(next) {
    setOpen(next);
    if (!next) reset();
  }

  function handleEdit(condition, index) {
    editFilter(condition, index);
    setOpen(true);
  }

  const activeField = filterConfig.columns.find((c) => c.id === draft.id);
  const canApply =
    draft.id && draft.op && !NO_VALUE_OPERATORS.has(draft.op)
      ? draft.v !== null && draft.v !== '' && !(Array.isArray(draft.v) && draft.v.length === 0)
      : false;

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-wrap items-center gap-2'>
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger render={<span />}>
            <FilterButton activeCount={conditions.length} onClick={() => setOpen(true)} />
          </PopoverTrigger>
          <PopoverContent className='w-md p-0' align='start' side='bottom' sideOffset={8}>
            {/* Header */}
            <div className='flex items-center justify-between px-3 py-2'>
              <FilterBreadcrumb
                step={step}
                draft={draft}
                filterConfig={filterConfig}
                onGoToStep={goToStep}
              />
              {step !== WIZARD_STEPS.FIELD && (
                <button
                  type='button'
                  onClick={goBack}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                  aria-label='Go back'
                >
                  <Icons.chevronLeft className='h-4 w-4' />
                </button>
              )}
            </div>

            <Separator />

            {/* Step content */}
            <div className='min-h-[160px]'>
              {step === WIZARD_STEPS.FIELD && (
                <FieldStep filterConfig={filterConfig} onSelect={selectField} />
              )}
              {step === WIZARD_STEPS.OPERATOR && activeField && (
                <OperatorStep fieldType={activeField.type} onSelect={selectOperator} />
              )}
              {step === WIZARD_STEPS.VALUE && activeField && (
                <ValueStep
                  fieldType={activeField.type}
                  operator={draft.op}
                  value={draft.v}
                  options={activeField.options}
                  onChange={setValue}
                />
              )}
            </div>

            {/* Footer — apply button for value step */}
            {step === WIZARD_STEPS.VALUE && (
              <>
                <Separator />
                <div className='flex justify-end gap-2 px-3 py-2'>
                  <Button variant='ghost' size='sm' onClick={() => handleOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button size='sm' disabled={!canApply} onClick={applyFilter}>
                    Apply
                  </Button>
                </div>
              </>
            )}
          </PopoverContent>
        </Popover>

        {/* Active filter chips */}
        <FilterChips
          conditions={conditions}
          filterConfig={filterConfig}
          onEdit={handleEdit}
          onRemove={handleRemove}
          onClearAll={handleClearAll}
        />
      </div>
    </div>
  );
}
