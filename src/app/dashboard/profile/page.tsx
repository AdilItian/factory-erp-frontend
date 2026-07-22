import { Metadata } from 'next';
import ProfileViewPage from '@/features/profile/components/profile-view-page';

export const metadata: Metadata = {
  title: 'Dashboard: Profile'
};

export default function Page() {
  return <ProfileViewPage />;
}
