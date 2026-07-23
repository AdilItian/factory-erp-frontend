import { z } from 'zod';

export const FILTER_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  ENUM: 'enum',
  BOOLEAN: 'boolean',
  SELECT: 'select'
};

export const OPERATORS = {
  // text
  CONTAINS: 'contains',
  NOT_CONTAINS: 'notContains',
  EQ: 'eq',
  NEQ: 'neq',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
  IS_EMPTY: 'isEmpty',
  IS_NOT_EMPTY: 'isNotEmpty',
  // number
  GT: 'gt',
  GTE: 'gte',
  LT: 'lt',
  LTE: 'lte',
  BETWEEN: 'between',
  // date
  IS: 'is',
  BEFORE: 'before',
  AFTER: 'after',
  ON_OR_BEFORE: 'onOrBefore',
  ON_OR_AFTER: 'onOrAfter',
  // enum
  IN: 'in',
  NOT_IN: 'notIn',
  // boolean
  IS_TRUE: 'isTrue',
  IS_FALSE: 'isFalse',
  // select (single, LIKE)
  LIKE: 'like'
};

// Human-readable labels for each operator
export const OPERATOR_LABELS = {
  [OPERATORS.CONTAINS]: 'contains',
  [OPERATORS.NOT_CONTAINS]: 'does not contain',
  [OPERATORS.EQ]: 'is exactly',
  [OPERATORS.NEQ]: 'is not',
  [OPERATORS.STARTS_WITH]: 'starts with',
  [OPERATORS.ENDS_WITH]: 'ends with',
  [OPERATORS.IS_EMPTY]: 'is empty',
  [OPERATORS.IS_NOT_EMPTY]: 'is not empty',
  [OPERATORS.GT]: 'is greater than',
  [OPERATORS.GTE]: 'is greater than or equal',
  [OPERATORS.LT]: 'is less than',
  [OPERATORS.LTE]: 'is less than or equal',
  [OPERATORS.BETWEEN]: 'is between',
  [OPERATORS.IS]: 'is',
  [OPERATORS.BEFORE]: 'is before',
  [OPERATORS.AFTER]: 'is after',
  [OPERATORS.ON_OR_BEFORE]: 'is on or before',
  [OPERATORS.ON_OR_AFTER]: 'is on or after',
  [OPERATORS.IN]: 'is any of',
  [OPERATORS.NOT_IN]: 'is none of',
  [OPERATORS.IS_TRUE]: 'is true',
  [OPERATORS.IS_FALSE]: 'is false',
  [OPERATORS.LIKE]: 'is'
};

// Operators available per field type
export const OPERATORS_BY_TYPE = {
  [FILTER_TYPES.TEXT]: [
    OPERATORS.CONTAINS,
    OPERATORS.NOT_CONTAINS,
    OPERATORS.EQ,
    OPERATORS.NEQ,
    OPERATORS.STARTS_WITH,
    OPERATORS.ENDS_WITH,
    OPERATORS.IS_EMPTY,
    OPERATORS.IS_NOT_EMPTY
  ],
  [FILTER_TYPES.NUMBER]: [
    OPERATORS.EQ,
    OPERATORS.NEQ,
    OPERATORS.GT,
    OPERATORS.GTE,
    OPERATORS.LT,
    OPERATORS.LTE,
    OPERATORS.BETWEEN,
    OPERATORS.IS_EMPTY,
    OPERATORS.IS_NOT_EMPTY
  ],
  [FILTER_TYPES.DATE]: [
    OPERATORS.IS,
    OPERATORS.BEFORE,
    OPERATORS.AFTER,
    OPERATORS.ON_OR_BEFORE,
    OPERATORS.ON_OR_AFTER,
    OPERATORS.BETWEEN,
    OPERATORS.IS_EMPTY,
    OPERATORS.IS_NOT_EMPTY
  ],
  [FILTER_TYPES.ENUM]: [OPERATORS.IN, OPERATORS.NOT_IN],
  [FILTER_TYPES.BOOLEAN]: [OPERATORS.IS_TRUE, OPERATORS.IS_FALSE],
  [FILTER_TYPES.SELECT]: [OPERATORS.LIKE]
};

// Operators that need no value input — apply immediately after selection
export const NO_VALUE_OPERATORS = new Set([
  OPERATORS.IS_EMPTY,
  OPERATORS.IS_NOT_EMPTY,
  OPERATORS.IS_TRUE,
  OPERATORS.IS_FALSE
]);

// Zod schema for a single filter condition
export const filterConditionSchema = z.object({
  id: z.string(),
  op: z.string(),
  v: z
    .union([
      z.string(),
      z.number(),
      z.boolean(),
      z.array(z.string()),
      z.array(z.number()),
      z.null()
    ])
    .optional()
});

export const filtersSchema = z.array(filterConditionSchema).max(20);
