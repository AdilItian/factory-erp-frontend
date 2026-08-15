import { Badge } from '@/components/ui/badge';
import { formatEnumLabel } from '@/lib/entity';

const VARIANT = {
  DRAFT: 'outline',
  CONFIRMED: 'default',
  RELEASED: 'secondary',
  IN_PROGRESS: 'default',
  RECEIVED: 'secondary',
  SHIPPED: 'secondary',
  COMPLETED: 'secondary',
  POSTED: 'default',
  REFUNDED: 'secondary',
  VOIDED: 'destructive',
  ISSUED: 'default',
  CLOSED: 'secondary',
  CANCELLED: 'destructive'
};

export function StatusBadge({ status }) {
  return (
    <Badge variant={VARIANT[status] || 'outline'}>
      {formatEnumLabel(status)}
    </Badge>
  );
}
