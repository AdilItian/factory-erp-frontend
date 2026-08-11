'use client';

import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JsonForm from './json-form';
import { sampleFormConfig } from '../constants/sample-form-config';

export default function FormBuilderDemo() {
  function handleSubmit(values) {
    toast.success('Form submitted successfully');
    console.log(values);
  }

  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>JSON Form Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <JsonForm config={sampleFormConfig} onSubmit={handleSubmit} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sample JSON Config</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className='bg-muted overflow-x-auto rounded-lg p-4 text-xs'>
            {JSON.stringify(sampleFormConfig, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
