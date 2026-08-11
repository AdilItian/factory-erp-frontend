'use client';

import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
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
        className={cn('pr-10', className)}
      />
      <button
        type='button'
        onClick={() => setShow((value) => !value)}
        className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2'
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <Icons.eyeOff className='h-4 w-4' /> : <Icons.eye className='h-4 w-4' />}
      </button>
    </div>
  );
}

function FileInput({ field, config }) {
  const inputRef = useRef(null);
  const selectedLabel = getSelectedFileLabel(field.value, config.multiple);

  function handleChange(event) {
    const files = event.target.files;

    if (config.multiple) {
      field.onChange(files ? Array.from(files) : []);
      return;
    }

    field.onChange(files?.[0] ?? null);
  }

  return (
    <div className='space-y-2'>
      <input
        ref={inputRef}
        type='file'
        accept={config.accept}
        multiple={config.multiple}
        className='hidden'
        onChange={handleChange}
      />
      <Button
        type='button'
        variant='outline'
        className='w-full justify-start gap-2'
        onClick={() => inputRef.current?.click()}
      >
        <Icons.upload className='h-4 w-4' />
        {config.placeholder ?? 'Choose file'}
      </Button>
      {selectedLabel ? (
        <p className='text-muted-foreground text-sm'>{selectedLabel}</p>
      ) : null}
    </div>
  );
}

function getSelectedFileLabel(value, multiple) {
  if (!value) return '';

  if (multiple && Array.isArray(value)) {
    if (value.length === 0) return '';
    if (value.length === 1) return value[0].name;
    return `${value.length} files selected`;
  }

  return value instanceof File ? value.name : '';
}

export default function FormField({ field, config }) {
  const { type, placeholder, options, className, checkboxLabel } = config;

  if (type === 'password') {
    return <PasswordInput field={field} placeholder={placeholder} className={className} />;
  }

  if (type === 'textarea') {
    return <Textarea {...field} placeholder={placeholder} className={className} />;
  }

  if (type === 'select') {
    const isLoading = config.loading;
    const selectItems =
      options?.map((option) => ({
        label: option.label,
        value: option.value
      })) ?? [];

    return (
      <Select
        disabled={isLoading}
        items={selectItems}
        onValueChange={field.onChange}
        value={field.value || null}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={isLoading ? 'Loading options...' : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {selectItems.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className='flex items-center gap-2'>
        <Checkbox
          id={field.name}
          checked={Boolean(field.value)}
          onCheckedChange={field.onChange}
        />
        <Label htmlFor={field.name} className='cursor-pointer font-normal'>
          {checkboxLabel ?? config.label}
        </Label>
      </div>
    );
  }

  if (type === 'file') {
    return <FileInput field={field} config={config} />;
  }

  return (
    <Input
      {...field}
      type={type === 'number' ? 'number' : type}
      placeholder={placeholder}
      className={className}
    />
  );
}
