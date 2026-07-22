import { Metadata } from 'next';
import PageContainer from '@/components/layout/page-container';

export const metadata: Metadata = {
  title: 'Dashboard: Exclusive'
};

export default function ExclusivePage() {
  return (
    <PageContainer pageTitle='Exclusive' pageDescription='Premium content for Pro plan members.'>
      <div className='flex flex-col items-center justify-center py-24 text-center'>
        <p className='text-muted-foreground text-lg'>Plan-based access control not configured.</p>
        <p className='text-muted-foreground mt-2 text-sm'>
          Connect a billing provider to enable plan-gated content.
        </p>
      </div>
    </PageContainer>
  );
}
