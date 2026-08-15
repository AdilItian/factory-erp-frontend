import { z } from 'zod';

export const customerSchema = z.object({
  code: z.string().trim().min(1, 'Code is required'),
  name: z.string().trim().min(2, 'Name is required'),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  city: z.string().optional(),
  paymentTerms: z.string().optional(),
  isActive: z.boolean()
});

export const CUSTOMER_DEFAULTS = {
  code: '',
  name: '',
  contactName: '',
  phone: '',
  email: '',
  city: '',
  paymentTerms: 'Net 30',
  isActive: true
};

export function getCustomerFormSections() {
  return [
    {
      id: 'identity',
      title: 'Customer',
      description: 'Outlets, wholesalers, and export buyers.',
      icon: 'customer',
      columns: 2,
      fields: [
        { name: 'code', label: 'Code', type: 'text', placeholder: 'CUS-ISB' },
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Islamabad Flagship Outlet'
        },
        {
          name: 'contactName',
          label: 'Contact',
          type: 'text',
          placeholder: 'Sara Ahmed'
        },
        {
          name: 'phone',
          label: 'Phone',
          type: 'text',
          placeholder: '+92 51 1112233'
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'sara@example.com'
        },
        { name: 'city', label: 'City', type: 'text', placeholder: 'Islamabad' },
        {
          name: 'paymentTerms',
          label: 'Payment terms',
          type: 'text',
          placeholder: 'Net 15'
        }
      ]
    },
    {
      id: 'rules',
      title: 'Status',
      description: 'Inactive customers are hidden on new sales orders.',
      icon: 'settings',
      fields: [
        {
          name: 'isActive',
          label: 'Active',
          type: 'checkbox',
          checkboxLabel: 'Customer is active'
        }
      ]
    }
  ];
}
