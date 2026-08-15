import { z } from 'zod';

export const supplierSchema = z.object({
  code: z.string().trim().min(1, 'Code is required'),
  name: z.string().trim().min(2, 'Name is required'),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  city: z.string().optional(),
  paymentTerms: z.string().optional(),
  isActive: z.boolean()
});

export const SUPPLIER_DEFAULTS = {
  code: '',
  name: '',
  contactName: '',
  phone: '',
  email: '',
  city: '',
  paymentTerms: 'Net 30',
  isActive: true
};

export function getSupplierFormSections() {
  return [
    {
      id: 'identity',
      title: 'Supplier',
      description: 'Who you buy fabric, trims, and packaging from.',
      icon: 'supplier',
      columns: 2,
      fields: [
        { name: 'code', label: 'Code', type: 'text', placeholder: 'SUP-TEX' },
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Lahore Textile Mills'
        },
        {
          name: 'contactName',
          label: 'Contact',
          type: 'text',
          placeholder: 'Asif Raza'
        },
        {
          name: 'phone',
          label: 'Phone',
          type: 'text',
          placeholder: '+92 300 1112233'
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'asif@example.com'
        },
        { name: 'city', label: 'City', type: 'text', placeholder: 'Lahore' },
        {
          name: 'paymentTerms',
          label: 'Payment terms',
          type: 'text',
          placeholder: 'Net 30'
        }
      ]
    },
    {
      id: 'rules',
      title: 'Status',
      description: 'Inactive suppliers are hidden on new purchase orders.',
      icon: 'settings',
      fields: [
        {
          name: 'isActive',
          label: 'Active',
          type: 'checkbox',
          checkboxLabel: 'Supplier is active'
        }
      ]
    }
  ];
}
