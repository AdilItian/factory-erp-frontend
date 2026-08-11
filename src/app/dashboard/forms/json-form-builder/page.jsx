import PageContainer from '@/components/layout/page-container';
import FormBuilderDemo from '@/features/form-builder/components/form-builder-demo';
import { rolesQueryOptions } from '@/features/roles/api/queries';
import { getQueryClient } from '@/lib/query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const metadata = {
  title: 'Dashboard: JSON Form Builder'
};

export default function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(rolesQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageContainer
        pageTitle='JSON Form Builder'
        pageDescription='Render forms from a JSON config with stacked field layouts.'
      >
        <FormBuilderDemo />
      </PageContainer>
    </HydrationBoundary>
  );
}
