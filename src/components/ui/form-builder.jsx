'use client';

import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

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

function parseDateValue(value) {
  if (!value) return undefined;

  const raw = String(value).trim();
  if (!raw) return undefined;

  const dateOnly = raw.length >= 10 ? raw.slice(0, 10) : raw;
  const date = new Date(`${dateOnly}T12:00:00`);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toDateValue(date) {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd');
}

function DatePickerInput({ field, placeholder, className }) {
  const [open, setOpen] = useState(false);
  const selected = parseDateValue(field.value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type='button'
            variant='outline'
            className={cn(
              'w-full justify-start text-left font-normal',
              !selected && 'text-muted-foreground',
              className
            )}
          />
        }
      >
        <Icons.calendar className='mr-2 size-4 shrink-0 opacity-70' />
        <span className='truncate'>
          {selected
            ? format(selected, 'MMM d, yyyy')
            : placeholder || 'Pick a date'}
        </span>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={selected}
          onSelect={(date) => {
            field.onChange(toDateValue(date));
            setOpen(false);
          }}
          initialFocus
        />
        {selected ? (
          <div className='border-t p-2'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='w-full'
              onClick={() => {
                field.onChange('');
                setOpen(false);
              }}
            >
              Clear date
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
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

  if (type === 'date') {
    return (
      <DatePickerInput
        field={field}
        placeholder={placeholder}
        className={className}
      />
    );
  }

  if (type === 'select') {
    const selectItems =
      options?.map((opt) => ({
        label: opt.label,
        value: opt.value
      })) ?? [];

    return (
      <Select
        items={selectItems}
        onValueChange={field.onChange}
        value={field.value || null}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {selectItems.map((opt) => (
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
 *   type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date',
 *   placeholder?: string,
 *   options?: [{ label, value }],   // for select
 *   checkboxLabel?: string,         // for checkbox
 *   className?: string,
 * }
 */
export default function FormBuilder({ control, errors, fields, className }) {
  return (
    <div className={cn('space-y-4', className)}>
      {fields.map((config) => (
        <div
          key={config.name}
          className={cn('space-y-1.5', config.wrapperClassName)}
        >
          {config.type !== 'checkbox' && (
            <Label htmlFor={config.name} className={config.labelClassName}>
              {config.label}
            </Label>
          )}
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
