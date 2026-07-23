'use client';

import { FILTER_TYPES, OPERATORS } from '../filter-schema';
import { TextFilterInput } from '../inputs/text-filter-input';
import { NumberFilterInput } from '../inputs/number-filter-input';
import { DateFilterInput } from '../inputs/date-filter-input';
import { MultiSelectFilterInput } from '../inputs/multi-select-filter-input';
import { RadioSelectFilterInput } from '../inputs/radio-select-filter-input';

export function ValueStep({ fieldType, operator, value, options, onChange }) {
  if (fieldType === FILTER_TYPES.TEXT) {
    return <TextFilterInput value={value ?? ''} onChange={onChange} />;
  }

  if (fieldType === FILTER_TYPES.NUMBER) {
    return (
      <NumberFilterInput
        value={value}
        onChange={onChange}
        isBetween={operator === OPERATORS.BETWEEN}
      />
    );
  }

  if (fieldType === FILTER_TYPES.DATE) {
    return (
      <DateFilterInput
        value={value}
        onChange={onChange}
        isBetween={operator === OPERATORS.BETWEEN}
      />
    );
  }

  if (fieldType === FILTER_TYPES.ENUM) {
    return (
      <MultiSelectFilterInput
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
        options={options ?? []}
      />
    );
  }

  if (fieldType === FILTER_TYPES.SELECT) {
    return (
      <RadioSelectFilterInput
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
        options={options ?? []}
      />
    );
  }

  return null;
}
