'use client';

import { useState, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useQuery } from '@tanstack/react-query';
import { projectsQueryOptions } from '@/tanstack/projects/queries';
import { FilterPopover } from '@/components/data-table/filters/filter-popover';
import { columns } from './columns';
import { projectsFilterConfig, conditionsToApiBody } from './filter-config';
import { getPinningState } from '@/lib/column-pinning';

export function ProjectsTable() {
  const [filterConditions, setFilterConditions] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnPinning] = useState(getPinningState(columns));

  const sortParam =
    sorting.length > 0
      ? `${sorting[0].id},${sorting[0].desc ? 'DESC' : 'ASC'}`
      : 'lastModifiedDate,DESC';

  const queryParams = {
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sort: sortParam
  };

  const filterBody = conditionsToApiBody(filterConditions, projectsFilterConfig);

  const { data, isPending } = useQuery(projectsQueryOptions(queryParams, filterBody));

  const projects = data?.data?.content ?? [];
  const totalElements = data?.data?.totalElements ?? 0;
  const pageCount = Math.ceil(totalElements / pagination.pageSize);

  const onPaginationChange = useCallback((updater) => {
    setPagination((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const onSortingChange = useCallback((updater) => {
    setSorting((prev) => (typeof updater === 'function' ? updater(prev) : updater));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const table = useReactTable({
    data: projects,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnPinning
    },
    initialState: {
      columnPinning: getPinningState(columns)
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true
  });

  return (
    <DataTable
      table={table}
      isLoading={isPending}
      skeletonRows={pagination.pageSize}
      totalItems={totalElements}
    >
      <DataTableToolbar
        table={table}
        filterComponent={
          <FilterPopover
            filterConfig={projectsFilterConfig}
            conditions={filterConditions}
            onChange={(conditions) => {
              setFilterConditions(conditions);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          />
        }
      />
    </DataTable>
  );
}
