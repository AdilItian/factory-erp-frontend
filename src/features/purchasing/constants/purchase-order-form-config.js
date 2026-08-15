import { z } from 'zod';

export const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, 'Select a supplier'),
  locationId: z.string().min(1, 'Select a receiving location'),
  orderDate: z.string().optional(),
  expectedDate: z.string().optional(),
  notes: z.string().optional()
});

export const PURCHASE_ORDER_DEFAULTS = {
  supplierId: '',
  locationId: '',
  orderDate: '',
  expectedDate: '',
  notes: ''
};

export const purchaseOrderLineSchema = z.object({
  itemId: z.string().min(1, 'Select an item'),
  quantity: z.string().trim().min(1, 'Quantity is required'),
  unitPrice: z.string().optional()
});

export const PO_LINE_DEFAULTS = {
  itemId: '',
  quantity: '',
  unitPrice: ''
};

export function getPurchaseOrderFormSections(
  supplierOptions = [],
  locationOptions = []
) {
  return [
    {
      id: 'identity',
      title: 'Purchase order',
      description: 'What you are buying and where it should arrive.',
      icon: 'purchaseOrder',
      columns: 2,
      fields: [
        {
          name: 'supplierId',
          label: 'Supplier',
          type: 'select',
          placeholder: 'Select supplier',
          options: supplierOptions
        },
        {
          name: 'locationId',
          label: 'Receive at',
          type: 'select',
          placeholder: 'Select location',
          options: locationOptions
        },
        {
          name: 'orderDate',
          label: 'Order date',
          type: 'date',
          placeholder: 'Pick a date'
        },
        {
          name: 'expectedDate',
          label: 'Expected',
          type: 'date',
          placeholder: 'Pick a date'
        }
      ]
    },
    {
      id: 'notes',
      title: 'Notes',
      description: 'Anything the supplier or receiving team should know.',
      icon: 'post',
      fields: [
        {
          name: 'notes',
          label: 'Notes',
          type: 'textarea',
          placeholder: 'Jersey fabric for T-shirt run'
        }
      ]
    }
  ];
}

export function getPurchaseOrderLineFormSections(itemOptions = []) {
  return [
    {
      id: 'line',
      title: 'New line',
      description: 'Item, quantity, and optional unit price.',
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
          placeholder: '1200'
        },
        {
          name: 'unitPrice',
          label: 'Unit price',
          type: 'text',
          placeholder: '280'
        }
      ]
    }
  ];
}

export function nextPurchaseOrderStatus(status) {
  if (status === 'DRAFT') return { label: 'Confirm', status: 'CONFIRMED' };
  if (status === 'CONFIRMED') return { label: 'Mark received', status: 'RECEIVED' };
  if (status === 'RECEIVED') return { label: 'Close', status: 'CLOSED' };
  return null;
}
