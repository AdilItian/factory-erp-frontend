import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must be at most 50 characters'),
  description: z
    .string()
    .max(200, 'Description must be at most 200 characters')
    .optional()
});

export const CREATE_ROLE_FIELDS = [
  {
    name: 'name',
    label: 'Role name',
    type: 'text',
    placeholder: 'project_manager'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Can create and assign tasks'
  }
];

export const assignRoleSchema = z.object({
  userId: z.string().min(1, 'Select a user')
});

export function getAssignRoleFields(userOptions = []) {
  return [
    {
      name: 'userId',
      label: 'User',
      type: 'select',
      placeholder: 'Select a user',
      options: userOptions
    }
  ];
}
