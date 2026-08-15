'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { EntityCellAction } from '@/components/erp/entity-cell-action';
import {
  EntityList,
  StatusLabel,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell
} from '@/components/erp/entity-list';
import {
  codeNameLabel,
  getEntityId,
  getEntityName,
  isEntityActive
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { Icons } from '@/components/icons';
import {
  useAttributeGroupsQuery,
  useAttributeSetsQuery
} from '../api/queries';
import {
  useDeleteAttributeGroupMutation,
  useDeleteAttributeSetMutation
} from '../api/mutations';
import { GroupFormSheet, SetFormSheet } from './attribute-form-sheets';
import { SetAttributesSheet } from './attribute-nested-sheets';

export function GroupsPanel() {
  const { data: groups = [], isPending, isError, error, refetch } =
    useAttributeGroupsQuery();

  return (
    <EntityList
      hideSearch
      total={groups.length}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No groups yet.'
      isEmpty={groups.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Code / name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <SimpleEntityRow
              key={getEntityId(group)}
              entity={group}
              FormSheet={GroupFormSheet}
              formProp='group'
              useDelete={useDeleteAttributeGroupMutation}
            />
          ))}
        </TableBody>
      </TableShell>
    </EntityList>
  );
}

export function SetsPanel() {
  const { data: sets = [], isPending, isError, error, refetch } =
    useAttributeSetsQuery();

  return (
    <EntityList
      hideSearch
      total={sets.length}
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyMessage='No sets yet.'
      isEmpty={sets.length === 0}
    >
      <TableShell>
        <TableHeader>
          <TableRow>
            <TableHead>Code / name</TableHead>
            <TableHead className='text-right'>Attributes</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sets.map((set) => (
            <SetRow key={getEntityId(set)} set={set} />
          ))}
        </TableBody>
      </TableShell>
    </EntityList>
  );
}

function SimpleEntityRow({ entity, FormSheet, formProp, useDelete }) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: remove, isPending } = useDelete({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete'));
    }
  });

  return (
    <TableRow>
      <TableCell className='font-medium'>{codeNameLabel(entity)}</TableCell>
      <TableCell>
        <StatusLabel active={isEntityActive(entity)} />
      </TableCell>
      <TableCell>
        {editOpen ? (
          <FormSheet
            {...{ [formProp]: entity }}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
        ) : null}
        <EntityCellAction
          onEdit={() => setEditOpen(true)}
          deletePending={isPending}
          onDelete={(close) =>
            remove(getEntityId(entity), {
              onSuccess: () => {
                toast.success(`Deleted “${getEntityName(entity)}”`);
                close();
              }
            })
          }
        />
      </TableCell>
    </TableRow>
  );
}

function SetRow({ set }) {
  const [editOpen, setEditOpen] = useState(false);
  const [attrsOpen, setAttrsOpen] = useState(false);
  const { mutate: deleteSet, isPending } = useDeleteAttributeSetMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete set'));
    }
  });
  const attrCount = (set.attributes ?? set.setAttributes ?? []).length;

  return (
    <TableRow>
      <TableCell className='font-medium'>{codeNameLabel(set)}</TableCell>
      <TableCell className='text-right tabular-nums'>{attrCount}</TableCell>
      <TableCell>
        <StatusLabel active={isEntityActive(set)} />
      </TableCell>
      <TableCell>
        {editOpen ? (
          <SetFormSheet set={set} open={editOpen} onOpenChange={setEditOpen} />
        ) : null}
        {attrsOpen ? (
          <SetAttributesSheet
            set={set}
            open={attrsOpen}
            onOpenChange={setAttrsOpen}
          />
        ) : null}
        <EntityCellAction
          onEdit={() => setEditOpen(true)}
          extraItems={[
            {
              label: 'Manage attributes',
              icon: Icons.tags,
              onClick: () => setAttrsOpen(true)
            }
          ]}
          deletePending={isPending}
          onDelete={(close) =>
            deleteSet(getEntityId(set), {
              onSuccess: () => {
                toast.success(`Deleted “${getEntityName(set)}”`);
                close();
              }
            })
          }
        />
      </TableCell>
    </TableRow>
  );
}
