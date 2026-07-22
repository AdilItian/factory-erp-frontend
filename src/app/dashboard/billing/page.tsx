import { Metadata } from 'next';
import PageContainer from '@/components/layout/page-container';

export const metadata: Metadata = {
  title: 'Dashboard: Billing'
};

export default function BillingPage() {
  return (
    <PageContainer
      pageTitle='Billing & Plans'
      pageDescription='Manage your subscription and billing details.'
    >
      <div className='flex flex-col items-center justify-center py-24 text-center'>
        <p className='text-muted-foreground text-lg'>No billing provider configured.</p>
        <p className='text-muted-foreground mt-2 text-sm'>
          Connect a billing provider to manage subscriptions.
        </p>
      </div>
    </PageContainer>
  );
}
