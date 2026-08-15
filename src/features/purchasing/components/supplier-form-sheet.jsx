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
  useCreateSupplierMutation,
  useUpdateSupplierMutation
} from '../api/mutations';
import {
  SUPPLIER_DEFAULTS,
  getSupplierFormSections,
  supplierSchema
} from '../constants/supplier-form-config';

function valuesFromSupplier(row) {
  if (!row) return SUPPLIER_DEFAULTS;
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

export function SupplierFormSheet({ supplier, open, onOpenChange }) {
  const isEdit = Boolean(supplier);
  const defaultValues = useMemo(
    () => valuesFromSupplier(supplier),
    [supplier]
  );

  const { mutate: createRow, isPending: isCreating } =
    useCreateSupplierMutation({
      onSuccess: () => {
        toast.success('Supplier created');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create supplier'));
      }
    });
  const { mutate: updateRow, isPending: isUpdating } =
    useUpdateSupplierMutation({
      onSuccess: () => {
        toast.success('Supplier updated');
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update supplier'));
      }
    });

  return (
    <CrudFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit supplier' : 'New supplier'}
      description='Vendors for fabric, trims, and packaging.'
      schema={supplierSchema}
      defaultValues={defaultValues}
      sections={getSupplierFormSections()}
      intro={{
        eyebrow: isEdit ? 'Editing' : 'New supplier',
        title: isEdit
          ? 'Update this supplier, then save.'
          : 'Start with a short code and the trading name.',
        description: 'Payment terms are a reminder for purchasing — not invoicing yet.'
      }}
      onSubmit={(values) => {
        const payload = compactPayload(values);
        if (isEdit) {
          updateRow({ id: getEntityId(supplier), payload });
          return;
        }
        createRow(payload);
      }}
      isPending={isCreating || isUpdating}
      isEdit={isEdit}
      formId='supplier-form'
      createLabel='Create supplier'
      resetKey={getEntityId(supplier) || 'new'}
    />
  );
}
