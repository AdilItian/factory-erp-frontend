'use client';

import { Calendar } from '@/components/ui/calendar';

export function DateFilterInput({ value, onChange, isBetween }) {
  if (isBetween) {
    const from = value?.[0] ? new Date(value[0]) : undefined;
    const to = value?.[1] ? new Date(value[1]) : undefined;

    return (
      <Calendar
        mode='range'
        selected={{ from, to }}
        onSelect={(range) => {
          onChange([
            range?.from ? range.from.toISOString().split('T')[0] : null,
            range?.to ? range.to.toISOString().split('T')[0] : null
          ]);
        }}
        numberOfMonths={1}
      />
    );
  }

  const selected = value ? new Date(value) : undefined;

  return (
    <Calendar
      mode='single'
      selected={selected}
      onSelect={(date) => onChange(date ? date.toISOString().split('T')[0] : null)}
    />
  );
}
