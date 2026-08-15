import { DUMMY_ITEMS, DUMMY_LOCATIONS, findCatalog } from './production-catalog';

const tshirt = findCatalog(DUMMY_ITEMS, 'item-tshirt');
const polo = findCatalog(DUMMY_ITEMS, 'item-polo');
const outlet = findCatalog(DUMMY_LOCATIONS, 'loc-isb');
const lahore = findCatalog(DUMMY_LOCATIONS, 'loc-lhr');

export const DUMMY_CUSTOMERS = [
  {
    id: 'cus-outlet-isb',
    code: 'CUS-ISB',
    name: 'Islamabad Flagship Outlet',
    contactName: 'Sara Ahmed',
    phone: '+92 51 1112233',
    email: 'sara@isboutlet.example',
    city: 'Islamabad',
    paymentTerms: 'Net 15',
    isActive: true
  },
  {
    id: 'cus-wholesale',
    code: 'CUS-WS',
    name: 'Northern Wholesale',
    contactName: 'Bilal Hussain',
    phone: '+92 300 9988776',
    email: 'bilal@northws.example',
    city: 'Rawalpindi',
    paymentTerms: 'Net 30',
    isActive: true
  },
  {
    id: 'cus-export',
    code: 'CUS-EXP',
    name: 'Gulf Apparel Trading',
    contactName: 'Omar Farooq',
    phone: '+971 50 1234567',
    email: 'omar@gulfapparel.example',
    city: 'Dubai',
    paymentTerms: 'LC at sight',
    isActive: true
  }
];

export const DUMMY_SALES_ORDERS = [
  {
    id: 'so-001',
    code: 'SO-2026-001',
    customerId: 'cus-outlet-isb',
    customer: DUMMY_CUSTOMERS[0],
    locationId: 'loc-lhr',
    location: lahore,
    shipToId: 'loc-isb',
    shipTo: outlet,
    status: 'CONFIRMED',
    orderDate: '2026-08-05',
    dueDate: '2026-08-20',
    notes: 'White / mixed sizes restock',
    lines: [
      {
        id: 'sol-1',
        itemId: 'item-tshirt',
        item: tshirt,
        quantity: '400',
        unitPrice: '890'
      }
    ]
  },
  {
    id: 'so-002',
    code: 'SO-2026-002',
    customerId: 'cus-wholesale',
    customer: DUMMY_CUSTOMERS[1],
    locationId: 'loc-lhr',
    location: lahore,
    shipToId: '',
    shipTo: null,
    status: 'DRAFT',
    orderDate: '2026-08-12',
    dueDate: '2026-08-28',
    notes: 'Polo assortment',
    lines: [
      {
        id: 'sol-2',
        itemId: 'item-polo',
        item: polo,
        quantity: '200',
        unitPrice: '1450'
      }
    ]
  }
];
