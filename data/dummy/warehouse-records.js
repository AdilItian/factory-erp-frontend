import {
  DUMMY_ITEMS,
  DUMMY_STORES,
  findCatalog
} from './production-catalog';
import { DUMMY_SUPPLIERS } from './purchasing-records';

const fabric = findCatalog(DUMMY_ITEMS, 'item-fabric');
const thread = findCatalog(DUMMY_ITEMS, 'item-thread');
const button = findCatalog(DUMMY_ITEMS, 'item-button');
const raw = findCatalog(DUMMY_STORES, 'store-raw');
const wip = findCatalog(DUMMY_STORES, 'store-wip');
const supplier = DUMMY_SUPPLIERS[0];

export const DUMMY_MRNS = [
  {
    id: 'mrn-001',
    code: 'MRN-2026-001',
    status: 'POSTED',
    docDate: '2026-08-12',
    storeId: 'store-raw',
    store: raw,
    supplierId: supplier.id,
    supplier,
    purchaseOrderCode: 'PO-2026-001',
    reference: 'PO-2026-001',
    notes: 'Jersey fabric against PO',
    lines: [
      {
        id: 'mrnl-1',
        itemId: 'item-fabric',
        item: fabric,
        quantity: '1200'
      },
      {
        id: 'mrnl-2',
        itemId: 'item-thread',
        item: thread,
        quantity: '40'
      }
    ]
  }
];

export const DUMMY_MINS = [
  {
    id: 'min-001',
    code: 'MIN-2026-001',
    status: 'POSTED',
    docDate: '2026-08-13',
    storeId: 'store-raw',
    store: raw,
    issuedTo: 'Cutting floor',
    reference: 'WO-2026-014',
    notes: 'Issue for T-shirt run',
    lines: [
      {
        id: 'minl-1',
        itemId: 'item-fabric',
        item: fabric,
        quantity: '280'
      }
    ]
  }
];

export const DUMMY_TRANSFERS = [
  {
    id: 'mtn-001',
    code: 'MTN-2026-001',
    status: 'DRAFT',
    docDate: '2026-08-14',
    fromStoreId: 'store-raw',
    fromStore: raw,
    toStoreId: 'store-wip',
    toStore: wip,
    reference: '',
    notes: 'Move fabric to WIP for cutting',
    lines: [
      {
        id: 'mtnl-1',
        itemId: 'item-fabric',
        item: fabric,
        quantity: '100'
      }
    ]
  }
];

export const DUMMY_RETURNS = [
  {
    id: 'mrr-001',
    code: 'MRR-2026-001',
    status: 'DRAFT',
    docDate: '2026-08-14',
    storeId: 'store-raw',
    store: raw,
    supplierId: supplier.id,
    supplier,
    reason: 'DAMAGED',
    reference: 'MRN-2026-001',
    notes: 'Damaged buttons from last receipt',
    lines: [
      {
        id: 'mrrl-1',
        itemId: 'item-button',
        item: button,
        quantity: '50'
      }
    ]
  }
];
