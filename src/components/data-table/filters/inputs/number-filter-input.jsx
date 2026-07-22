'use client';

import { Input } from '@/components/ui/input';

export function NumberFilterInput({ value, onChange, isBetween }) {
  if (isBetween) {
    const [min = '', max = ''] = Array.isArray(value) ? value : [];
    return (
      <div className='flex items-center gap-2 p-2'>
        <Input
          autoFocus
          type='number'
          placeholder='Min'
          value={min}
          onChange={(e) => onChange([e.target.value, max])}
          className='h-8'
        />
        <span className='text-muted-foreground text-sm'>–</span>
        <Input
          type='number'
          placeholder='Max'
          value={max}
          onChange={(e) => onChange([min, e.target.value])}
          className='h-8'
        />
      </div>
    );
  }

  return (
    <div className='p-2'>
      <Input
        autoFocus
        type='number'
        placeholder='Enter number...'
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className='h-8'
      />
    </div>
  );
}
