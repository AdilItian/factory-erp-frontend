import PageContainer from '@/components/layout/page-container';

export default function ProfileViewPage() {
  return (
    <PageContainer
      pageTitle='Profile'
      pageDescription='Manage your account settings and preferences.'
    >
      <div className='flex flex-col items-center justify-center py-24 text-center'>
        <p className='text-muted-foreground text-lg'>No authentication provider configured.</p>
        <p className='text-muted-foreground mt-2 text-sm'>
          Connect an auth provider to enable profile management.
        </p>
      </div>
    </PageContainer>
  );
}
