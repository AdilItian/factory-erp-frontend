'use client';

import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import {
  getProjectName,
  getProjectStatus
} from '@/features/projects/utils/normalize-project';
import { useProjectDetailQuery } from '../api/queries';
import { ProjectTasksListing } from './project-tasks-listing';
import { TaskFormSheetTrigger } from './task-form-sheet-trigger';

export default function ProjectTasksPage({ projectId }) {
  const { data: project } = useProjectDetailQuery(projectId, {
    enabled: Boolean(projectId)
  });

  const projectName = project ? getProjectName(project) : 'Project';
  const projectStatus = project ? getProjectStatus(project) : null;

  return (
    <PageContainer>
      <div className='mb-3 flex flex-wrap items-center justify-between gap-3'>
        <div className='flex min-w-0 items-center gap-2'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='text-muted-foreground size-8 shrink-0'
            render={<Link href='/dashboard/projects' />}
            aria-label='Back to projects'
          >
            <Icons.chevronLeft className='size-4' />
          </Button>

          <div className='min-w-0'>
            <div className='flex min-w-0 items-center gap-2'>
              <h1 className='text-foreground truncate text-lg font-semibold tracking-tight sm:text-xl'>
                {projectName}
              </h1>
              {projectStatus ? (
                <Badge
                  variant={projectStatus === 'ACTIVE' ? 'secondary' : 'outline'}
                  className='h-5 shrink-0 rounded-md px-1.5 text-[10px] font-medium'
                >
                  {projectStatus === 'ACTIVE' ? 'Active' : 'Archived'}
                </Badge>
              ) : null}
            </div>
            <p className='text-muted-foreground text-xs'>
              Projects · Task board
            </p>
          </div>
        </div>

        <TaskFormSheetTrigger projectId={projectId} />
      </div>

      <ProjectTasksListing projectId={projectId} />
    </PageContainer>
  );
}
