'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import { CrudFormSheet } from '@/components/erp/crud-form-sheet';
import { compactPayload } from '@/lib/compact-payload';
import {
  getEntityId,
  getEntityName,
  isEntityActive
} from '@/lib/entity';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation
} from '../api/mutations';
import {
  CUSTOMER_DEFAULTS,
  customerSchema,
  getCustomerFormSections
} from '../constants/customer-form-config';

function valuesFromCustomer(row) {
  if (!row) return CUSTOMER_DEFAULTS;
  return {
    code: row.code ?? '',
    name: getEntityName(row, ''),
    contactName: row.contactName ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    city: row.city ?? '',
    paymentTerms: row.paymentTerms ?? '',
    isActive: isEntityActive(row)
  };
}

export function CustomerFormSheet({ customer, open, onOpenChange }) {
  const isEdit = Boolean(customer);
  const defaultValues = useMemo(
    () => valuesFromCustomer(customer),
    [customer]
  );

  const { mutate: createRow, isPending: isCreating } =
    useCreateCustomerMutation({
      onSuccess: () => {
        toast.success('Customer created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create customer'));
      }
    });
  const { mutate: updateRow, isPending: isUpdating } =
    useUpdateCustomerMutation({
      onSuccess: () => {
        toast.success('Customer updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update customer'));
      }
    });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit customer' : 'New customer'}
      description='Outlets, wholesalers, and export buyers.'
      schema={customerSchema}
      defaultValues={defaultValues}
      sections={getCustomerFormSections()}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New customer',
        title: isEdit
          ? 'Update this customer, then save.'
          : 'Start with a short code and the trading name.',
        description: 'Payment terms are a reminder for sales — not invoicing yet.'
      }}
      onSubmit={(values) => {
        const payload = compactPayload(values);
        if (isEdit) {
          updateRow({ id: getEntityId(customer), payload });
          return;
        }
        createRow(payload);
      }}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='customer-form'
      createLabel='Create customer'
      resetKey={getEntityId(customer) || 'new'}
    />
  );
}
