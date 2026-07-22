import PageContainer from '@/components/layout/page-container';
import ProjectListingPage from '@/features/project/components/project-listing';

export const metadata = {
  title: 'Projects'
};

export default function ProjectsPage() {
  return (
    <PageContainer pageTitle='Projects' pageDescription='Browse and manage all projects.'>
      <ProjectListingPage />
    </PageContainer>
  );
}
