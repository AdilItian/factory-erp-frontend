'use client';

import PageContainer from '@/components/layout/page-container';
import UsersManagementListing from '@/features/users/components/management/users-management-listing';
import { UserInviteSheetTrigger } from '@/features/users/components/management/user-invite-sheet-trigger';

export default function UsersManagementPage() {
  return (
    <PageContainer
      pageTitle='Users'
      pageDescription='Invite users, update status, and manage access.'
      pageHeaderAction={<UserInviteSheetTrigger />}
    >
      <UsersManagementListing />
    </PageContainer>
  );
}
