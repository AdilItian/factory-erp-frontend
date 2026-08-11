'use client';

import { useMemo } from 'react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useDataTable } from '@/hooks/use-data-table';
import { getPinningState } from '@/lib/column-pinning';
import {
  useMyTasksSuspenseQuery,
  useProjectTasksSuspenseQuery
} from '../../api/queries';
import { getTaskTitle } from '../../utils/normalize-task';
import { createTaskColumns } from './columns';

function useTaskTableState() {
  return useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    title: parseAsString,
    status: parseAsString
  });
}

function TasksTableView({ tasks, total, params, columns }) {
  const filteredTasks = useMemo(() => {
    const list = tasks ?? [];
    const query = params.title?.trim().toLowerCase();
    if (!query) return list;

    return list.filter((task) =>
      getTaskTitle(task).toLowerCase().includes(query)
    );
  }, [tasks, params.title]);

  const pageCount = params.title?.trim()
    ? Math.max(1, Math.ceil(filteredTasks.length / params.perPage))
    : Math.max(1, Math.ceil((total ?? filteredTasks.length) / params.perPage));

  const tableRows = params.title?.trim()
    ? filteredTasks.slice(0, params.perPage)
    : filteredTasks;

  const { table } = useDataTable({
    data: tableRows,
    columns,
    pageCount,
    shallow: true,
    debounceMs: 400,
    initialState: {
      columnPinning: getPinningState(columns)
    }
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

export function ProjectTasksTable({ projectId }) {
  const [params] = useTaskTableState();
  const filters = {
    page: params.page,
    limit: params.perPage,
    ...(params.status ? { status: params.status } : {})
  };

  const { data } = useProjectTasksSuspenseQuery(projectId, filters);
  const columns = useMemo(
    () => createTaskColumns({ projectId }),
    [projectId]
  );

  return (
    <TasksTableView
      tasks={data?.tasks}
      total={data?.total}
      params={params}
      columns={columns}
    />
  );
}

export function MyTasksTable() {
  const [params] = useTaskTableState();
  const filters = {
    page: params.page,
    limit: params.perPage,
    ...(params.status ? { status: params.status } : {})
  };

  const { data } = useMyTasksSuspenseQuery(filters);
  const columns = useMemo(
    () => createTaskColumns({ showProject: true }),
    []
  );

  return (
    <TasksTableView
      tasks={data?.tasks}
      total={data?.total}
      params={params}
      columns={columns}
    />
  );
}

export function ProjectTasksTableSkeleton() {
  return <DataTableSkeleton columnCount={6} rowCount={8} filterCount={1} />;
}
