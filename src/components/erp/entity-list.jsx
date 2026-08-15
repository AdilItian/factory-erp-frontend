'use client';

import { Button } from '@/components/ui/button';
import { ListToolbar } from '@/components/ui/list-toolbar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { cn } from '@/lib/utils';

export function EntityList({
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  total = 0,
  page = 1,
  pageCount = 1,
  onPageChange,
  isPending = false,
  isError = false,
  error,
  onRetry,
  emptyMessage = 'No records found.',
  isEmpty = false,
  hideSearch = false,
  skeleton,
  children
}) {
  if (isPending) {
    return skeleton || <TableSkeleton />;
  }

  if (isError) {
    return (
      <div className='text-destructive text-sm'>
        {getApiErrorMessage(error, 'Failed to load')}{' '}
        {onRetry ? (
          <button type='button' className='underline' onClick={onRetry}>
            Retry
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className='flex min-h-0 flex-1 flex-col gap-3'>
      {hideSearch ? null : (
        <ListToolbar
          search={search ?? ''}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          total={total}
          page={page}
          pageCount={pageCount}
          onPageChange={onPageChange}
        />
      )}

      {isEmpty ? (
        <p className='text-muted-foreground py-8 text-sm'>{emptyMessage}</p>
      ) : (
        children
      )}
    </div>
  );
}

export function TableShell({ children, className }) {
  return (
    <div
      className={cn(
        'border-border bg-card min-w-0 overflow-hidden rounded-xl border',
        className
      )}
    >
      <Table>{children}</Table>
    </div>
  );
}

export function TableSkeleton({ rows = 8 }) {
  return (
    <div className='border-border overflow-hidden rounded-xl border'>
      <div className='bg-muted/40 h-10 border-b' />
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className='flex items-center gap-4 border-b px-4 py-2.5 last:border-0'
        >
          <div className='bg-muted h-3.5 w-24 animate-pulse rounded' />
          <div className='bg-muted/70 h-3.5 flex-1 animate-pulse rounded' />
          <div className='bg-muted/50 hidden h-3.5 w-20 animate-pulse rounded sm:block' />
        </div>
      ))}
    </div>
  );
}

export function StatusLabel({ active = true }) {
  return (
    <span className='text-muted-foreground inline-flex items-center gap-2 text-sm'>
      <span
        className={cn(
          'size-1.5 rounded-full',
          active ? 'bg-primary' : 'bg-muted-foreground/35'
        )}
      />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

export {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
};
