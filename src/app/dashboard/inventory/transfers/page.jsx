import WarehouseDocsPage from '@/features/warehouse/components/warehouse-docs-page';

export const metadata = {
  title: 'Material transfers'
};

export default function TransfersPage() {
  return <WarehouseDocsPage type='MTN' />;
}
