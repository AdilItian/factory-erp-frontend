import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sign-in-view';

export const metadata: Metadata = {
  title: 'Sign In'
};

export default function Page() {
  return <SignInViewPage />;
}
