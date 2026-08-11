'use client';

import { Suspense } from 'react';
import {
  UsersManagementTable,
  UsersManagementTableSkeleton
} from './users-table';

export default function UsersManagementListing() {
  return (
    <Suspense fallback={<UsersManagementTableSkeleton />}>
      <UsersManagementTable />
    </Suspense>
  );
}
