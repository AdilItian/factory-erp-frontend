'use client';

import { Input } from '@/components/ui/input';

export function TextFilterInput({ value, onChange }) {
  return (
    <div className='p-2'>
      <Input
        autoFocus
        placeholder='Enter value...'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='h-8'
      />
    </div>
  );
}
