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
import { FormSection, SectionedForm } from '@/components/erp/form-sections';

export function LinesSheet({
  open,
  onOpenChange,
  title,
  description,
  intro,
  schema,
  defaultValues,
  fields,
  sections,
  rows = [],
  renderRow,
  emptyMessage = 'No lines yet.',
  listTitle = 'Added',
  listDescription = 'These lines are already on this record.',
  listIcon = 'package',
  onAdd,
  isPending = false,
  formId = 'lines-sheet-form',
  addLabel = 'Add line'
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues
  });

  const defaultValuesRef = useRef(defaultValues);
  defaultValuesRef.current = defaultValues;

  useEffect(() => {
    reset(defaultValuesRef.current);
  }, [open, reset]);

  const resolvedSections =
    sections ??
    (fields?.length
      ? [
          {
            id: 'line',
            title: 'New line',
            description: 'Fill these in, then add.',
            icon: 'package',
            fields,
            columns: 2
          }
        ]
      : []);

  const resolvedIntro = intro ?? {
    eyebrow: 'New line',
    title: 'Add one row at a time.',
    description: description || 'Save each line before starting the next.'
  };

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
              onAdd(values);
              reset(defaultValuesRef.current);
            })}
            intro={resolvedIntro}
            sections={resolvedSections}
            control={control}
            errors={errors}
            extra={
              <FormSection
                section={{
                  id: 'added',
                  title: listTitle,
                  description: listDescription,
                  icon: listIcon,
                  fields: []
                }}
                control={control}
                errors={errors}
              >
                {rows.length === 0 ? (
                  <p className='text-muted-foreground px-4 py-3 text-sm'>
                    {emptyMessage}
                  </p>
                ) : (
                  <div className='divide-border divide-y'>{rows.map(renderRow)}</div>
                )}
              </FormSection>
            }
          />
        </div>

        <SheetFooter className='bg-muted/20 border-t px-6 py-4 sm:flex-row sm:justify-end'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Done
          </Button>
          <LoadingButton
            type='submit'
            form={formId}
            isLoading={isPending}
            loadingText='Adding...'
          >
            <Icons.add className='mr-2 h-4 w-4' />
            {addLabel}
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
