'use client';

import PageContainer from '@/components/layout/page-container';
import { FormSheetTrigger } from '@/components/erp/form-sheet-trigger';
import LocationsListing from './locations-listing';
import { LocationFormSheet } from './location-form-sheet';

export default function LocationsManagementPage() {
  return (
    <PageContainer
      pageTitle='Locations'
      pageDescription='Factories, outlets, warehouses, and offices.'
      pageHeaderAction={
        <FormSheetTrigger label='Add location'>
          {({ open, onOpenChange }) => (
            <LocationFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <LocationsListing />
    </PageContainer>
  );
}
