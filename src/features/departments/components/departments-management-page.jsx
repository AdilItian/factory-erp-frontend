'use client';

import { useMemo, useState } from 'react';
import { Suspense } from 'react';
import { toast } from 'sonner';
import { CrudFormSheet } from '@/components/erp/crud-form-sheet';
import { EntityCellAction } from '@/components/erp/entity-cell-action';
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
import { FormSheetTrigger } from '@/components/erp/form-sheet-trigger';
import PageContainer from '@/components/layout/page-container';
import { compactPayload } from '@/lib/compact-payload';
import {
  codeNameLabel,
  getEntityDescription,
  getEntityId,
  getEntityName,
  isEntityActive,
  mapToOptions
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useListParams } from '@/hooks/use-list-params';
import { useLocationsOptionsQuery } from '@/features/locations/api/queries';
import { useDepartmentsListQuery } from '../api/queries';
import {
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useUpdateDepartmentMutation
} from '../api/mutations';
import {
  DEPARTMENT_DEFAULTS,
  departmentSchema,
  getDepartmentFormSections
} from '../constants/department-form-config';

function valuesFromDepartment(department) {
  if (!department) return DEPARTMENT_DEFAULTS;
  return {
    code: department.code ?? '',
    name: getEntityName(department, ''),
    description: getEntityDescription(department),
    locationId:
      department.locationId ??
      department.location?.id ??
      '__none__',
    isActive: isEntityActive(department)
  };
}

function DepartmentFormSheet({ department, open, onOpenChange }) {
  const isEdit = Boolean(department);
  const { data: locations = [] } = useLocationsOptionsQuery({ enabled: open });
  const locationOptions = useMemo(
    () => mapToOptions(locations, codeNameLabel),
    [locations]
  );
  const sections = useMemo(
    () => getDepartmentFormSections(locationOptions),
    [locationOptions]
  );
  const defaultValues = useMemo(
    () => valuesFromDepartment(department),
    [department]
  );

  const { mutate: createDepartment, isPending: isCreating } =
    useCreateDepartmentMutation({
      onSuccess: () => {
        toast.success('Department created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create department'));
      }
    });

  const { mutate: updateDepartment, isPending: isUpdating } =
    useUpdateDepartmentMutation({
      onSuccess: () => {
        toast.success('Department updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update department'));
      }
    });

  function onSubmit(values) {
    const payload = compactPayload(values);
    if (isEdit) {
      updateDepartment({ id: getEntityId(department), payload });
      return;
    }
    createDepartment(payload);
  }

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit department' : 'New department'}
      description='Omit location for a company-wide department.'
      schema={departmentSchema}
      defaultValues={defaultValues}
      sections={sections}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New department',
        title: isEdit
          ? 'Update this department, then save.'
          : 'Start with a code and name, then attach a site if needed.',
        description: 'Omit location for a company-wide department.'
      }}
      onSubmit={onSubmit}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='department-form-sheet'
      createLabel='Create department'
      resetKey={getEntityId(department) || 'new'}
    />
  );
}

function CellAction({ data }) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: deleteDepartment, isPending } = useDeleteDepartmentMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete department'));
    }
  });

  return (
    <>
      {editOpen ? (
        <DepartmentFormSheet
          department={data}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
      <EntityCellAction
        onEdit={() => setEditOpen(true)}
        deletePending={isPending}
        onDelete={(close) =>
          deleteDepartment(getEntityId(data), {
            onSuccess: () => {
              toast.success(`Deleted “${getEntityName(data)}”`);
              close();
            }
          })
        }
      />
    </>
  );
}

function DepartmentsTable() {
  const { page, perPage, search, setSearch, setPage, filters } = useListParams({
    searchKey: 'q',
    perPage: 20
  });
  const { data, isPending, isError, error, refetch } =
    useDepartmentsListQuery(filters);
  const items = (data?.items ?? []).filter((department) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return `${codeNameLabel(department)} ${getEntityDescription(department)}`
      .toLowerCase()
      .includes(query);
  });
  const total = search.trim() ? items.length : (data?.total ?? items.length);
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <EntityList
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder='Search departments…'
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No departments found.'
      isEmpty={items.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Code / name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((department) => (
            <TableRow key={getEntityId(department)}>
              <TableCell className='font-medium'>
                {codeNameLabel(department)}
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {department.location?.name || 'Company-wide'}
              </TableCell>
              <TableCell>
                <StatusLabel active={isEntityActive(department)} />
              </TableCell>
              <TableCell>
                <CellAction data={department} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableShell>
    </EntityList>
  );
}

export default function DepartmentsManagementPage() {
  return (
    <PageContainer
      pageTitle='Departments'
      pageDescription='Company-wide or location-scoped departments.'
      pageHeaderAction={
        <FormSheetTrigger label='Add department'>
          {({ open, onOpenChange }) => (
            <DepartmentFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <Suspense fallback={<TableSkeleton />}>
        <DepartmentsTable />
      </Suspense>
    </PageContainer>
  );
}
