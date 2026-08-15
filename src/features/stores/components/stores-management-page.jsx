'use client';

import PageContainer from '@/components/layout/page-container';
import StoresListing from './stores-listing';
import { ProvisionStoresButton, StoreFormSheetTrigger } from './store-actions';

export default function StoresManagementPage() {
  return (
    <PageContainer
      pageTitle='Stores'
      pageDescription='Stock rooms at each location.'
      pageHeaderAction={
        <div className='flex flex-wrap items-center gap-2'>
          <ProvisionStoresButton />
          <StoreFormSheetTrigger />
        </div>
      }
    >
      <StoresListing />
    </PageContainer>
  );
}
