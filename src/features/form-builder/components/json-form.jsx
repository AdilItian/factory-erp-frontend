'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@/components/ui/loading-button';
import JsonFormBuilder from './json-form-builder';
import {
  buildDefaultValues,
  buildFormSchema
} from '../utils/build-form-schema';
import { getFields, resolveFormConfig } from '../utils/resolve-form-config';
import { useFormOptions } from '../hooks/use-form-options';

export default function JsonForm({
  config,
  fieldOptions: fieldOptionsProp,
  fieldOptionsLoading: fieldOptionsLoadingProp,
  onSubmit,
  submitLabel = 'Submit',
  submitButtonClassName,
  loadingText = 'Submitting...',
  className,
  formClassName
}) {
  const autoOptions = useFormOptions(config);
  const fieldOptions = {
    ...autoOptions.fieldOptions,
    ...fieldOptionsProp
  };
  const fieldOptionsLoading = {
    ...autoOptions.fieldOptionsLoading,
    ...fieldOptionsLoadingProp
  };

  const resolvedConfig = useMemo(
    () => resolveFormConfig(config, fieldOptions, fieldOptionsLoading),
    [config, fieldOptions, fieldOptionsLoading]
  );
  const fields = getFields(resolvedConfig);
  const schema = buildFormSchema(fields);
  const defaultValues = buildDefaultValues(fields);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues
  });

  return (
    <form
      className={formClassName ?? 'space-y-6'}
      onSubmit={handleSubmit(onSubmit)}
    >
      <JsonFormBuilder
        config={fields}
        control={control}
        errors={errors}
        className={className}
      />
      <LoadingButton
        type='submit'
        className={submitButtonClassName ?? 'w-full sm:w-auto'}
        isLoading={isSubmitting}
        loadingText={loadingText}
      >
        {submitLabel}
      </LoadingButton>
    </form>
  );
}
