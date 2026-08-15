import WarehouseDocsPage from '@/features/warehouse/components/warehouse-docs-page';

export const metadata = {
  title: 'Material receipt notes'
};

export default function MrnPage() {
  return <WarehouseDocsPage type='MRN' />;
}
