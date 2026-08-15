export const WAREHOUSE_DOC_TYPES = {
  MRN: {
    key: 'MRN',
    title: 'Material receipt notes',
    singular: 'Material receipt note',
    short: 'MRN',
    description:
      'Record goods received into a store — usually against a purchase order.',
    addLabel: 'Add MRN',
    searchPlaceholder: 'Search receipt notes…',
    emptyMessage: 'No material receipt notes yet.',
    icon: 'mrn',
    route: '/dashboard/inventory/mrn',
    columns: ['code', 'store', 'supplier', 'reference', 'date', 'status']
  },
  MIN: {
    key: 'MIN',
    title: 'Material issue notes',
    singular: 'Material issue note',
    short: 'MIN',
    description:
      'Issue materials from a store to production, a department, or a job.',
    addLabel: 'Add MIN',
    searchPlaceholder: 'Search issue notes…',
    emptyMessage: 'No material issue notes yet.',
    icon: 'min',
    route: '/dashboard/inventory/min',
    columns: ['code', 'store', 'issuedTo', 'reference', 'date', 'status']
  },
  MTN: {
    key: 'MTN',
    title: 'Material transfers',
    singular: 'Material transfer',
    short: 'MTN',
    description: 'Move stock between stores — raw to WIP, WIP to finished, and so on.',
    addLabel: 'Add transfer',
    searchPlaceholder: 'Search transfers…',
    emptyMessage: 'No material transfers yet.',
    icon: 'transfer',
    route: '/dashboard/inventory/transfers',
    columns: ['code', 'fromStore', 'toStore', 'reference', 'date', 'status']
  },
  MRR: {
    key: 'MRR',
    title: 'Supplier returns',
    singular: 'Supplier return',
    short: 'MRR',
    description:
      'Return materials to a supplier — damaged, excess, or wrong goods.',
    addLabel: 'Add return',
    searchPlaceholder: 'Search supplier returns…',
    emptyMessage: 'No supplier returns yet.',
    icon: 'materialReturn',
    route: '/dashboard/inventory/returns',
    columns: ['code', 'store', 'supplier', 'reason', 'date', 'status']
  }
};

export const RETURN_REASON_OPTIONS = [
  { value: 'DAMAGED', label: 'Damaged' },
  { value: 'EXCESS', label: 'Excess' },
  { value: 'WRONG_ITEM', label: 'Wrong item' },
  { value: 'QUALITY', label: 'Quality reject' },
  { value: 'OTHER', label: 'Other' }
];

export function nextWarehouseDocStatus(status) {
  if (status === 'DRAFT') return { label: 'Post', status: 'POSTED' };
  if (status === 'POSTED') return { label: 'Close', status: 'CLOSED' };
  return null;
}
