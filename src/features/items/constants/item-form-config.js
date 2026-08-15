import { z } from 'zod';

export const ITEM_TYPE_OPTIONS = [
  { label: 'Raw material', value: 'RAW_MATERIAL' },
  { label: 'Packaging', value: 'PACKAGING' },
  { label: 'Semi finished', value: 'SEMI_FINISHED' },
  { label: 'Finished good', value: 'FINISHED_GOOD' },
  { label: 'Consumable', value: 'CONSUMABLE' },
  { label: 'Trading', value: 'TRADING' },
  { label: 'Service', value: 'SERVICE' }
];

export const TRACKING_OPTIONS = [
  { label: 'None', value: 'NONE' },
  { label: 'Batch', value: 'BATCH' },
  { label: 'Serial', value: 'SERIAL' }
];

export const itemSchema = z.object({
  code: z.string().trim().min(1, 'SKU is required'),
  name: z.string().trim().min(2, 'Name is required'),
  description: z.string().optional(),
  type: z.enum([
    'RAW_MATERIAL',
    'PACKAGING',
    'SEMI_FINISHED',
    'FINISHED_GOOD',
    'CONSUMABLE',
    'TRADING',
    'SERVICE'
  ]),
  categoryId: z.string().optional(),
  baseUomId: z.string().min(1, 'Base unit is required'),
  purchaseUomId: z.string().optional(),
  salesUomId: z.string().optional(),
  attributeSetId: z.string().optional(),
  tracking: z.enum(['NONE', 'BATCH', 'SERIAL']),
  barcode: z.string().optional(),
  purchasePrice: z.string().optional(),
  salesPrice: z.string().optional(),
  isTemplate: z.boolean(),
  isActive: z.boolean()
});

export const ITEM_DEFAULTS = {
  code: '',
  name: '',
  description: '',
  type: 'FINISHED_GOOD',
  categoryId: '__none__',
  baseUomId: '',
  purchaseUomId: '__none__',
  salesUomId: '__none__',
  attributeSetId: '__none__',
  tracking: 'NONE',
  barcode: '',
  purchasePrice: '',
  salesPrice: '',
  isTemplate: false,
  isActive: true
};

export function getItemFields({
  categoryOptions = [],
  uomOptions = [],
  setOptions = []
} = {}) {
  return [
    { name: 'code', label: 'SKU', type: 'text', placeholder: 'TSHIRT-BASIC' },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Basic Crew Neck T-Shirt'
    },
    { name: 'description', label: 'Description', type: 'textarea' },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      placeholder: 'Select type',
      options: ITEM_TYPE_OPTIONS
    },
    {
      name: 'categoryId',
      label: 'Category',
      type: 'select',
      placeholder: 'No category',
      options: [{ label: 'No category', value: '__none__' }, ...categoryOptions]
    },
    {
      name: 'baseUomId',
      label: 'Base unit',
      type: 'select',
      placeholder: 'Select unit',
      options: uomOptions
    },
    {
      name: 'purchaseUomId',
      label: 'Purchase unit',
      type: 'select',
      placeholder: 'Same as base',
      options: [{ label: 'Same as base', value: '__none__' }, ...uomOptions]
    },
    {
      name: 'salesUomId',
      label: 'Sales unit',
      type: 'select',
      placeholder: 'Same as base',
      options: [{ label: 'Same as base', value: '__none__' }, ...uomOptions]
    },
    {
      name: 'attributeSetId',
      label: 'Attribute set',
      type: 'select',
      placeholder: 'None',
      options: [{ label: 'None', value: '__none__' }, ...setOptions]
    },
    {
      name: 'tracking',
      label: 'Tracking',
      type: 'select',
      placeholder: 'None',
      options: TRACKING_OPTIONS
    },
    { name: 'barcode', label: 'Barcode', type: 'text', placeholder: '8901234567890' },
    { name: 'purchasePrice', label: 'Purchase price', type: 'text', placeholder: '450.00' },
    { name: 'salesPrice', label: 'Sales price', type: 'text', placeholder: '1299.00' },
    {
      name: 'isTemplate',
      label: 'Template',
      type: 'checkbox',
      checkboxLabel: 'Catalogue parent (holds no stock)'
    },
    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox',
      checkboxLabel: 'Item is active'
    }
  ];
}

export function getItemFormSections(options = {}) {
  const fields = getItemFields(options);
  const byName = Object.fromEntries(fields.map((field) => [field.name, field]));

  return [
    {
      id: 'identity',
      title: 'Item',
      description: 'SKU, name, and where it sits in the catalogue.',
      icon: 'package',
      fields: [
        byName.code,
        byName.name,
        byName.type,
        byName.categoryId,
        byName.description
      ],
      columns: 2
    },
    {
      id: 'units',
      title: 'Units & tracking',
      description: 'How this item is counted, bought, sold, and traced.',
      icon: 'ruler',
      fields: [
        byName.baseUomId,
        byName.purchaseUomId,
        byName.salesUomId,
        byName.tracking,
        byName.barcode,
        byName.attributeSetId
      ],
      columns: 2
    },
    {
      id: 'pricing',
      title: 'Pricing & flags',
      description: 'Optional prices and whether this row holds stock.',
      icon: 'settings',
      fields: [
        byName.purchasePrice,
        byName.salesPrice,
        byName.isTemplate,
        byName.isActive
      ],
      columns: 2
    }
  ];
}

export const categorySchema = z.object({
  code: z.string().trim().min(1, 'Code is required'),
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().optional(),
  parentId: z.string().optional(),
  attributeSetId: z.string().optional(),
  isActive: z.boolean()
});

export const CATEGORY_DEFAULTS = {
  code: '',
  name: '',
  description: '',
  parentId: '__none__',
  attributeSetId: '__none__',
  isActive: true
};

export function getCategoryFields({
  parentOptions = [],
  setOptions = []
} = {}) {
  return [
    { name: 'code', label: 'Code', type: 'text', placeholder: 'FABRIC' },
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Fabric' },
    { name: 'description', label: 'Description', type: 'textarea' },
    {
      name: 'parentId',
      label: 'Parent',
      type: 'select',
      placeholder: 'Top level',
      options: [{ label: 'Top level', value: '__none__' }, ...parentOptions]
    },
    {
      name: 'attributeSetId',
      label: 'Attribute set',
      type: 'select',
      placeholder: 'None',
      options: [{ label: 'None', value: '__none__' }, ...setOptions]
    },
    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox',
      checkboxLabel: 'Category is active'
    }
  ];
}

export function getCategoryFormSections(options = {}) {
  const fields = getCategoryFields(options);
  const byName = Object.fromEntries(fields.map((field) => [field.name, field]));

  return [
    {
      id: 'identity',
      title: 'Category',
      description: 'How this group is named in the catalogue.',
      icon: 'category',
      fields: [
        byName.code,
        byName.name,
        byName.parentId,
        byName.attributeSetId,
        byName.description
      ],
      columns: 2
    },
    {
      id: 'rules',
      title: 'Status',
      description: 'Whether this category is in use.',
      icon: 'settings',
      fields: [byName.isActive]
    }
  ];
}
