'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import Link from 'next/link';

export default function SignUpViewPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='bg-card w-full max-w-md rounded-2xl border p-8 shadow-sm'>
      <div className='mb-6 text-center'>
        <h1 className='text-foreground text-2xl font-bold'>Create an account</h1>
        <p className='text-muted-foreground mt-1 text-sm'>Fill in your details to get started</p>
      </div>
      <form className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='name'>Full name</Label>
          <Input id='name' type='text' placeholder='Jane Doe' />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' type='email' placeholder='you@example.com' />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='password'>Password</Label>
          <div className='relative'>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              className='pr-10'
            />
            <button
              type='button'
              onClick={() => setShowPassword((v) => !v)}
              className='text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <Icons.eyeOff className='h-4 w-4' />
              ) : (
                <Icons.eye className='h-4 w-4' />
              )}
            </button>
          </div>
        </div>
        <Button className='w-full' type='submit'>
          Create account
        </Button>
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
