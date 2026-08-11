/**
 * Sample form config
 *
 * Select options can come from three sources:
 *
 * 1) Static — hardcoded items
 * options: {
 *   source: 'static',
 *   items: [{ label: 'Admin', value: 'admin' }]
 * }
 *
 * 2) Shared query — uses features/roles via lib/options-query-registry.js
 * options: {
 *   source: 'query',
 *   queryRef: 'roles'
 * }
 */
export const sampleFormConfig = {
  fields: [
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Jane Doe',
      required: true
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'you@example.com',
      required: true
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      placeholder: '25',
      required: true
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      placeholder: 'Select a role',
      required: true,
      options: {
        source: 'query',
        queryRef: 'roles'
      }
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      placeholder: 'Tell us about yourself',
      required: false
    },
    {
      name: 'avatar',
      label: 'Profile Photo',
      type: 'file',
      placeholder: 'Upload a photo',
      accept: 'image/*',
      required: false
    },
    {
      name: 'terms',
      label: 'Terms',
      type: 'checkbox',
      checkboxLabel: 'I agree to the terms and conditions',
      required: true
    }
  ]
};
