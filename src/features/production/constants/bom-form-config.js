import { z } from 'zod';

export const bomSchema = z.object({
  code: z.string().trim().min(1, 'Code is required'),
  name: z.string().trim().min(2, 'Name is required'),
  itemId: z.string().min(1, 'Select the finished item'),
  version: z.string().optional(),
  outputQty: z.string().trim().min(1, 'Output quantity is required'),
  isActive: z.boolean()
});

export const BOM_DEFAULTS = {
  code: '',
  name: '',
  itemId: '',
  version: '1',
  outputQty: '1',
  isActive: true
};

export const bomLineSchema = z.object({
  itemId: z.string().min(1, 'Select a component'),
  quantity: z.string().trim().min(1, 'Quantity is required'),
  scrapPercent: z.string().optional(),
  workCenterId: z.string().optional()
});

export const BOM_LINE_DEFAULTS = {
  itemId: '',
  quantity: '',
  scrapPercent: '0',
  workCenterId: '__none__'
};

export function getBomFormSections(itemOptions = []) {
  return [
    {
      id: 'identity',
      title: 'Bill of materials',
      description: 'The recipe for one finished item.',
      icon: 'bom',
      columns: 2,
      fields: [
        {
          name: 'code',
          label: 'Code',
          type: 'text',
          placeholder: 'BOM-TSHIRT-BASIC'
        },
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Basic T-shirt recipe'
        },
        {
          name: 'itemId',
          label: 'Finished item',
          type: 'select',
          placeholder: 'Select item',
          options: itemOptions
        },
        {
          name: 'version',
          label: 'Version',
          type: 'text',
          placeholder: '1'
        },
        {
          name: 'outputQty',
          label: 'Output qty',
          type: 'text',
          placeholder: '1'
        }
      ]
    },
    {
      id: 'rules',
      title: 'Status',
      description: 'Inactive recipes are hidden on new work orders.',
      icon: 'settings',
      fields: [
        {
          name: 'isActive',
          label: 'Active',
          type: 'checkbox',
          checkboxLabel: 'BoM is active'
        }
      ]
    }
  ];
}

export function getBomLineFields(itemOptions = [], workCenterOptions = []) {
  return [
    {
      name: 'itemId',
      label: 'Component',
      type: 'select',
      placeholder: 'Select item',
      options: itemOptions
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'text',
      placeholder: '0.350'
    },
    {
      name: 'scrapPercent',
      label: 'Scrap %',
      type: 'text',
      placeholder: '3'
    },
    {
      name: 'workCenterId',
      label: 'Work center',
      type: 'select',
      placeholder: 'Optional',
      options: [{ label: 'None', value: '__none__' }, ...workCenterOptions]
    }
  ];
}

export function getBomLineFormSections(itemOptions = [], workCenterOptions = []) {
  return [
    {
      id: 'component',
      title: 'Component',
      description: 'What goes into one finished piece, and how much.',
      icon: 'package',
      columns: 2,
      fields: getBomLineFields(itemOptions, workCenterOptions)
    }
  ];
}
