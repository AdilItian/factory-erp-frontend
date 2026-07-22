import { FILTER_TYPES, OPERATORS, OPERATOR_LABELS, NO_VALUE_OPERATORS } from './filter-schema';

const MAX_ENUM_SHOWN = 2;

/**
 * Formats a filter condition into a human-readable chip label.
 * Returns { fieldLabel, operatorLabel, valueLabel }
 */
export function formatChipParts(condition, filterConfig) {
  const col = filterConfig.columns.find((c) => c.id === condition.id);
  const fieldLabel = col?.label ?? condition.id;
  const operatorLabel = OPERATOR_LABELS[condition.op] ?? condition.op;

  if (NO_VALUE_OPERATORS.has(condition.op)) {
    return { fieldLabel, operatorLabel, valueLabel: null };
  }

  const v = condition.v;
  let valueLabel = '';

  if (col?.type === FILTER_TYPES.ENUM && Array.isArray(v)) {
    const labels = v.map((val) => {
      const opt = col.options?.find((o) => o.value === val);
      return opt?.label ?? val;
    });
    if (labels.length <= MAX_ENUM_SHOWN) {
      valueLabel = labels.join(', ');
    } else {
      valueLabel = `${labels.slice(0, MAX_ENUM_SHOWN).join(', ')} +${labels.length - MAX_ENUM_SHOWN}`;
    }
  } else if (
    col?.type === FILTER_TYPES.DATE &&
    condition.op === OPERATORS.BETWEEN &&
    Array.isArray(v)
  ) {
    const [from, to] = v;
    valueLabel = `${from ?? '?'} – ${to ?? '?'}`;
  } else if (
    col?.type === FILTER_TYPES.NUMBER &&
    condition.op === OPERATORS.BETWEEN &&
    Array.isArray(v)
  ) {
    const [min, max] = v;
    valueLabel = `${min ?? '?'} – ${max ?? '?'}`;
  } else {
    valueLabel = String(v ?? '');
  }

  return { fieldLabel, operatorLabel, valueLabel };
}
