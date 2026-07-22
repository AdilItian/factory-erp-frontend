'use client';

import { Icons } from '@/components/icons';
import { WIZARD_STEPS } from './use-filter-wizard';
import { OPERATOR_LABELS } from './filter-schema';

export function FilterBreadcrumb({ step, draft, filterConfig, onGoToStep }) {
  const field = filterConfig?.columns?.find((c) => c.id === draft.id);

  return (
    <div className='flex items-center gap-1 text-sm font-medium text-foreground'>
      <button
        type='button'
        onClick={() => onGoToStep(WIZARD_STEPS.FIELD)}
        className='text-muted-foreground hover:text-foreground transition-colors'
      >
        Filter
      </button>

      {draft.id && (
        <>
          <Icons.chevronRight className='h-3 w-3 text-muted-foreground shrink-0' />
          <button
            type='button'
            onClick={() => onGoToStep(WIZARD_STEPS.FIELD)}
            className={
              step === WIZARD_STEPS.FIELD
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground transition-colors'
            }
          >
            {field?.label ?? draft.id}
          </button>
        </>
      )}

      {draft.op && (
        <>
          <Icons.chevronRight className='h-3 w-3 text-muted-foreground shrink-0' />
          <button
            type='button'
            onClick={() => onGoToStep(WIZARD_STEPS.OPERATOR)}
            className={
              step === WIZARD_STEPS.OPERATOR
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground transition-colors'
            }
          >
            {OPERATOR_LABELS[draft.op] ?? draft.op}
          </button>
        </>
      )}

      {step === WIZARD_STEPS.VALUE && (
        <>
          <Icons.chevronRight className='h-3 w-3 text-muted-foreground shrink-0' />
          <span className='text-foreground'>Value</span>
        </>
      )}
    </div>
  );
}
