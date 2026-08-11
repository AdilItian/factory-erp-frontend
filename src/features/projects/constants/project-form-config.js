import { z } from 'zod';

export const PROJECT_STATUS_OPTIONS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Archived', value: 'ARCHIVED' }
];

export const createProjectSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  description: z.string().max(500).optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).default('ACTIVE'),
  projectManagerId: z.string().optional()
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  description: z.string().max(500).optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED'])
});

export const assignManagersSchema = z.object({
  projectManagerId: z.string().min(1, 'Select a project manager')
});

export function getCreateProjectFields(managerOptions = []) {
  return [
    {
      name: 'name',
      label: 'Project name',
      type: 'text',
      placeholder: 'Mobile App Redesign'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Q3 redesign of the customer mobile app.'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      options: PROJECT_STATUS_OPTIONS
    },
    {
      name: 'projectManagerId',
      label: 'Project manager (optional)',
      type: 'select',
      placeholder: 'Select a manager',
      options: [
        { label: 'None', value: '__none__' },
        ...managerOptions
      ]
    }
  ];
}

export const UPDATE_PROJECT_FIELDS = [
  {
    name: 'name',
    label: 'Project name',
    type: 'text',
    placeholder: 'Mobile App Redesign'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Project description'
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'Select status',
    options: PROJECT_STATUS_OPTIONS
  }
];

export function getAssignManagerFields(managerOptions = []) {
  return [
    {
      name: 'projectManagerId',
      label: 'Project manager',
      type: 'select',
      placeholder: 'Select a manager',
      options: managerOptions
    }
  ];
}
