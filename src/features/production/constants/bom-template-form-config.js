import { z } from 'zod';
import {
  BOM_LINE_DEFAULTS,
  bomLineSchema,
  getBomLineFields,
  getBomLineFormSections
} from './bom-form-config';

export { BOM_LINE_DEFAULTS, bomLineSchema, getBomLineFormSections };

export const bomTemplateSchema = z.object({
  code: z.string().trim().min(1, 'Code is required'),
  name: z.string().trim().min(2, 'Name is required'),
  itemId: z.string().min(1, 'Select the finished item'),
  baseQty: z.string().trim().min(1, 'Base quantity is required'),
  notes: z.string().optional(),
  isActive: z.boolean()
});

export const BOM_TEMPLATE_DEFAULTS = {
  code: '',
  name: '',
  itemId: '',
  baseQty: '1',
  notes: '',
  isActive: true
};

export function getBomTemplateFormSections(itemOptions = []) {
  return [
    {
      id: 'identity',
      title: 'BoM template',
      description: 'Reusable per-piece recipe for a finished good.',
      icon: 'bomTemplate',
      columns: 2,
      fields: [
        {
          name: 'code',
          label: 'Code',
          type: 'text',
          placeholder: 'TPL-TSHIRT-BASIC'
        },
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Basic T-shirt (per piece)'
        },
        {
          name: 'itemId',
          label: 'Finished item',
          type: 'select',
          placeholder: 'Select item',
          options: itemOptions
        },
        {
          name: 'baseQty',
          label: 'Base qty',
          type: 'text',
          placeholder: '1'
        },
        {
          name: 'notes',
          label: 'Notes',
          type: 'textarea',
          placeholder: 'Standard crew-neck cut-make-trim'
        }
      ]
    },
    {
      id: 'rules',
      title: 'Status',
      description: 'Inactive templates are hidden when creating a BoM.',
      icon: 'settings',
      fields: [
        {
          name: 'isActive',
          label: 'Active',
          type: 'checkbox',
          checkboxLabel: 'Template is active'
        }
      ]
    }
  ];
}

export function getBomTemplateLineFields(itemOptions = [], workCenterOptions = []) {
  return getBomLineFields(itemOptions, workCenterOptions);
}
