'use client';

import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Icons } from '@/components/icons';

function PasswordInput({ field, placeholder, className }) {
  const [show, setShow] = useState(false);
  return (
    <div className='relative'>
      <Input
        {...field}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        className={`pr-10 ${className ?? ''}`}
      />
      <button
        type='button'
        onClick={() => setShow((v) => !v)}
        className='text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2'
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <Icons.eyeOff className='h-4 w-4' /> : <Icons.eye className='h-4 w-4' />}
      </button>
    </div>
  );
}

function FieldInput({ field, config }) {
  const { type, placeholder, options, className } = config;

  if (type === 'password') {
    return <PasswordInput field={field} placeholder={placeholder} className={className} />;
  }

  if (type === 'textarea') {
    return <Textarea {...field} placeholder={placeholder} className={className} />;
  }

  if (type === 'select') {
    return (
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className='flex items-center gap-2'>
        <Checkbox id={field.name} checked={field.value} onCheckedChange={field.onChange} />
        <Label htmlFor={field.name} className='cursor-pointer font-normal'>
          {config.checkboxLabel}
        </Label>
      </div>
    );
  }

  return <Input {...field} type={type ?? 'text'} placeholder={placeholder} className={className} />;
}

/**
 * FormBuilder — renders form fields from a config array.
 *
 * @param {object} props
 * @param {object} props.control         — react-hook-form control object
 * @param {object} props.errors          — react-hook-form errors object
 * @param {Array}  props.fields          — array of field config objects
 *
 * Field config shape:
 * {
 *   name: string,
 *   label: string,
 *   type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox',
 *   placeholder?: string,
 *   options?: [{ label, value }],   // for select
 *   checkboxLabel?: string,         // for checkbox
 *   className?: string,
 * }
 */
export default function FormBuilder({ control, errors, fields }) {
  return (
    <div className='space-y-4'>
      {fields.map((config) => (
        <div key={config.name} className='space-y-1.5'>
          {config.type !== 'checkbox' && <Label htmlFor={config.name}>{config.label}</Label>}
          <Controller
            name={config.name}
            control={control}
            render={({ field }) => <FieldInput field={field} config={config} />}
          />
          {errors[config.name] && (
            <p className='text-destructive text-xs'>{errors[config.name].message}</p>
          )}
        </div>
      ))}
    </div>
  );
}
