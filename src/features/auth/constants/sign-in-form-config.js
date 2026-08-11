export const signInFormConfig = {
  fields: [
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
      placeholder: '••••••••',
      required: true,
      minLength: 6
    }
  ]
};
