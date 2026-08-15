'use client';

import {
  EntityList,
  StatusLabel,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
  TableSkeleton
} from '@/components/erp/entity-list';
import {
  codeNameLabel,
  formatEnumLabel,
  getEntityId,
  getEntityType,
  isEntityActive
} from '@/lib/entity';
import { useListParams } from '@/hooks/use-list-params';
import { useLocationsListQuery } from '../../api/queries';
import { CellAction } from './cell-action';

export function LocationsTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });

  const { data, isPending, isError, error, refetch } =
    useLocationsListQuery(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search locations…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No locations found.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Code / name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((location) => (
            <TableRow key={getEntityId(location)}>
              <TableCell className='font-medium'>
                {codeNameLabel(location)}
              </TableCell>
              <TableCell>{formatEnumLabel(getEntityType(location))}</TableCell>
              <TableCell className='text-muted-foreground'>
                {location.city || location.addressLine || '—'}
              </TableCell>
              <TableCell>
                <StatusLabel active={isEntityActive(location)} />
              </TableCell>
              <TableCell>
                <CellAction data={location} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableShell>
    </EntityList>
  );
}

export function LocationsTableSkeleton() {
  return <TableSkeleton />;
}
