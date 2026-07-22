'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { OPERATORS_BY_TYPE, OPERATOR_LABELS } from '../filter-schema';

export function OperatorStep({ fieldType, onSelect }) {
  const operators = OPERATORS_BY_TYPE[fieldType] ?? [];

  return (
    <Command>
      <CommandInput placeholder='Search operators...' autoFocus />
      <CommandList>
        <CommandEmpty>No operators found.</CommandEmpty>
        <CommandGroup>
          {operators.map((op) => (
            <CommandItem key={op} value={OPERATOR_LABELS[op]} onSelect={() => onSelect(op)}>
              {OPERATOR_LABELS[op]}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
