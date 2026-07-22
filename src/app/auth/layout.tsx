import { Suspense } from 'react';
import GuestGuard from '@/components/guards/guest-guard';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <Suspense>
        <GuestGuard>{children}</GuestGuard>
      </Suspense>
    </div>
  );
}
