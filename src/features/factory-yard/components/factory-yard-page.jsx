'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { StatusLabel, TableBody, TableCell, TableHead, TableHeader, TableRow, TableShell } from '@/components/erp/entity-list';
import { formatEnumLabel } from '@/lib/entity';
import { useLocationsListQuery } from '@/features/locations/api/queries';
import { useStoresListQuery } from '@/features/stores/api/queries';
import { useDepartmentsListQuery } from '@/features/departments/api/queries';
import { useOnHandQuery } from '@/features/inventory/api/queries';
import { buildYardWorld } from '../utils/yard-model';

const FILTERS = { page: 1, limit: 100 };

export default function FactoryYardPage() {
  const locationsQuery = useLocationsListQuery(FILTERS);
  const storesQuery = useStoresListQuery(FILTERS);
  const departmentsQuery = useDepartmentsListQuery(FILTERS);
  const stockQuery = useOnHandQuery(FILTERS);

  const world = useMemo(
    () =>
      buildYardWorld(
        locationsQuery.data?.items ?? [],
        storesQuery.data?.items ?? [],
        departmentsQuery.data?.items ?? [],
        stockQuery.data?.items ?? []
      ),
    [
      locationsQuery.data?.items,
      storesQuery.data?.items,
      departmentsQuery.data?.items,
      stockQuery.data?.items
    ]
  );

  const plots = world.plots.filter((plot) => !plot.synthetic);
  const loading = locationsQuery.isPending || storesQuery.isPending;

  return (
    <PageContainer
      pageTitle='Sites'
      pageDescription='Locations with store and stock totals.'
      isLoading={loading}
      pageHeaderAction={
        <Link href='/dashboard/locations' className={cn(buttonVariants({ size: 'sm' }))}>
          Add location
        </Link>
      }
    >
      <div className='text-muted-foreground mb-4 flex flex-wrap gap-x-5 gap-y-1 text-sm'>
        <span>
          <span className='text-foreground font-medium'>{plots.length}</span> locations
        </span>
        <span>
          <span className='text-foreground font-medium'>{world.storeCount}</span> stores
        </span>
        <span>
          <span className='text-foreground font-medium'>{world.unassignedCount}</span>{' '}
          unassigned stores
        </span>
      </div>

      {plots.length === 0 ? (
        <p className='text-muted-foreground text-sm'>No locations yet.</p>
      ) : (
        <TableShell>
          <TableHeader>
            <TableRow>
              <TableHead>Code / name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>City</TableHead>
              <TableHead className='text-right'>Stores</TableHead>
              <TableHead className='text-right'>Departments</TableHead>
              <TableHead className='text-right'>On hand</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plots.map((plot) => (
              <TableRow key={plot.id}>
                <TableCell className='font-medium'>
                  {plot.code ? `${plot.code} — ${plot.name}` : plot.name}
                </TableCell>
                <TableCell>{formatEnumLabel(plot.type)}</TableCell>
                <TableCell className='text-muted-foreground'>{plot.city || '—'}</TableCell>
                <TableCell className='text-right'>{plot.bays.length}</TableCell>
                <TableCell className='text-right'>{plot.departments.length}</TableCell>
                <TableCell className='text-right'>{plot.stock.toLocaleString()}</TableCell>
                <TableCell>
                  <StatusLabel active={plot.active} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableShell>
      )}
    </PageContainer>
  );
}
