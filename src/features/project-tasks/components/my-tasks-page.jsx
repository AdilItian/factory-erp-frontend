'use client';

import PageContainer from '@/components/layout/page-container';
import { MyTasksListing } from './project-tasks-listing';

export default function MyTasksPage() {
  return (
    <PageContainer
      pageTitle='My tasks'
      pageDescription='Tasks assigned to you. Drag cards or open a task to update its status.'
    >
      <MyTasksListing />
    </PageContainer>
  );
}
