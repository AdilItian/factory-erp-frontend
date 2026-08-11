import { z } from 'zod';

export const inviteUserSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  roleId: z.string().optional()
});

export const updateUserSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  isActive: z.boolean()
});

export function getInviteUserFields(roleOptions = []) {
  return [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'teammate@example.com'
    },
    {
      name: 'roleId',
      label: 'Additional role (optional)',
      type: 'select',
      placeholder: 'Select a role',
      options: [{ label: 'None (default user role only)', value: '__none__' }, ...roleOptions]
    }
  ];
}

export const UPDATE_USER_FIELDS = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'user@example.com'
  },
  {
    name: 'isActive',
    label: 'Active',
    type: 'checkbox',
    checkboxLabel: 'User can sign in'
  }
];
