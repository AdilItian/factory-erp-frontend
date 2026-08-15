'use client';

import { Suspense } from 'react';
import { FormSheetTrigger } from '@/components/erp/form-sheet-trigger';
import { TableSkeleton } from '@/components/erp/entity-list';
import PageContainer from '@/components/layout/page-container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttributeFormSheet, GroupFormSheet, SetFormSheet } from './attribute-form-sheets';
import { GroupsPanel, SetsPanel } from './attribute-group-set-panels';
import { AttributesPanel } from './attribute-panels';

export default function AttributesManagementPage() {
  return (
    <PageContainer
      pageTitle='Attributes'
      pageDescription='Define attributes, groups, and sets used by items.'
      pageHeaderAction={
        <FormSheetTrigger label='Add attribute'>
          {({ open, onOpenChange }) => (
            <AttributeFormSheet open={open} onOpenChange={onOpenChange} />
          )}
        </FormSheetTrigger>
      }
    >
      <Tabs defaultValue='attributes'>
        <TabsList>
          <TabsTrigger value='attributes'>Attributes</TabsTrigger>
          <TabsTrigger value='groups'>Groups</TabsTrigger>
          <TabsTrigger value='sets'>Sets</TabsTrigger>
        </TabsList>
        <TabsContent value='attributes'>
          <Suspense fallback={<TableSkeleton />}>
            <AttributesPanel />
          </Suspense>
        </TabsContent>
        <TabsContent value='groups'>
          <div className='mb-3 flex justify-end'>
            <FormSheetTrigger label='Add group'>
              {({ open, onOpenChange }) => (
                <GroupFormSheet open={open} onOpenChange={onOpenChange} />
              )}
            </FormSheetTrigger>
          </div>
          <GroupsPanel />
        </TabsContent>
        <TabsContent value='sets'>
          <div className='mb-3 flex justify-end'>
            <FormSheetTrigger label='Add set'>
              {({ open, onOpenChange }) => (
                <SetFormSheet open={open} onOpenChange={onOpenChange} />
              )}
            </FormSheetTrigger>
          </div>
          <SetsPanel />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
