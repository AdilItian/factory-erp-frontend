import { z } from 'zod';

export const salesOrderSchema = z.object({
  customerId: z.string().min(1, 'Select a customer'),
  locationId: z.string().min(1, 'Select a ship-from location'),
  shipToId: z.string().optional(),
  orderDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional()
});

export const SALES_ORDER_DEFAULTS = {
  customerId: '',
  locationId: '',
  shipToId: '__none__',
  orderDate: '',
  dueDate: '',
  notes: ''
};

export const salesOrderLineSchema = z.object({
  itemId: z.string().min(1, 'Select an item'),
  quantity: z.string().trim().min(1, 'Quantity is required'),
  unitPrice: z.string().optional()
});

export const SO_LINE_DEFAULTS = {
  itemId: '',
  quantity: '',
  unitPrice: ''
};

export function getSalesOrderFormSections(
  customerOptions = [],
  locationOptions = []
) {
  return [
    {
      id: 'identity',
      title: 'Sales order',
      description: 'What the customer wants and where it ships from.',
      icon: 'salesOrder',
      columns: 2,
      fields: [
        {
          name: 'customerId',
          label: 'Customer',
          type: 'select',
          placeholder: 'Select customer',
          options: customerOptions
        },
        {
          name: 'locationId',
          label: 'Ship from',
          type: 'select',
          placeholder: 'Select location',
          options: locationOptions
        },
        {
          name: 'shipToId',
          label: 'Ship to',
          type: 'select',
          placeholder: 'Same as customer / none',
          options: [{ label: 'None', value: '__none__' }, ...locationOptions]
        },
        {
          name: 'orderDate',
          label: 'Order date',
          type: 'date',
          placeholder: 'Pick a date'
        },
        {
          name: 'dueDate',
          label: 'Due date',
          type: 'date',
          placeholder: 'Pick a date'
        }
      ]
    },
    {
      id: 'notes',
      title: 'Notes',
      description: 'Sizes, colours, or packing instructions.',
      icon: 'post',
      fields: [
        {
          name: 'notes',
          label: 'Notes',
          type: 'textarea',
          placeholder: 'White / mixed sizes restock'
        }
      ]
    }
  ];
}

export function getSalesOrderLineFormSections(itemOptions = []) {
  return [
    {
      id: 'line',
      title: 'New line',
      description: 'Finished good, quantity, and optional unit price.',
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
          placeholder: '400'
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

export function nextSalesOrderStatus(status) {
  if (status === 'DRAFT') return { label: 'Confirm', status: 'CONFIRMED' };
  if (status === 'CONFIRMED') return { label: 'Mark shipped', status: 'SHIPPED' };
  if (status === 'SHIPPED') return { label: 'Close', status: 'CLOSED' };
  return null;
}
