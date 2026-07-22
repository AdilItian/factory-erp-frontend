import { FILTER_TYPES, OPERATORS } from '@/components/data-table/filters/filter-schema';

function toEpoch(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).getTime();
}

/**
 * Maps our internal operator IDs → API searchOperator strings.
 * Extend as the backend supports more operators.
 */
export const OPERATOR_TO_API = {
  [OPERATORS.CONTAINS]: 'LIKE',
  [OPERATORS.NOT_CONTAINS]: 'NOT_LIKE',
  [OPERATORS.EQ]: 'EQUAL',
  [OPERATORS.NEQ]: 'NOT_EQUAL',
  [OPERATORS.STARTS_WITH]: 'LIKE',
  [OPERATORS.ENDS_WITH]: 'LIKE',
  [OPERATORS.GT]: 'GREATER_THAN',
  [OPERATORS.GTE]: 'GREATER_THAN_OR_EQUAL',
  [OPERATORS.LT]: 'LESS_THAN',
  [OPERATORS.LTE]: 'LESS_THAN_OR_EQUAL',
  [OPERATORS.IN]: 'IN',
  [OPERATORS.NOT_IN]: 'NOT_IN',
  [OPERATORS.IS_EMPTY]: 'IS_NULL',
  [OPERATORS.IS_NOT_EMPTY]: 'IS_NOT_NULL'
};

/**
 * Converts active filter conditions → API body array.
 * [ { fieldName, fieldValue, searchOperator } ]
 */
export function conditionsToApiBody(conditions, filterConfig) {
  return conditions
    .map((c) => {
      const searchOperator = OPERATOR_TO_API[c.op];
      if (!searchOperator) return null;

      const col = filterConfig?.columns?.find((col) => col.id === c.id);
      const isDate = col?.type === FILTER_TYPES.DATE;

      let fieldValue;
      if (isDate && Array.isArray(c.v)) {
        fieldValue = c.v.map((d) => toEpoch(d) ?? '').join(',');
      } else if (isDate) {
        fieldValue = String(toEpoch(c.v) ?? '');
      } else if (Array.isArray(c.v)) {
        fieldValue = c.v.join(',');
      } else {
        fieldValue = String(c.v ?? '');
      }

      return { fieldName: c.id, fieldValue, searchOperator };
    })
    .filter(Boolean);
}

/** Declarative filter config for the projects table. */
export const projectsFilterConfig = {
  columns: [
    {
      id: 'name',
      label: 'Name',
      type: FILTER_TYPES.TEXT
    },
    {
      id: 'feeValue',
      label: 'Fee Value',
      type: FILTER_TYPES.NUMBER
    },
    {
      id: 'targetAmount',
      label: 'Target Amount',
      type: FILTER_TYPES.NUMBER
    },
    {
      id: 'emergency',
      label: 'Emergency',
      type: FILTER_TYPES.ENUM,
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
      ]
    },
    {
      id: 'projectStatus',
      label: 'Status',
      type: FILTER_TYPES.ENUM,
      options: [
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Submitted for Approval', value: 'SUBMITTED_FOR_APPROVAL' },
        { label: 'Rejected', value: 'REJECTED' },
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Revision Requested', value: 'REVISION_REQUESTED' },
        { label: 'Published', value: 'PUBLISHED' },
        { label: 'Unpublished', value: 'UNPUBLISHED' }
      ]
    },
    {
      id: 'createdDate',
      label: 'Created Date',
      type: FILTER_TYPES.DATE
    },
    {
      id: 'lastModifiedDate',
      label: 'Last Modified',
      type: FILTER_TYPES.DATE
    }
  ]
};
