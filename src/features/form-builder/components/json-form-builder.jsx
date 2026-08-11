'use client';

import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import FormField from './form-field';
import { getFields } from '../utils/resolve-form-config';

export default function JsonFormBuilder({ config, control, errors, className }) {
  const fields = getFields(config);

  return (
    <div className={className ?? 'space-y-4'}>
      {fields.map((fieldConfig) => (
        <div key={fieldConfig.name} className='space-y-1.5'>
          {fieldConfig.type !== 'checkbox' ? (
            <Label htmlFor={fieldConfig.name}>{fieldConfig.label}</Label>
          ) : null}
          {fieldConfig.description ? (
            <p className='text-muted-foreground text-sm'>{fieldConfig.description}</p>
          ) : null}
          <Controller
            name={fieldConfig.name}
            control={control}
            render={({ field }) => (
              <FormField field={field} config={fieldConfig} />
            )}
          />
          {errors?.[fieldConfig.name] ? (
            <p className='text-destructive text-xs'>
              {errors[fieldConfig.name].message}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
