import { z } from 'zod';

export const uomSchema = z.object({
  code: z.string().trim().min(1, 'Code is required').max(16),
  name: z.string().trim().min(1, 'Name is required'),
  symbol: z.string().optional(),
  isActive: z.boolean()
});

export const UOM_DEFAULTS = {
  code: '',
  name: '',
  symbol: '',
  isActive: true
};

export const UOM_FIELDS = [
  { name: 'code', label: 'Code', type: 'text', placeholder: 'KG' },
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Kilogram' },
  { name: 'symbol', label: 'Symbol', type: 'text', placeholder: 'kg' },
  {
    name: 'isActive',
    label: 'Active',
    type: 'checkbox',
    checkboxLabel: 'Unit is active'
  }
];

export function getUomFormSections() {
  const byName = Object.fromEntries(
    UOM_FIELDS.map((field) => [field.name, field])
  );

  return [
    {
      id: 'identity',
      title: 'Unit',
      description: 'Short code, full name, and the symbol people will see.',
      icon: 'ruler',
      fields: [byName.code, byName.name, byName.symbol],
      columns: 2
    },
    {
      id: 'rules',
      title: 'Status',
      description: 'Whether this unit is in use.',
      icon: 'settings',
      fields: [byName.isActive]
    }
  ];
}

export const conversionSchema = z.object({
  fromUomId: z.string().min(1, 'Select from unit'),
  toUomId: z.string().min(1, 'Select to unit'),
  factor: z.string().trim().min(1, 'Factor is required')
});

export function getConversionFields(uomOptions = []) {
  return [
    {
      name: 'fromUomId',
      label: 'From unit',
      type: 'select',
      placeholder: 'Select unit',
      options: uomOptions
    },
    {
      name: 'toUomId',
      label: 'To unit',
      type: 'select',
      placeholder: 'Select unit',
      options: uomOptions
    },
    {
      name: 'factor',
      label: 'Factor',
      type: 'text',
      placeholder: '1000 (1 from = factor to)'
    }
  ];
}

export function getConversionFormSections(uomOptions = []) {
  const fields = getConversionFields(uomOptions);
  const byName = Object.fromEntries(fields.map((field) => [field.name, field]));

  return [
    {
      id: 'conversion',
      title: 'Conversion',
      description: 'How many to-units make one from-unit.',
      icon: 'ruler',
      fields: [
        byName.fromUomId,
        byName.toUomId,
        { ...byName.factor, wrapperClassName: 'sm:col-span-2' }
      ],
      columns: 2
    }
  ];
}
