'use client';

import { useMemo } from 'react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { ListToolbar } from '@/components/ui/list-toolbar';
import { useRolesSuspenseQuery } from '../../api/queries';
import {
  getRoleDescription,
  getRoleId,
  getRoleName
} from '../../utils/normalize-role';
import { CellAction } from './cell-action';

export function RolesTable() {
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(20),
    name: parseAsString
  });

  const { data: roles = [] } = useRolesSuspenseQuery();

  const filteredRoles = useMemo(() => {
    const query = params.name?.trim().toLowerCase();
    if (!query) return roles;
    return roles.filter((role) => {
      const name = getRoleName(role).toLowerCase();
      const description = getRoleDescription(role).toLowerCase();
      return name.includes(query) || description.includes(query);
    });
  }, [roles, params.name]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredRoles.length / params.perPage)
  );
  const pageIndex = Math.min(Math.max(params.page, 1), pageCount) - 1;
  const rows = filteredRoles.slice(
    pageIndex * params.perPage,
    pageIndex * params.perPage + params.perPage
  );

  return (
    <div className='flex flex-col gap-3'>
      <ListToolbar
        search={params.name ?? ''}
        onSearchChange={(value) =>
          void setParams({ name: value || null, page: 1 })
        }
        searchPlaceholder='Filter roles…'
        total={filteredRoles.length}
        page={Math.min(params.page, pageCount)}
        pageCount={pageCount}
        onPageChange={(page) => void setParams({ page })}
      />

      {rows.length === 0 ? (
        <p className='text-muted-foreground py-8 text-center text-sm'>
          No roles found.
        </p>
      ) : (
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
          {rows.map((role) => {
            const name = getRoleName(role);
            const isSystem = Boolean(role.isSystem ?? role.system);
            const description = getRoleDescription(role);

            return (
              <div
                key={getRoleId(role)}
                className='border-border/70 bg-muted/20 hover:bg-muted/35 flex min-h-[4.75rem] flex-col justify-between rounded-lg border border-dashed p-2.5 transition-colors'
              >
                <div className='flex items-start justify-between gap-1'>
                  <div className='min-w-0'>
                    <p className='text-foreground truncate font-mono text-xs font-semibold tracking-tight'>
                      {name}
                    </p>
                    <p className='text-muted-foreground mt-1 line-clamp-2 text-[11px] leading-snug'>
                      {description || (isSystem ? 'System role' : 'Custom role')}
                    </p>
                  </div>
                  <CellAction data={role} />
                </div>
                <p className='text-muted-foreground mt-2 text-[10px] tracking-wide uppercase'>
                  {isSystem ? 'System' : 'Custom'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function RolesTableSkeleton() {
  return (
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className='bg-muted/40 h-20 animate-pulse rounded-lg' />
      ))}
    </div>
  );
}
