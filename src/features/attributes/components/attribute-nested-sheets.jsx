'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { codeNameLabel, getEntityId, getEntityName, mapToOptions } from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useAttributeDetailQuery, useAttributesOptionsQuery } from '../api/queries';
import {
  useAddAttributeOptionMutation,
  useAddSetAttributeMutation,
  useDeleteAttributeOptionMutation,
  useRemoveSetAttributeMutation
} from '../api/mutations';
import {
  addSetAttributeSchema,
  getOptionFormSections,
  getSetAttributeFormSections,
  optionSchema
} from '../constants/attribute-form-config';
import { LinesSheet } from '@/components/erp/lines-sheet';

export function AttributeOptionsSheet({ attribute, open, onOpenChange }) {
  const attributeId = getEntityId(attribute);
  const { data: detail } = useAttributeDetailQuery(attributeId, {
    enabled: open && Boolean(attributeId)
  });
  const options = detail?.options ?? attribute?.options ?? [];

  const { mutate: addOption, isPending } = useAddAttributeOptionMutation({
    onSuccess: () => toast.success('Option added'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to add option'));
    }
  });
  const { mutate: deleteOption } = useDeleteAttributeOptionMutation({
    onSuccess: () => toast.success('Option removed'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to remove option'));
    }
  });

  return (
    <LinesSheet
      open={open}
      onOpenChange={onOpenChange}
      title='ENUM options'
      description={`Options for ${getEntityName(attribute)}. Codes are stored uppercase.`}
      schema={optionSchema}
      defaultValues={{ code: '', label: '' }}
      sections={getOptionFormSections()}
      intro={{
        eyebrow: 'New option',
        title: 'Add one value at a time.',
        description: 'Codes are stored uppercase — keep them short and stable.'
      }}
      listTitle='On this attribute'
      listDescription='Remove a value if items should no longer use it.'
      listIcon='tags'
      rows={options}
      emptyMessage='No options yet.'
      addLabel='Add option'
      isPending={isPending}
      formId='attribute-option-form'
      onAdd={(values) => addOption({ id: attributeId, payload: values })}
      renderRow={(option) => (
        <div
          key={getEntityId(option)}
          className='flex items-center justify-between gap-3 px-4 py-2.5'
        >
          <p className='min-w-0 truncate text-sm'>
            <span className='font-mono text-xs'>{option.code}</span>
            <span className='text-muted-foreground'> · {option.label}</span>
          </p>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='text-muted-foreground size-8'
            onClick={() =>
              deleteOption({
                id: attributeId,
                optionId: getEntityId(option)
              })
            }
          >
            <Icons.trash className='size-4' />
          </Button>
        </div>
      )}
    />
  );
}

export function SetAttributesSheet({ set, open, onOpenChange }) {
  const setId = getEntityId(set);
  const { data: attributes = [] } = useAttributesOptionsQuery({ enabled: open });
  const attributeOptions = useMemo(
    () => mapToOptions(attributes, codeNameLabel),
    [attributes]
  );
  const sections = useMemo(
    () => getSetAttributeFormSections(attributeOptions),
    [attributeOptions]
  );
  const linked = set?.attributes ?? set?.setAttributes ?? [];

  const { mutate: addAttribute, isPending } = useAddSetAttributeMutation({
    onSuccess: () => toast.success('Attribute added to set'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to add attribute'));
    }
  });
  const { mutate: removeAttribute } = useRemoveSetAttributeMutation({
    onSuccess: () => toast.success('Attribute removed'),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to remove attribute'));
    }
  });

  return (
    <LinesSheet
      open={open}
      onOpenChange={onOpenChange}
      title='Set attributes'
      description={`Attributes on ${getEntityName(set)}.`}
      schema={addSetAttributeSchema}
      defaultValues={{ attributeId: '', isRequired: false }}
      sections={sections}
      intro={{
        eyebrow: 'Set member',
        title: 'Link one attribute at a time.',
        description: 'Required attributes must be filled when this set is used on an item.'
      }}
      listTitle='In this set'
      listDescription='Remove an attribute if this family no longer needs it.'
      listIcon='boxes'
      rows={linked}
      emptyMessage='No attributes in this set.'
      addLabel='Add to set'
      isPending={isPending}
      formId='set-attribute-form'
      onAdd={(values) => addAttribute({ id: setId, payload: values })}
      renderRow={(item) => {
        const attr = item.attribute ?? item;
        const attrId = getEntityId(attr) || item.attributeId;
        return (
          <div
            key={attrId}
            className='flex items-center justify-between gap-3 px-4 py-2.5'
          >
            <p className='min-w-0 truncate text-sm'>{codeNameLabel(attr)}</p>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-muted-foreground size-8'
              onClick={() => removeAttribute({ id: setId, attributeId: attrId })}
            >
              <Icons.trash className='size-4' />
            </Button>
          </div>
        );
      }}
    />
  );
}
