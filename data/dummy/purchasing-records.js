import { DUMMY_ITEMS, DUMMY_LOCATIONS, findCatalog } from './production-catalog';

const fabric = findCatalog(DUMMY_ITEMS, 'item-fabric');
const thread = findCatalog(DUMMY_ITEMS, 'item-thread');
const button = findCatalog(DUMMY_ITEMS, 'item-button');
const lahore = findCatalog(DUMMY_LOCATIONS, 'loc-lhr');

export const DUMMY_SUPPLIERS = [
  {
    id: 'sup-textile',
    code: 'SUP-TEX',
    name: 'Lahore Textile Mills',
    contactName: 'Asif Raza',
    phone: '+92 300 1112233',
    email: 'asif@lhrtextile.example',
    city: 'Lahore',
    paymentTerms: 'Net 30',
    isActive: true
  },
  {
    id: 'sup-trim',
    code: 'SUP-TRIM',
    name: 'Karachi Trims Co',
    contactName: 'Nadia Khan',
    phone: '+92 321 4455667',
    email: 'nadia@ktrims.example',
    city: 'Karachi',
    paymentTerms: 'Net 15',
    isActive: true
  },
  {
    id: 'sup-pack',
    code: 'SUP-PACK',
    name: 'Pak Packaging',
    contactName: 'Imran Ali',
    phone: '+92 333 7788990',
    email: 'imran@pakpack.example',
    city: 'Lahore',
    paymentTerms: 'COD',
    isActive: true
  }
];

export const DUMMY_PURCHASE_ORDERS = [
  {
    id: 'po-001',
    code: 'PO-2026-001',
    supplierId: 'sup-textile',
    supplier: DUMMY_SUPPLIERS[0],
    locationId: 'loc-lhr',
    location: lahore,
    status: 'CONFIRMED',
    orderDate: '2026-08-01',
    expectedDate: '2026-08-18',
    notes: 'Jersey fabric for T-shirt run',
    lines: [
      {
        id: 'pol-1',
        itemId: 'item-fabric',
        item: fabric,
        quantity: '1200',
        unitPrice: '280'
      },
      {
        id: 'pol-2',
        itemId: 'item-thread',
        item: thread,
        quantity: '80',
        unitPrice: '45'
      }
    ]
  },
  {
    id: 'po-002',
    code: 'PO-2026-002',
    supplierId: 'sup-trim',
    supplier: DUMMY_SUPPLIERS[1],
    locationId: 'loc-lhr',
    location: lahore,
    status: 'DRAFT',
    orderDate: '2026-08-10',
    expectedDate: '2026-08-22',
    notes: 'Buttons for polo',
    lines: [
      {
        id: 'pol-3',
        itemId: 'item-button',
        item: button,
        quantity: '5000',
        unitPrice: '2.5'
      }
    ]
  }
];
