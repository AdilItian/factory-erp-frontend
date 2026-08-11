'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import LoadingButton from '@/components/ui/loading-button';
import FormBuilder from '@/components/ui/form-builder';
import Link from 'next/link';
import { useRegisterMutation } from '@/features/auth/api/mutations';
import { saveAuthData } from '@/lib/auth-storage';
import { toast } from 'sonner';
import { PATHS } from '@/lib/pages-path';
import {
  getAuthErrorMessage,
  normalizeAuthResponse
} from '@/features/auth/utils/normalize-auth-response';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

const SIGN_UP_FIELDS = [
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Jane Doe'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: '••••••••'
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: '••••••••'
  }
];

export default function SignUpViewPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' }
  });

  const { mutate: register, isPending } = useRegisterMutation({
    onSuccess: (data) => {
      const result = normalizeAuthResponse(data);

      if (result.success) {
        saveAuthData(result.auth);
        toast.success('Account created successfully!');
        router.push(PATHS.REDIRECT_AFTER_LOGIN);
      } else {
        toast.error(result.message ?? 'Registration failed');
      }
    },
    onError: (error) => {
      toast.error(getAuthErrorMessage(error, 'Registration failed'));
    }
  });

  function onSubmit(values) {
    register(values);
  }

  return (
    <div className='bg-card w-full max-w-md rounded-2xl border p-8 shadow-sm'>
      <div className='mb-6 text-center'>
        <h1 className='text-foreground text-2xl font-bold'>Create an account</h1>
        <p className='text-muted-foreground mt-1 text-sm'>Fill in your details to get started</p>
      </div>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <FormBuilder control={control} errors={errors} fields={SIGN_UP_FIELDS} />
        <LoadingButton
          className='w-full'
          type='submit'
          isLoading={isPending}
          loadingText='Creating account...'
        >
          Create account
        </LoadingButton>
      </form>
      <p className='text-muted-foreground mt-4 text-center text-sm'>
        Already have an account?{' '}
        <Link href='/auth/sign-in' className='text-primary hover:underline'>
          Sign in
        </Link>
      </p>
    </div>
  );
}
