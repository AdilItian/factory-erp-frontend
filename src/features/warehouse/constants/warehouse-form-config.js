import { z } from 'zod';
import { RETURN_REASON_OPTIONS } from './doc-types';

export const warehouseLineSchema = z.object({
  itemId: z.string().min(1, 'Select an item'),
  quantity: z.string().trim().min(1, 'Quantity is required')
});

export const WAREHOUSE_LINE_DEFAULTS = {
  itemId: '',
  quantity: ''
};

const baseDefaults = {
  docDate: '',
  reference: '',
  notes: ''
};

export const DOC_DEFAULTS = {
  MRN: {
    ...baseDefaults,
    storeId: '',
    supplierId: '',
    purchaseOrderCode: ''
  },
  MIN: {
    ...baseDefaults,
    storeId: '',
    issuedTo: ''
  },
  MTN: {
    ...baseDefaults,
    fromStoreId: '',
    toStoreId: ''
  },
  MRR: {
    ...baseDefaults,
    storeId: '',
    supplierId: '',
    reason: 'DAMAGED'
  }
};

export function getDocSchema(type) {
  if (type === 'MRN') {
    return z.object({
      storeId: z.string().min(1, 'Select the receiving store'),
      supplierId: z.string().optional(),
      purchaseOrderCode: z.string().optional(),
      docDate: z.string().optional(),
      reference: z.string().optional(),
      notes: z.string().optional()
    });
  }
  if (type === 'MIN') {
    return z.object({
      storeId: z.string().min(1, 'Select the issuing store'),
      issuedTo: z.string().trim().min(1, 'Who is receiving the issue?'),
      docDate: z.string().optional(),
      reference: z.string().optional(),
      notes: z.string().optional()
    });
  }
  if (type === 'MTN') {
    return z
      .object({
        fromStoreId: z.string().min(1, 'Select the from store'),
        toStoreId: z.string().min(1, 'Select the to store'),
        docDate: z.string().optional(),
        reference: z.string().optional(),
        notes: z.string().optional()
      })
      .refine((values) => values.fromStoreId !== values.toStoreId, {
        message: 'From and to stores must be different',
        path: ['toStoreId']
      });
  }
  return z.object({
    storeId: z.string().min(1, 'Select the store'),
    supplierId: z.string().min(1, 'Select the supplier'),
    reason: z.string().min(1, 'Select a reason'),
    docDate: z.string().optional(),
    reference: z.string().optional(),
    notes: z.string().optional()
  });
}

export function getDocFormSections(
  type,
  { storeOptions = [], supplierOptions = [] } = {}
) {
  const notesSection = {
    id: 'notes',
    title: 'Notes',
    description: 'Anything the warehouse team should know.',
    icon: 'post',
    fields: [
      {
        name: 'notes',
        label: 'Notes',
        type: 'textarea',
        placeholder: 'Optional details'
      }
    ]
  };

  if (type === 'MRN') {
    return [
      {
        id: 'identity',
        title: 'Receipt',
        description: 'Where goods land and who they came from.',
        icon: 'mrn',
        columns: 2,
        fields: [
          {
            name: 'storeId',
            label: 'Receive into store',
            type: 'select',
            placeholder: 'Select store',
            options: storeOptions
          },
          {
            name: 'supplierId',
            label: 'Supplier',
            type: 'select',
            placeholder: 'Optional',
            options: supplierOptions
          },
          {
            name: 'purchaseOrderCode',
            label: 'PO reference',
            type: 'text',
            placeholder: 'PO-2026-001'
          },
          {
            name: 'docDate',
            label: 'Receipt date',
            type: 'date',
            placeholder: 'Pick a date'
          },
          {
            name: 'reference',
            label: 'Other reference',
            type: 'text',
            placeholder: 'Delivery note / invoice #'
          }
        ]
      },
      notesSection
    ];
  }

  if (type === 'MIN') {
    return [
      {
        id: 'identity',
        title: 'Issue',
        description: 'Take materials out of a store for use on the floor.',
        icon: 'min',
        columns: 2,
        fields: [
          {
            name: 'storeId',
            label: 'Issue from store',
            type: 'select',
            placeholder: 'Select store',
            options: storeOptions
          },
          {
            name: 'issuedTo',
            label: 'Issued to',
            type: 'text',
            placeholder: 'Cutting floor / WO-014'
          },
          {
            name: 'docDate',
            label: 'Issue date',
            type: 'date',
            placeholder: 'Pick a date'
          },
          {
            name: 'reference',
            label: 'Work order / job',
            type: 'text',
            placeholder: 'WO-2026-014'
          }
        ]
      },
      notesSection
    ];
  }

  if (type === 'MTN') {
    return [
      {
        id: 'identity',
        title: 'Transfer',
        description: 'Move stock from one store to another.',
        icon: 'transfer',
        columns: 2,
        fields: [
          {
            name: 'fromStoreId',
            label: 'From store',
            type: 'select',
            placeholder: 'Select store',
            options: storeOptions
          },
          {
            name: 'toStoreId',
            label: 'To store',
            type: 'select',
            placeholder: 'Select store',
            options: storeOptions
          },
          {
            name: 'docDate',
            label: 'Transfer date',
            type: 'date',
            placeholder: 'Pick a date'
          },
          {
            name: 'reference',
            label: 'Reference',
            type: 'text',
            placeholder: 'Optional'
          }
        ]
      },
      notesSection
    ];
  }

  return [
    {
      id: 'identity',
      title: 'Return',
      description: 'Send materials back to the supplier.',
      icon: 'materialReturn',
      columns: 2,
      fields: [
        {
          name: 'storeId',
          label: 'Return from store',
          type: 'select',
          placeholder: 'Select store',
          options: storeOptions
        },
        {
          name: 'supplierId',
          label: 'Supplier',
          type: 'select',
          placeholder: 'Select supplier',
          options: supplierOptions
        },
        {
          name: 'reason',
          label: 'Reason',
          type: 'select',
          placeholder: 'Select reason',
          options: RETURN_REASON_OPTIONS
        },
        {
          name: 'docDate',
          label: 'Return date',
          type: 'date',
          placeholder: 'Pick a date'
        },
        {
          name: 'reference',
          label: 'Related MRN / PO',
          type: 'text',
          placeholder: 'MRN-2026-001'
        }
      ]
    },
    notesSection
  ];
}

export function getLineFormSections(itemOptions = []) {
  return [
    {
      id: 'line',
      title: 'New line',
      description: 'Item and quantity for this document.',
      icon: 'package',
      columns: 2,
      fields: [
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
          placeholder: '100'
        }
      ]
    }
  ];
}
