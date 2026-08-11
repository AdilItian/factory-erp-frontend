import { Metadata } from 'next';
import SignInViewV2 from '@/features/auth/components/sign-in-view-v2';

export const metadata: Metadata = {
  title: 'Sign In V2'
};

export default function Page() {
  return <SignInViewV2 />;
}
