import { z } from 'zod';

export const STORE_TYPE_OPTIONS = [
  { label: 'Raw', value: 'RAW' },
  { label: 'Packaging', value: 'PACKAGING' },
  { label: 'WIP', value: 'WIP' },
  { label: 'Finished goods', value: 'FINISHED_GOODS' },
  { label: 'Outlet floor', value: 'OUTLET_FLOOR' },
  { label: 'Scrap', value: 'SCRAP' },
  { label: 'Transit', value: 'TRANSIT' },
  { label: 'Quarantine', value: 'QUARANTINE' }
];

export const storeSchema = z.object({
  locationId: z.string().min(1, 'Select a location'),
  code: z.string().trim().min(1, 'Code is required').max(32),
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  type: z.enum([
    'RAW',
    'PACKAGING',
    'WIP',
    'FINISHED_GOODS',
    'OUTLET_FLOOR',
    'SCRAP',
    'TRANSIT',
    'QUARANTINE'
  ]),
  isDefault: z.boolean(),
  allowNegativeStock: z.boolean(),
  isActive: z.boolean()
});

export const STORE_DEFAULTS = {
  locationId: '',
  code: '',
  name: '',
  type: 'RAW',
  isDefault: false,
  allowNegativeStock: false,
  isActive: true
};

export function getStoreFields(locationOptions = []) {
  return [
    {
      name: 'locationId',
      label: 'Location',
      type: 'select',
      placeholder: 'Select location',
      options: locationOptions
    },
    {
      name: 'code',
      label: 'Code',
      type: 'text',
      placeholder: 'RAW'
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Raw Material Store'
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      placeholder: 'Select type',
      options: STORE_TYPE_OPTIONS
    },
    {
      name: 'isDefault',
      label: 'Default',
      type: 'checkbox',
      checkboxLabel: 'Prefill this store on documents',
      wrapperClassName: 'sm:col-span-2'
    },
    {
      name: 'allowNegativeStock',
      label: 'Negative stock',
      type: 'checkbox',
      checkboxLabel: 'Allow negative stock',
      wrapperClassName: 'sm:col-span-2'
    },
    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox',
      checkboxLabel: 'Store is active',
      wrapperClassName: 'sm:col-span-2'
    }
  ];
}

export function getStoreFormSections(locationOptions = []) {
  const fields = getStoreFields(locationOptions);
  const byName = Object.fromEntries(fields.map((field) => [field.name, field]));

  return [
    {
      id: 'identity',
      title: 'Store',
      description: 'Where this room lives, and how it is named.',
      icon: 'warehouse',
      fields: [byName.locationId, byName.type, byName.code, byName.name],
      columns: 2
    },
    {
      id: 'rules',
      title: 'Rules',
      description: 'Defaults and stock behaviour for documents.',
      icon: 'settings',
      fields: [byName.isDefault, byName.allowNegativeStock, byName.isActive]
    }
  ];
}
