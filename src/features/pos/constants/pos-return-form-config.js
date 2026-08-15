import { z } from 'zod';

export const RETURN_REASON_OPTIONS = [
  { value: 'SIZE_FIT', label: 'Wrong size / fit' },
  { value: 'DEFECT', label: 'Defect / damaged' },
  { value: 'CHANGED_MIND', label: 'Changed mind' },
  { value: 'WRONG_ITEM', label: 'Wrong item' },
  { value: 'OTHER', label: 'Other' }
];

export const REFUND_METHOD_OPTIONS = [
  { value: 'CASH', label: 'Cash refund' },
  { value: 'CARD', label: 'Card refund' },
  { value: 'ORIGINAL', label: 'Original payment method' }
];

export const posReturnSchema = z.object({
  saleId: z.string().min(1, 'Find and select the original sale'),
  reason: z.string().min(1, 'Select a reason'),
  refundMethod: z.string().min(1, 'Select how to refund'),
  notes: z.string().optional()
});

export const POS_RETURN_DEFAULTS = {
  saleId: '',
  reason: 'SIZE_FIT',
  refundMethod: 'ORIGINAL',
  notes: ''
};

export const posReturnLineSchema = z.object({
  itemId: z.string().min(1, 'Select an item'),
  quantity: z.string().trim().min(1, 'Quantity is required'),
  unitPrice: z.string().trim().min(1, 'Unit price is required')
});

export const POS_RETURN_LINE_DEFAULTS = {
  itemId: '',
  quantity: '',
  unitPrice: ''
};

export function getPosReturnFormSections() {
  return [
    {
      id: 'refund',
      title: 'Refund details',
      description: 'Why the customer is returning and how to pay them back.',
      icon: 'refund',
      columns: 2,
      fields: [
        {
          name: 'reason',
          label: 'Return reason',
          type: 'select',
          placeholder: 'Select reason',
          options: RETURN_REASON_OPTIONS
        },
        {
          name: 'refundMethod',
          label: 'Refund method',
          type: 'select',
          placeholder: 'How to pay back',
          options: REFUND_METHOD_OPTIONS
        }
      ]
    },
    {
      id: 'notes',
      title: 'Notes',
      description: 'Optional note for the register or manager.',
      icon: 'post',
      fields: [
        {
          name: 'notes',
          label: 'Notes',
          type: 'textarea',
          placeholder: 'Customer kept the bag / exchanged later…'
        }
      ]
    }
  ];
}

export function getPosReturnLineFormSections(itemOptions = []) {
  return [
    {
      id: 'line',
      title: 'Return line',
      description: 'Item coming back and the amount to refund.',
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
          label: 'Qty to return',
          type: 'text',
          placeholder: '1'
        },
        {
          name: 'unitPrice',
          label: 'Unit price',
          type: 'text',
          placeholder: '890'
        }
      ]
    }
  ];
}

export function nextPosReturnStatus(status) {
  if (status === 'DRAFT') return { label: 'Refund customer', status: 'REFUNDED' };
  return null;
}

export function matchesSaleSearch(sale, query) {
  const q = String(query ?? '').trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    sale.code,
    sale.location?.code,
    sale.location?.name,
    sale.paymentMethod,
    sale.total,
    sale.subtotal,
    ...(sale.lines ?? []).flatMap((line) => [
      line.item?.code,
      line.item?.name,
      line.itemId
    ])
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}
