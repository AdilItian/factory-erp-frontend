import { z } from 'zod';

export const departmentSchema = z.object({
  code: z.string().trim().min(1, 'Code is required').max(32),
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  locationId: z.string().optional(),
  isActive: z.boolean()
});

export const DEPARTMENT_DEFAULTS = {
  code: '',
  name: '',
  description: '',
  locationId: '__none__',
  isActive: true
};

export function getDepartmentFields(locationOptions = []) {
  return [
    {
      name: 'code',
      label: 'Code',
      type: 'text',
      placeholder: 'PROD'
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Production'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Runs work orders on the shop floor'
    },
    {
      name: 'locationId',
      label: 'Location (optional)',
      type: 'select',
      placeholder: 'Company-wide',
      options: [{ label: 'Company-wide', value: '__none__' }, ...locationOptions]
    },
    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox',
      checkboxLabel: 'Department is active'
    }
  ];
}

export function getDepartmentFormSections(locationOptions = []) {
  const fields = getDepartmentFields(locationOptions);
  const byName = Object.fromEntries(fields.map((field) => [field.name, field]));

  return [
    {
      id: 'identity',
      title: 'Department',
      description: 'How this team is named, and where it sits.',
      icon: 'sitemap',
      fields: [byName.code, byName.name, byName.locationId, byName.description],
      columns: 2
    },
    {
      id: 'rules',
      title: 'Status',
      description: 'Whether this department is in use.',
      icon: 'settings',
      fields: [byName.isActive]
    }
  ];
}
