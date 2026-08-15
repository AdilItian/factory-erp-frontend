'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import { CrudFormSheet } from '@/components/erp/crud-form-sheet';
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
import { useUomsOptionsQuery } from '@/features/uoms/api/queries';
import { useAttributeGroupsQuery } from '../api/queries';
import {
  useCreateAttributeGroupMutation,
  useCreateAttributeMutation,
  useCreateAttributeSetMutation,
  useUpdateAttributeGroupMutation,
  useUpdateAttributeMutation,
  useUpdateAttributeSetMutation
} from '../api/mutations';
import {
  ATTRIBUTE_DEFAULTS,
  GROUP_DEFAULTS,
  SET_DEFAULTS,
  attributeSchema,
  getAttributeFormSections,
  getGroupFormSections,
  getSetFormSections,
  groupSchema,
  setSchema
} from '../constants/attribute-form-config';

function valuesFromAttribute(attribute) {
  if (!attribute) return ATTRIBUTE_DEFAULTS;
  return {
    code: attribute.code ?? '',
    name: getEntityName(attribute, ''),
    description: getEntityDescription(attribute),
    dataType: attribute.dataType ?? 'TEXT',
    groupId: attribute.groupId ?? attribute.group?.id ?? '__none__',
    uomId: attribute.uomId ?? attribute.uom?.id ?? '__none__',
    isVariantAxis: Boolean(attribute.isVariantAxis),
    isRequired: Boolean(attribute.isRequired),
    isFilterable: attribute.isFilterable !== false,
    minValue: attribute.minValue ?? '',
    maxValue: attribute.maxValue ?? '',
    defaultValue: attribute.defaultValue ?? '',
    isActive: isEntityActive(attribute)
  };
}

export function AttributeFormSheet({ attribute, open, onOpenChange }) {
  const isEdit = Boolean(attribute);
  const { data: groups = [] } = useAttributeGroupsQuery({ enabled: open });
  const { data: uoms = [] } = useUomsOptionsQuery({ enabled: open });
  const groupOptions = useMemo(
    () => mapToOptions(groups, codeNameLabel),
    [groups]
  );
  const uomOptions = useMemo(() => mapToOptions(uoms, codeNameLabel), [uoms]);
  const sections = useMemo(
    () => getAttributeFormSections(groupOptions, uomOptions),
    [groupOptions, uomOptions]
  );
  const defaultValues = useMemo(
    () => valuesFromAttribute(attribute),
    [attribute]
  );

  const { mutate: createAttribute, isPending: isCreating } =
    useCreateAttributeMutation({
      onSuccess: () => {
        toast.success('Attribute created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create attribute'));
      }
    });
  const { mutate: updateAttribute, isPending: isUpdating } =
    useUpdateAttributeMutation({
      onSuccess: () => {
        toast.success('Attribute updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update attribute'));
      }
    });

  function onSubmit(values) {
    const payload = compactPayload(values);
    if (isEdit) {
      const { dataType: _dataType, ...rest } = payload;
      updateAttribute({ id: getEntityId(attribute), payload: rest });
      return;
    }
    createAttribute(payload);
  }

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit attribute' : 'New attribute'}
      description='Data type cannot change after create. Variant axes are ENUM only.'
      schema={attributeSchema}
      defaultValues={defaultValues}
      sections={sections}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New attribute',
        title: isEdit
          ? 'Update this attribute, then save.'
          : 'Start with a code and data type, then set how it behaves.',
        description:
          'Data type cannot change after create. Variant axes are ENUM only.'
      }}
      onSubmit={onSubmit}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='attribute-form-sheet'
      createLabel='Create attribute'
      resetKey={getEntityId(attribute) || 'new'}
    />
  );
}

export function GroupFormSheet({ group, open, onOpenChange }) {
  const isEdit = Boolean(group);
  const defaultValues = useMemo(
    () =>
      group
        ? {
            code: group.code ?? '',
            name: getEntityName(group, ''),
            description: getEntityDescription(group),
            isActive: isEntityActive(group)
          }
        : GROUP_DEFAULTS,
    [group]
  );
  const { mutate: createGroup, isPending: isCreating } =
    useCreateAttributeGroupMutation({
      onSuccess: () => {
        toast.success('Group created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create group'));
      }
    });
  const { mutate: updateGroup, isPending: isUpdating } =
    useUpdateAttributeGroupMutation({
      onSuccess: () => {
        toast.success('Group updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update group'));
      }
    });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit group' : 'New group'}
      description='Groups only affect how attributes are presented.'
      schema={groupSchema}
      defaultValues={defaultValues}
      sections={getGroupFormSections()}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New group',
        title: isEdit
          ? 'Update this group, then save.'
          : 'Start with a code and name for this heading.',
        description: 'Groups only affect how attributes are presented.'
      }}
      onSubmit={(values) => {
        const payload = compactPayload(values);
        if (isEdit) updateGroup({ id: getEntityId(group), payload });
        else createGroup(payload);
      }}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='attribute-group-form'
      createLabel='Create group'
      resetKey={getEntityId(group) || 'new-group'}
    />
  );
}

export function SetFormSheet({ set, open, onOpenChange }) {
  const isEdit = Boolean(set);
  const defaultValues = useMemo(
    () =>
      set
        ? {
            code: set.code ?? '',
            name: getEntityName(set, ''),
            description: getEntityDescription(set),
            isActive: isEntityActive(set)
          }
        : SET_DEFAULTS,
    [set]
  );
  const { mutate: createSet, isPending: isCreating } =
    useCreateAttributeSetMutation({
      onSuccess: () => {
        toast.success('Set created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create set'));
      }
    });
  const { mutate: updateSet, isPending: isUpdating } =
    useUpdateAttributeSetMutation({
      onSuccess: () => {
        toast.success('Set updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update set'));
      }
    });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit set' : 'New set'}
      description='A set is the attribute template for a family of items.'
      schema={setSchema}
      defaultValues={defaultValues}
      sections={getSetFormSections()}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New set',
        title: isEdit
          ? 'Update this set, then save.'
          : 'Start with a code and name for this template.',
        description: 'A set is the attribute template for a family of items.'
      }}
      onSubmit={(values) => {
        const payload = compactPayload(values);
        if (isEdit) updateSet({ id: getEntityId(set), payload });
        else createSet(payload);
      }}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='attribute-set-form'
      createLabel='Create set'
      resetKey={getEntityId(set) || 'new-set'}
    />
  );
}
