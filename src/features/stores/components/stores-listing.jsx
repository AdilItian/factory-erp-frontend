'use client';

import { Suspense } from 'react';
import { StoresTable, StoresTableSkeleton } from './stores-table';

export default function StoresListing() {
  return (
    <Suspense fallback={<StoresTableSkeleton />}>
      <StoresTable />
    </Suspense>
  );
}
