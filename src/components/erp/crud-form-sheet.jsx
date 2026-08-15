'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/ui/loading-button';
import { Icons } from '@/components/icons';
import { SectionedForm } from '@/components/erp/form-sections';

export function CrudFormSheet({
  open,
  onOpenChange,
  title,
  description,
  schema,
  defaultValues,
  fields,
  sections,
  intro,
  onSubmit,
  isPending,
  isEdit = false,
  formId = 'crud-form-sheet',
  createLabel = 'Create',
  saveLabel = 'Save changes',
  loadingText,
  extra,
  extraPosition = 'end',
  resetKey,
  resetAfterSubmit = false
}) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues
  });

  const defaultValuesRef = useRef(defaultValues);
  defaultValuesRef.current = defaultValues;

  useEffect(() => {
    reset(defaultValuesRef.current);
  }, [open, resetKey, reset]);

  const resolvedSections =
    sections ??
    (fields?.length
      ? [
          {
            id: 'details',
            title: 'Details',
            description: description || 'Fill in the fields below.',
            icon: 'settings',
            fields
          }
        ]
      : []);

  const resolvedIntro = intro ?? {
    eyebrow: isEdit ? 'Editing' : 'New',
    title: isEdit
      ? 'Update these details, then save.'
      : 'Start with the essentials, then fill what you know.',
    description: isEdit
      ? 'Soft changes only — save when the details feel right.'
      : 'This matches the edit layout, so nothing is hidden on create.'
  };

  const resolvedExtra =
    typeof extra === 'function'
      ? extra({ control, setValue, watch, getValues, errors })
      : extra;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col gap-0 border-l p-0 sm:max-w-xl'>
        <SheetHeader className='border-b px-6 py-5 text-left'>
          <SheetTitle className='text-base font-semibold tracking-tight'>
            {title}
          </SheetTitle>
          {description ? (
            <SheetDescription>{description}</SheetDescription>
          ) : null}
        </SheetHeader>

        <div className='min-h-0 flex-1 overflow-y-auto px-6 py-5'>
          <SectionedForm
            formId={formId}
            onSubmit={handleSubmit((values) => {
              onSubmit(values);
              if (resetAfterSubmit) reset(defaultValuesRef.current);
            })}
            intro={resolvedIntro}
            sections={resolvedSections}
            control={control}
            errors={errors}
            extra={resolvedExtra}
            extraPosition={extraPosition}
          />
        </div>

        <SheetFooter className='bg-muted/20 border-t px-6 py-4 sm:flex-row sm:justify-end'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            type='submit'
            form={formId}
            isLoading={isPending}
            loadingText={
              loadingText || (isEdit ? 'Saving...' : 'Creating...')
            }
          >
            {isEdit ? (
              <>
                <Icons.check className='mr-2 h-4 w-4' />
                {saveLabel}
              </>
            ) : (
              <>
                <Icons.add className='mr-2 h-4 w-4' />
                {createLabel}
              </>
            )}
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
