'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import JsonForm from '@/features/form-builder/components/json-form';
import { useLoginMutation } from '@/features/auth/api/mutations';
import { signInFormConfig } from '@/features/auth/constants/sign-in-form-config';
import { saveAuthData } from '@/lib/auth-storage';
import { PATHS } from '@/lib/pages-path';
import {
  getAuthErrorMessage,
  normalizeAuthResponse
} from '@/features/auth/utils/normalize-auth-response';

export default function SignInViewV2() {
  const router = useRouter();

  const { mutateAsync: login } = useLoginMutation();

  async function handleSubmit(values) {
    try {
      const data = await login(values);
      const result = normalizeAuthResponse(data);

      if (result.success) {
        saveAuthData(result.auth);
        toast.success('Welcome back!');
        router.push(PATHS.REDIRECT_AFTER_LOGIN);
        return;
      }

      toast.error(result.message ?? 'Login failed');
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    }
  }

  return (
    <div className='bg-card w-full max-w-md rounded-2xl border p-8 shadow-sm'>
      <div className='mb-6 text-center'>
        <h1 className='text-foreground text-2xl font-bold'>Sign in</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Enter your credentials to continue
        </p>
      </div>
      <JsonForm
        config={signInFormConfig}
        onSubmit={handleSubmit}
        submitLabel='Sign in'
        submitButtonClassName='w-full'
        loadingText='Signing in...'
        formClassName='space-y-4'
        className='space-y-4'
      />
      <p className='text-muted-foreground mt-4 text-center text-sm'>
        Don&apos;t have an account?{' '}
        <Link href='/auth/sign-up' className='text-primary hover:underline'>
          Sign up
        </Link>
      </p>
    </div>
  );
}
