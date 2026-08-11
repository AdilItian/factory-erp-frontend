'use client';

import { Suspense } from 'react';
import { MyTasksKanban, ProjectTasksKanban } from './project-tasks-kanban';

function KanbanSkeleton() {
  return (
    <div className='flex gap-4 overflow-hidden'>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className='bg-muted h-96 w-80 shrink-0 animate-pulse rounded-md'
        />
      ))}
    </div>
  );
}

export function ProjectTasksListing({ projectId }) {
  return (
    <Suspense fallback={<KanbanSkeleton />}>
      <ProjectTasksKanban projectId={projectId} />
    </Suspense>
  );
}

export function MyTasksListing() {
  return (
    <Suspense fallback={<KanbanSkeleton />}>
      <MyTasksKanban />
    </Suspense>
  );
}
