import { z } from 'zod';

export const WORK_CENTER_TYPE_OPTIONS = [
  { label: 'Cutting', value: 'CUTTING' },
  { label: 'Sewing', value: 'SEWING' },
  { label: 'Finishing', value: 'FINISHING' },
  { label: 'Packing', value: 'PACKING' },
  { label: 'Quality', value: 'QC' },
  { label: 'Other', value: 'OTHER' }
];

export const workCenterSchema = z.object({
  code: z.string().trim().min(1, 'Code is required').max(16),
  name: z.string().trim().min(2, 'Name is required'),
  type: z.enum(['CUTTING', 'SEWING', 'FINISHING', 'PACKING', 'QC', 'OTHER']),
  locationId: z.string().min(1, 'Select a location'),
  capacityPerDay: z.string().optional(),
  isActive: z.boolean()
});

export const WORK_CENTER_DEFAULTS = {
  code: '',
  name: '',
  type: 'SEWING',
  locationId: '',
  capacityPerDay: '',
  isActive: true
};

export function getWorkCenterFormSections(locationOptions = []) {
  return [
    {
      id: 'identity',
      title: 'Work center',
      description: 'A station on the shop floor.',
      icon: 'workCenter',
      columns: 2,
      fields: [
        { name: 'code', label: 'Code', type: 'text', placeholder: 'SEW' },
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Sewing' },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          placeholder: 'Select type',
          options: WORK_CENTER_TYPE_OPTIONS
        },
        {
          name: 'locationId',
          label: 'Location',
          type: 'select',
          placeholder: 'Select location',
          options: locationOptions
        },
        {
          name: 'capacityPerDay',
          label: 'Capacity / day',
          type: 'text',
          placeholder: '600'
        }
      ]
    },
    {
      id: 'rules',
      title: 'Status',
      description: 'Whether this station is in use.',
      icon: 'settings',
      fields: [
        {
          name: 'isActive',
          label: 'Active',
          type: 'checkbox',
          checkboxLabel: 'Work center is active'
        }
      ]
    }
  ];
}
