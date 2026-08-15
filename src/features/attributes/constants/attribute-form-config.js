import { z } from 'zod';

export const ATTRIBUTE_DATA_TYPE_OPTIONS = [
  { label: 'Text', value: 'TEXT' },
  { label: 'Number', value: 'NUMBER' },
  { label: 'Boolean', value: 'BOOLEAN' },
  { label: 'Enum', value: 'ENUM' },
  { label: 'Date', value: 'DATE' }
];

export const attributeSchema = z.object({
  code: z.string().trim().min(1, 'Code is required').max(32),
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().optional(),
  dataType: z.enum(['TEXT', 'NUMBER', 'BOOLEAN', 'ENUM', 'DATE']),
  groupId: z.string().optional(),
  uomId: z.string().optional(),
  isVariantAxis: z.boolean(),
  isRequired: z.boolean(),
  isFilterable: z.boolean(),
  minValue: z.string().optional(),
  maxValue: z.string().optional(),
  defaultValue: z.string().optional(),
  isActive: z.boolean()
});

export const ATTRIBUTE_DEFAULTS = {
  code: '',
  name: '',
  description: '',
  dataType: 'TEXT',
  groupId: '__none__',
  uomId: '__none__',
  isVariantAxis: false,
  isRequired: false,
  isFilterable: true,
  minValue: '',
  maxValue: '',
  defaultValue: '',
  isActive: true
};

export function getAttributeFields(groupOptions = [], uomOptions = []) {
  return [
    { name: 'code', label: 'Code', type: 'text', placeholder: 'COLOR' },
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Color' },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Finished colour of the fabric'
    },
    {
      name: 'dataType',
      label: 'Data type',
      type: 'select',
      placeholder: 'Select type',
      options: ATTRIBUTE_DATA_TYPE_OPTIONS
    },
    {
      name: 'groupId',
      label: 'Group',
      type: 'select',
      placeholder: 'No group',
      options: [{ label: 'No group', value: '__none__' }, ...groupOptions]
    },
    {
      name: 'uomId',
      label: 'Unit (numbers only)',
      type: 'select',
      placeholder: 'No unit',
      options: [{ label: 'No unit', value: '__none__' }, ...uomOptions]
    },
    {
      name: 'isVariantAxis',
      label: 'Variant axis',
      type: 'checkbox',
      checkboxLabel: 'Use as a variant axis (ENUM only)'
    },
    {
      name: 'isRequired',
      label: 'Required',
      type: 'checkbox',
      checkboxLabel: 'Items must supply a value'
    },
    {
      name: 'isFilterable',
      label: 'Filterable',
      type: 'checkbox',
      checkboxLabel: 'Offer as a list filter'
    },
    { name: 'minValue', label: 'Min (number)', type: 'text', placeholder: '0' },
    { name: 'maxValue', label: 'Max (number)', type: 'text', placeholder: '500' },
    {
      name: 'defaultValue',
      label: 'Default value',
      type: 'text',
      placeholder: 'Optional default'
    },
    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox',
      checkboxLabel: 'Attribute is active'
    }
  ];
}

export function getAttributeFormSections(groupOptions = [], uomOptions = []) {
  const fields = getAttributeFields(groupOptions, uomOptions);
  const byName = Object.fromEntries(fields.map((field) => [field.name, field]));

  return [
    {
      id: 'identity',
      title: 'Attribute',
      description: 'What this property is called, and how values are stored.',
      icon: 'tags',
      fields: [
        byName.code,
        byName.name,
        byName.dataType,
        byName.groupId,
        byName.description
      ],
      columns: 2
    },
    {
      id: 'values',
      title: 'Values',
      description: 'Optional bounds and a default, plus a unit for numbers.',
      icon: 'ruler',
      fields: [
        byName.uomId,
        byName.defaultValue,
        byName.minValue,
        byName.maxValue
      ],
      columns: 2
    },
    {
      id: 'rules',
      title: 'Behaviour',
      description: 'How this attribute is used on items and lists.',
      icon: 'settings',
      fields: [
        byName.isVariantAxis,
        byName.isRequired,
        byName.isFilterable,
        byName.isActive
      ]
    }
  ];
}

export const groupSchema = z.object({
  code: z.string().trim().min(1, 'Code is required'),
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().optional(),
  isActive: z.boolean()
});

export const GROUP_DEFAULTS = {
  code: '',
  name: '',
  description: '',
  isActive: true
};

export const GROUP_FIELDS = [
  { name: 'code', label: 'Code', type: 'text', placeholder: 'PHYSICAL' },
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Physical Properties'
  },
  { name: 'description', label: 'Description', type: 'textarea' },
  {
    name: 'isActive',
    label: 'Active',
    type: 'checkbox',
    checkboxLabel: 'Group is active'
  }
];

export function getGroupFormSections() {
  const byName = Object.fromEntries(
    GROUP_FIELDS.map((field) => [field.name, field])
  );

  return [
    {
      id: 'identity',
      title: 'Group',
      description: 'A heading used when presenting attributes.',
      icon: 'tags',
      fields: [byName.code, byName.name, byName.description],
      columns: 2
    },
    {
      id: 'rules',
      title: 'Status',
      description: 'Whether this group is in use.',
      icon: 'settings',
      fields: [byName.isActive]
    }
  ];
}

export const setSchema = z.object({
  code: z.string().trim().min(1, 'Code is required'),
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().optional(),
  isActive: z.boolean()
});

export const SET_DEFAULTS = {
  code: '',
  name: '',
  description: '',
  isActive: true
};

export const SET_FIELDS = [
  { name: 'code', label: 'Code', type: 'text', placeholder: 'FABRIC_ROLL' },
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Fabric Roll' },
  { name: 'description', label: 'Description', type: 'textarea' },
  {
    name: 'isActive',
    label: 'Active',
    type: 'checkbox',
    checkboxLabel: 'Set is active'
  }
];

export function getSetFormSections() {
  const byName = Object.fromEntries(
    SET_FIELDS.map((field) => [field.name, field])
  );

  return [
    {
      id: 'identity',
      title: 'Set',
      description: 'The attribute template for a family of items.',
      icon: 'boxes',
      fields: [byName.code, byName.name, byName.description],
      columns: 2
    },
    {
      id: 'rules',
      title: 'Status',
      description: 'Whether this set is in use.',
      icon: 'settings',
      fields: [byName.isActive]
    }
  ];
}

export const optionSchema = z.object({
  code: z.string().trim().min(1, 'Code is required'),
  label: z.string().trim().min(1, 'Label is required')
});

export const addSetAttributeSchema = z.object({
  attributeId: z.string().min(1, 'Select an attribute'),
  isRequired: z.boolean()
});

export function getOptionFormSections() {
  return [
    {
      id: 'option',
      title: 'New option',
      description: 'Codes are stored uppercase.',
      icon: 'tags',
      columns: 2,
      fields: [
        { name: 'code', label: 'Code', type: 'text', placeholder: 'RED' },
        { name: 'label', label: 'Label', type: 'text', placeholder: 'Red' }
      ]
    }
  ];
}

export function getSetAttributeFormSections(attributeOptions = []) {
  return [
    {
      id: 'link',
      title: 'Add attribute',
      description: 'Link an existing attribute to this set.',
      icon: 'tags',
      fields: [
        {
          name: 'attributeId',
          label: 'Attribute',
          type: 'select',
          placeholder: 'Select attribute',
          options: attributeOptions
        },
        {
          name: 'isRequired',
          label: 'Required',
          type: 'checkbox',
          checkboxLabel: 'Required in this set'
        }
      ]
    }
  ];
}
