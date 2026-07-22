import { Metadata } from 'next';
import PageContainer from '@/components/layout/page-container';

export const metadata: Metadata = {
  title: 'Dashboard: Team'
};

export default function TeamPage() {
  return (
    <PageContainer
      pageTitle='Team Management'
      pageDescription='Manage team members, roles, and permissions.'
    >
      <div className='flex flex-col items-center justify-center py-24 text-center'>
        <p className='text-muted-foreground text-lg'>No authentication provider configured.</p>
        <p className='text-muted-foreground mt-2 text-sm'>
          Connect an auth provider to enable team management.
        </p>
      </div>
    </PageContainer>
  );
}
