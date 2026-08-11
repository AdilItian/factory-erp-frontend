'use client';

import PageContainer from '@/components/layout/page-container';
import RolesListingPage from '@/features/roles/components/roles-listing';
import { RoleFormSheetTrigger } from '@/features/roles/components/role-form-sheet-trigger';

export default function RolesManagementPage() {
  return (
    <PageContainer
      pageTitle='Roles'
      pageDescription='Create roles and assign or revoke them for users.'
      pageHeaderAction={<RoleFormSheetTrigger />}
    >
      <RolesListingPage />
    </PageContainer>
  );
}
