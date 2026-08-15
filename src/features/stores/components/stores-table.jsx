'use client';

import { Badge } from '@/components/ui/badge';
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
import { useStoresListQuery } from '../api/queries';
import { StoreCellAction } from './store-actions';

function locationLabel(store) {
  return (
    store.location?.name ||
    store.locationName ||
    store.location?.code ||
    '—'
  );
}

export function StoresTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });

  const { data, isPending, isError, error, refetch } =
    useStoresListQuery(filters);
  const items = (data?.items ?? []).filter((store) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return `${codeNameLabel(store)} ${locationLabel(store)}`
      .toLowerCase()
      .includes(query);
  });
  const total = search.trim() ? items.length : (data?.total ?? items.length);
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search stores…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No stores found.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Code / name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((store) => {
            const active = isEntityActive(store);
            return (
              <TableRow key={getEntityId(store)}>
                <TableCell className='font-medium'>
                  {codeNameLabel(store)}
                  {store.isDefault ? (
                    <Badge variant='secondary' className='ml-2'>
                      Default
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {locationLabel(store)}
                </TableCell>
                <TableCell>{formatEnumLabel(getEntityType(store))}</TableCell>
                <TableCell>
                  <StatusLabel active={active} />
                </TableCell>
                <TableCell>
                  <StoreCellAction data={store} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </TableShell>
    </EntityList>
  );
}

export function StoresTableSkeleton() {
  return <TableSkeleton />;
}
