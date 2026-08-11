'use client';

import { useEffect, useMemo } from 'react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useRouter } from 'next/navigation';
import { ListToolbar } from '@/components/ui/list-toolbar';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useProjectsListQuery } from '../../api/queries';
import {
  formatProjectDate,
  getProjectDescription,
  getProjectId,
  getProjectManagers,
  getProjectName,
  getProjectStatus
} from '../../utils/normalize-project';
import { CellAction } from './cell-action';

export function ProjectsManagementTable() {
  const router = useRouter();
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(12),
    name: parseAsString
  });

  const filters = { page: params.page, limit: params.perPage };
  const { data, isPending, isError, error, refetch } =
    useProjectsListQuery(filters);

  const projects = data?.projects ?? [];

  useEffect(() => {
    const total = Number(data?.total ?? 0);
    if (!data || params.page <= 1 || projects.length > 0) return;
    const maxPage = Math.max(1, Math.ceil(total / (params.perPage || 12)));
    if (params.page > maxPage) void setParams({ page: maxPage });
  }, [data, params.page, params.perPage, projects.length, setParams]);

  const filteredProjects = useMemo(() => {
    const query = params.name?.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) => {
      const name = getProjectName(project).toLowerCase();
      const description = getProjectDescription(project).toLowerCase();
      return name.includes(query) || description.includes(query);
    });
  }, [projects, params.name]);

  const total = params.name?.trim()
    ? filteredProjects.length
    : (data?.total ?? filteredProjects.length);
  const pageCount = Math.max(1, Math.ceil(total / params.perPage));
  const rows = params.name?.trim()
    ? filteredProjects.slice(0, params.perPage)
    : filteredProjects;

  if (isPending) {
    return (
      <div className='grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='bg-muted/40 h-24 animate-pulse rounded-xl' />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className='text-destructive text-sm'>
        {getApiErrorMessage(error, 'Failed to load projects')}{' '}
        <button type='button' className='underline' onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <ListToolbar
        search={params.name ?? ''}
        onSearchChange={(value) =>
          void setParams({ name: value || null, page: 1 })
        }
        searchPlaceholder='Filter projects…'
        total={total}
        page={params.page}
        pageCount={pageCount}
        onPageChange={(page) => void setParams({ page })}
      />

      {rows.length === 0 ? (
        <p className='text-muted-foreground py-8 text-center text-sm'>
          No projects found.
        </p>
      ) : (
        <div className='grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3'>
          {rows.map((project) => {
            const name = getProjectName(project);
            const status = getProjectStatus(project);
            const managers = getProjectManagers(project);
            const projectId = getProjectId(project);
            const active = status === 'ACTIVE';

            return (
              <div
                key={projectId}
                className='border-border/70 bg-card group relative flex min-h-[5.5rem] flex-col justify-between overflow-hidden rounded-xl border p-3 shadow-xs'
              >
                <div
                  className={
                    active
                      ? 'bg-primary absolute inset-y-0 left-0 w-0.5'
                      : 'bg-muted-foreground/30 absolute inset-y-0 left-0 w-0.5'
                  }
                />
                <div className='flex items-start justify-between gap-2 pl-2'>
                  <button
                    type='button'
                    className='min-w-0 flex-1 text-left'
                    onClick={() =>
                      router.push(`/dashboard/projects/${projectId}/tasks`)
                    }
                  >
                    <p className='text-foreground truncate text-sm font-semibold tracking-tight'>
                      {name}
                    </p>
                    <p className='text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-snug'>
                      {getProjectDescription(project) || 'No description'}
                    </p>
                  </button>
                  <CellAction data={project} />
                </div>
                <div className='text-muted-foreground mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 pl-2 text-[11px]'>
                  <span className={active ? 'text-foreground' : ''}>
                    {active ? 'Active' : 'Archived'}
                  </span>
                  <span>·</span>
                  <span>
                    {managers.length} mgr{managers.length === 1 ? '' : 's'}
                  </span>
                  <span>·</span>
                  <span>
                    {formatProjectDate(
                      project.createdAt ??
                        project.created_at ??
                        project.createdDate
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ProjectsManagementTableSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3'>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className='bg-muted/40 h-24 animate-pulse rounded-xl' />
      ))}
    </div>
  );
}
