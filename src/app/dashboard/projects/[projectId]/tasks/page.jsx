import ProjectTasksPage from '@/features/project-tasks/components/project-tasks-page';

export const metadata = {
  title: 'Dashboard: Project tasks'
};

export default async function Page({ params }) {
  const { projectId } = await params;
  return <ProjectTasksPage projectId={projectId} />;
}
