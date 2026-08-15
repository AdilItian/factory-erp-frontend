import { z } from 'zod';

export const openingSchema = z.object({
  storeId: z.string().min(1, 'Select a store'),
  notes: z.string().optional(),
  itemId: z.string().min(1, 'Select an item'),
  quantity: z.string().trim().min(1, 'Quantity is required'),
  unitCost: z.string().optional(),
  batchCode: z.string().optional(),
  serialNo: z.string().optional()
});

export const adjustmentSchema = z.object({
  storeId: z.string().min(1, 'Select a store'),
  reason: z.string().trim().min(2, 'Reason is required'),
  notes: z.string().optional(),
  itemId: z.string().min(1, 'Select an item'),
  quantity: z.string().trim().min(1, 'Quantity is required'),
  unitCost: z.string().optional(),
  batchCode: z.string().optional(),
  serialNo: z.string().optional()
});

export function getOpeningFields(storeOptions = [], itemOptions = []) {
  return [
    {
      name: 'storeId',
      label: 'Store',
      type: 'select',
      placeholder: 'Select store',
      options: storeOptions
    },
    {
      name: 'itemId',
      label: 'Item',
      type: 'select',
      placeholder: 'Select item',
      options: itemOptions
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'text',
      placeholder: '250.000'
    },
    {
      name: 'unitCost',
      label: 'Unit cost',
      type: 'text',
      placeholder: '320.50'
    },
    {
      name: 'batchCode',
      label: 'Batch code',
      type: 'text',
      placeholder: 'LOT-2026-01'
    },
    {
      name: 'serialNo',
      label: 'Serial no.',
      type: 'text',
      placeholder: 'Optional'
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea'
    }
  ];
}

export function getOpeningFormSections(storeOptions = [], itemOptions = []) {
  const fields = getOpeningFields(storeOptions, itemOptions);
  const byName = Object.fromEntries(fields.map((field) => [field.name, field]));

  return [
    {
      id: 'where',
      title: 'Store & item',
      description: 'Where this opening balance will live.',
      icon: 'warehouse',
      fields: [byName.storeId, byName.itemId],
      columns: 2
    },
    {
      id: 'qty',
      title: 'Quantity',
      description: 'How much to post, and optional lot details.',
      icon: 'inventory',
      fields: [
        byName.quantity,
        byName.unitCost,
        byName.batchCode,
        byName.serialNo,
        byName.notes
      ],
      columns: 2
    }
  ];
}

export function getAdjustmentFields(storeOptions = [], itemOptions = []) {
  return [
    {
      name: 'storeId',
      label: 'Store',
      type: 'select',
      placeholder: 'Select store',
      options: storeOptions
    },
    {
      name: 'reason',
      label: 'Reason',
      type: 'text',
      placeholder: 'Damaged during handling'
    },
    {
      name: 'itemId',
      label: 'Item',
      type: 'select',
      placeholder: 'Select item',
      options: itemOptions
    },
    {
      name: 'quantity',
      label: 'Quantity (signed)',
      type: 'text',
      placeholder: '-3.000'
    },
    {
      name: 'unitCost',
      label: 'Unit cost (write-on)',
      type: 'text',
      placeholder: '320.50'
    },
    {
      name: 'batchCode',
      label: 'Batch code',
      type: 'text'
    },
    {
      name: 'serialNo',
      label: 'Serial no.',
      type: 'text'
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea'
    }
  ];
}

export function getAdjustmentFormSections(storeOptions = [], itemOptions = []) {
  const fields = getAdjustmentFields(storeOptions, itemOptions);
  const byName = Object.fromEntries(fields.map((field) => [field.name, field]));

  return [
    {
      id: 'where',
      title: 'Store & reason',
      description: 'Where stock moves, and why.',
      icon: 'warehouse',
      fields: [byName.storeId, byName.reason, byName.itemId],
      columns: 2
    },
    {
      id: 'qty',
      title: 'Quantity',
      description: 'Signed quantity writes on or off. Optional lot details.',
      icon: 'inventory',
      fields: [
        byName.quantity,
        byName.unitCost,
        byName.batchCode,
        byName.serialNo,
        byName.notes
      ],
      columns: 2
    }
  ];
}
