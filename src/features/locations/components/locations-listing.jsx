'use client';

import { Suspense } from 'react';
import { LocationsTable, LocationsTableSkeleton } from './locations-table';

export default function LocationsListing() {
  return (
    <Suspense fallback={<LocationsTableSkeleton />}>
      <LocationsTable />
    </Suspense>
  );
}
