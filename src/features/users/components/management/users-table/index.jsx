'use client';

import { useMemo } from 'react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ListToolbar } from '@/components/ui/list-toolbar';
import { useUsersListSuspenseQuery } from '../../../api/management-queries';
import {
  getUserDisplayName,
  getUserEmail,
  getUserId,
  getUserRoles,
  isUserActive
} from '../../../utils/normalize-user';
import { CellAction } from './cell-action';

function initials(name, email) {
  const source = String(name || email || 'U').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function UsersManagementTable() {
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(16),
    email: parseAsString
  });

  const { data } = useUsersListSuspenseQuery({
    page: params.page,
    limit: params.perPage
  });
  const users = data?.users ?? [];

  const filteredUsers = useMemo(() => {
    const query = params.email?.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => {
      const email = getUserEmail(user).toLowerCase();
      const name = getUserDisplayName(user).toLowerCase();
      return email.includes(query) || name.includes(query);
    });
  }, [users, params.email]);

  const total = params.email?.trim()
    ? filteredUsers.length
    : (data?.total ?? filteredUsers.length);
  const pageCount = Math.max(1, Math.ceil(total / params.perPage));
  const rows = params.email?.trim()
    ? filteredUsers.slice(0, params.perPage)
    : filteredUsers;

  return (
    <div className='flex flex-col gap-3'>
      <ListToolbar
        search={params.email ?? ''}
        onSearchChange={(value) =>
          void setParams({ email: value || null, page: 1 })
        }
        searchPlaceholder='Filter people…'
        total={total}
        page={params.page}
        pageCount={pageCount}
        onPageChange={(page) => void setParams({ page })}
      />

      {rows.length === 0 ? (
        <p className='text-muted-foreground py-8 text-center text-sm'>
          No users found.
        </p>
      ) : (
        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3'>
          {rows.map((user) => {
            const name = getUserDisplayName(user);
            const email = getUserEmail(user);
            const roles = getUserRoles(user);
            const active = isUserActive(user);

            return (
              <div
                key={getUserId(user)}
                className='border-border/70 bg-card hover:border-border flex items-center gap-2.5 rounded-xl border p-3 shadow-xs transition-colors'
              >
                <Avatar className='size-9 shrink-0 rounded-lg'>
                  <AvatarFallback className='rounded-lg text-[10px] font-semibold'>
                    {initials(name, email)}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0 flex-1'>
                  <div className='flex min-w-0 items-center gap-1.5'>
                    <p className='text-foreground truncate text-sm font-medium'>
                      {name}
                    </p>
                    <span
                      className={
                        active
                          ? 'bg-primary size-1.5 shrink-0 rounded-full'
                          : 'bg-muted-foreground/40 size-1.5 shrink-0 rounded-full'
                      }
                    />
                  </div>
                  <p className='text-muted-foreground truncate text-[11px]'>
                    {email || '—'}
                  </p>
                  {roles.length ? (
                    <p className='text-muted-foreground mt-0.5 truncate text-[11px] capitalize'>
                      {roles.slice(0, 2).join(' · ')}
                      {roles.length > 2 ? '…' : ''}
                    </p>
                  ) : null}
                </div>
                <CellAction data={user} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function UsersManagementTableSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3'>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className='bg-muted/40 h-[4.5rem] animate-pulse rounded-xl' />
      ))}
    </div>
  );
}
