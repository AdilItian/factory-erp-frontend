import { z } from 'zod';

export const workOrderSchema = z.object({
  itemId: z.string().min(1, 'Select an item'),
  bomId: z.string().min(1, 'Select a BoM'),
  locationId: z.string().min(1, 'Select a location'),
  quantity: z.string().trim().min(1, 'Quantity is required'),
  dueDate: z.string().optional(),
  notes: z.string().optional()
});

export const WORK_ORDER_DEFAULTS = {
  itemId: '',
  bomId: '',
  locationId: '',
  quantity: '',
  dueDate: '',
  notes: ''
};

export function getWorkOrderFormSections({
  itemOptions = [],
  bomOptions = [],
  locationOptions = []
} = {}) {
  return [
    {
      id: 'identity',
      title: 'Work order',
      description: 'What to make, from which recipe, and where.',
      icon: 'production',
      columns: 2,
      fields: [
        {
          name: 'itemId',
          label: 'Finished item',
          type: 'select',
          placeholder: 'Select item',
          options: itemOptions
        },
        {
          name: 'bomId',
          label: 'Bill of materials',
          type: 'select',
          placeholder: 'Select BoM',
          options: bomOptions
        },
        {
          name: 'locationId',
          label: 'Factory',
          type: 'select',
          placeholder: 'Select location',
          options: locationOptions
        },
        {
          name: 'quantity',
          label: 'Quantity',
          type: 'text',
          placeholder: '500'
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
      description: 'Sizes, colours, or anything the floor should know.',
      icon: 'post',
      fields: [
        {
          name: 'notes',
          label: 'Notes',
          type: 'textarea',
          placeholder: 'Outlet restock — white, mixed sizes'
        }
      ]
    }
  ];
}

export function nextWorkOrderStatus(status) {
  if (status === 'DRAFT') return { label: 'Release', status: 'RELEASED' };
  if (status === 'RELEASED') return { label: 'Start', status: 'IN_PROGRESS' };
  if (status === 'IN_PROGRESS') return { label: 'Complete', status: 'COMPLETED' };
  return null;
}
