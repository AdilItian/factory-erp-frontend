'use client';

import { Suspense } from 'react';
import { RolesTable, RolesTableSkeleton } from './roles-table';

export default function RolesListingPage() {
  return (
    <Suspense fallback={<RolesTableSkeleton />}>
      <RolesTable />
    </Suspense>
  );
}
