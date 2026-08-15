import WarehouseDocsPage from '@/features/warehouse/components/warehouse-docs-page';

export const metadata = {
  title: 'Material returns'
};

export default function ReturnsPage() {
  return <WarehouseDocsPage type='MRR' />;
}
