'use client';

import PageContainer from '@/components/layout/page-container';
import ProjectsListing from './projects-listing';
import { ProjectFormSheetTrigger } from './project-form-sheet-trigger';

export default function ProjectsManagementPage() {
  return (
    <PageContainer
      pageTitle='Projects'
      pageDescription='Create and manage projects, status, and managers.'
      pageHeaderAction={<ProjectFormSheetTrigger />}
    >
      <ProjectsListing />
    </PageContainer>
  );
}
