import { z } from 'zod';

export const LOCATION_TYPE_OPTIONS = [
  { label: 'Factory', value: 'FACTORY' },
  { label: 'Outlet', value: 'OUTLET' },
  { label: 'Warehouse', value: 'WAREHOUSE' },
  { label: 'Head office', value: 'HEAD_OFFICE' }
];

export const locationSchema = z.object({
  code: z.string().trim().min(1, 'Code is required').max(32),
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  type: z.enum(['FACTORY', 'OUTLET', 'WAREHOUSE', 'HEAD_OFFICE']),
  addressLine: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  gatePassRequiredOnDispatch: z.boolean(),
  isActive: z.boolean()
});

export const LOCATION_DEFAULTS = {
  code: '',
  name: '',
  type: 'FACTORY',
  addressLine: '',
  city: '',
  country: '',
  phone: '',
  gatePassRequiredOnDispatch: true,
  isActive: true
};

export const LOCATION_FIELDS = [
  {
    name: 'code',
    label: 'Code',
    type: 'text',
    placeholder: 'FAC-LHR'
  },
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Lahore Factory'
  },
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    placeholder: 'Select type',
    options: LOCATION_TYPE_OPTIONS
  },
  {
    name: 'addressLine',
    label: 'Address',
    type: 'text',
    placeholder: 'Plot 42, Sundar Industrial Estate'
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    placeholder: 'Lahore'
  },
  {
    name: 'country',
    label: 'Country',
    type: 'text',
    placeholder: 'Pakistan'
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'text',
    placeholder: '+92 42 111 222 333'
  },
  {
    name: 'gatePassRequiredOnDispatch',
    label: 'Gate pass',
    type: 'checkbox',
    checkboxLabel: 'Require gate pass on dispatch'
  },
  {
    name: 'isActive',
    label: 'Active',
    type: 'checkbox',
    checkboxLabel: 'Location is active'
  }
];

export function getLocationUserFormSections(userOptions = []) {
  return [
    {
      id: 'assign',
      title: 'Person',
      description: 'Who can act on this site.',
      icon: 'user',
      fields: [
        {
          name: 'userId',
          label: 'User',
          type: 'select',
          placeholder: 'Select a user',
          options: userOptions
        },
        {
          name: 'isPrimary',
          label: 'Primary',
          type: 'checkbox',
          checkboxLabel: 'Make this their primary location'
        }
      ]
    }
  ];
}

export function getLocationFormSections() {
  const byName = Object.fromEntries(
    LOCATION_FIELDS.map((field) => [field.name, field])
  );

  return [
    {
      id: 'identity',
      title: 'Site',
      description: 'Code, name, and what kind of place this is.',
      icon: 'factory',
      fields: [
        byName.code,
        byName.name,
        { ...byName.type, wrapperClassName: 'sm:col-span-2' }
      ],
      columns: 2
    },
    {
      id: 'address',
      title: 'Address',
      description: 'Where people will find this site.',
      icon: 'location',
      fields: [byName.addressLine, byName.city, byName.country, byName.phone],
      columns: 2
    },
    {
      id: 'rules',
      title: 'Rules',
      description: 'Dispatch and whether this site is in use.',
      icon: 'settings',
      fields: [byName.gatePassRequiredOnDispatch, byName.isActive]
    }
  ];
}
