'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import LoadingButton from '@/components/ui/loading-button';
import FormBuilder from '@/components/ui/form-builder';
import Link from 'next/link';
import { useLoginMutation } from '@/features/auth/api/mutations';
import { saveAuthData } from '@/lib/auth-storage';
import { toast } from 'sonner';
import { PATHS } from '@/lib/pages-path';
import {
  getAuthErrorMessage,
  normalizeAuthResponse
} from '@/features/auth/utils/normalize-auth-response';
const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const SIGN_IN_FIELDS = [
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
  }
];

export default function SignInViewPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const { mutate: login, isPending } = useLoginMutation({
    onSuccess: (data) => {
      const result = normalizeAuthResponse(data);

      if (result.success) {
        saveAuthData(result.auth);
        toast.success('Welcome back!');
        router.push(PATHS.REDIRECT_AFTER_LOGIN);
      } else {
        toast.error(result.message ?? 'Login failed');
      }
    },
    onError: (error) => {
      toast.error(getAuthErrorMessage(error));
    }
  });

  function onSubmit(values) {
    login(values);
  }

  return (
    <div className='bg-card w-full max-w-md rounded-2xl border p-8 shadow-sm'>
      <div className='mb-6 text-center'>
        <h1 className='text-foreground text-2xl font-bold'>Sign in</h1>
        <p className='text-muted-foreground mt-1 text-sm'>Enter your credentials to continue</p>
      </div>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <FormBuilder control={control} errors={errors} fields={SIGN_IN_FIELDS} />
        <LoadingButton
          className='w-full'
          type='submit'
          isLoading={isPending}
          loadingText='Signing in...'
        >
          Sign in
        </LoadingButton>
      </form>
      <p className='text-muted-foreground mt-4 text-center text-sm'>
        Don&apos;t have an account?{' '}
        <Link href='/auth/sign-up' className='text-primary hover:underline'>
          Sign up
        </Link>
      </p>
    </div>
  );
}
