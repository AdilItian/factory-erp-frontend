import { DUMMY_ITEMS, DUMMY_LOCATIONS, findCatalog } from './production-catalog';
import { DUMMY_BOMS } from './production-boms';
import { DUMMY_BOM_TEMPLATES } from './production-bom-templates';

export { DUMMY_BOMS, DUMMY_BOM_TEMPLATES };

const tshirt = findCatalog(DUMMY_ITEMS, 'item-tshirt');
const polo = findCatalog(DUMMY_ITEMS, 'item-polo');
const fabric = findCatalog(DUMMY_ITEMS, 'item-fabric');
const lahore = findCatalog(DUMMY_LOCATIONS, 'loc-lhr');
const outlet = findCatalog(DUMMY_LOCATIONS, 'loc-isb');

export const DUMMY_WORK_CENTERS = [
  {
    id: 'wc-cut',
    code: 'CUT',
    name: 'Cutting',
    type: 'CUTTING',
    locationId: 'loc-lhr',
    location: lahore,
    capacityPerDay: 800,
    isActive: true
  },
  {
    id: 'wc-sew',
    code: 'SEW',
    name: 'Sewing',
    type: 'SEWING',
    locationId: 'loc-lhr',
    location: lahore,
    capacityPerDay: 600,
    isActive: true
  },
  {
    id: 'wc-fin',
    code: 'FIN',
    name: 'Finishing',
    type: 'FINISHING',
    locationId: 'loc-lhr',
    location: lahore,
    capacityPerDay: 700,
    isActive: true
  },
  {
    id: 'wc-pack',
    code: 'PACK',
    name: 'Packing',
    type: 'PACKING',
    locationId: 'loc-lhr',
    location: lahore,
    capacityPerDay: 900,
    isActive: true
  },
  {
    id: 'wc-qc',
    code: 'QC',
    name: 'Quality',
    type: 'QC',
    locationId: 'loc-lhr',
    location: lahore,
    capacityPerDay: 500,
    isActive: true
  }
];

export const DUMMY_WORK_ORDERS = [
  {
    id: 'wo-001',
    code: 'WO-2026-001',
    itemId: 'item-tshirt',
    item: tshirt,
    bomId: 'bom-tshirt',
    bom: { id: 'bom-tshirt', code: 'BOM-TSHIRT-BASIC', name: 'Basic T-shirt recipe' },
    locationId: 'loc-lhr',
    location: lahore,
    quantity: '500',
    completedQty: '0',
    status: 'RELEASED',
    dueDate: '2026-08-20',
    notes: 'Outlet restock — white, mixed sizes'
  },
  {
    id: 'wo-002',
    code: 'WO-2026-002',
    itemId: 'item-polo',
    item: polo,
    bomId: 'bom-polo',
    bom: { id: 'bom-polo', code: 'BOM-POLO-PIQUE', name: 'Pique polo recipe' },
    locationId: 'loc-lhr',
    location: lahore,
    quantity: '200',
    completedQty: '80',
    status: 'IN_PROGRESS',
    dueDate: '2026-08-18',
    notes: 'Navy / M-L only'
  },
  {
    id: 'wo-003',
    code: 'WO-2026-003',
    itemId: 'item-tshirt',
    item: tshirt,
    bomId: 'bom-tshirt',
    bom: { id: 'bom-tshirt', code: 'BOM-TSHIRT-BASIC', name: 'Basic T-shirt recipe' },
    locationId: 'loc-lhr',
    location: lahore,
    quantity: '120',
    completedQty: '0',
    status: 'DRAFT',
    dueDate: '2026-08-28',
    notes: ''
  }
];

export const DUMMY_GATE_PASSES = [
  {
    id: 'gp-001',
    code: 'GP-OUT-001',
    type: 'OUTWARD',
    reason: 'DISPATCH',
    status: 'ISSUED',
    locationId: 'loc-lhr',
    location: lahore,
    destinationId: 'loc-isb',
    destination: outlet,
    vehicleNo: 'LEA-2194',
    driverName: 'Imran Malik',
    issuedAt: '2026-08-12T09:15:00.000Z',
    notes: 'Finished goods to Islamabad outlet',
    lines: [
      {
        id: 'gpl-1',
        itemId: 'item-tshirt',
        item: tshirt,
        quantity: '120',
        remarks: 'Carton 1–4'
      }
    ]
  },
  {
    id: 'gp-002',
    code: 'GP-IN-001',
    type: 'INWARD',
    reason: 'RETURN',
    status: 'DRAFT',
    locationId: 'loc-lhr',
    location: lahore,
    destinationId: '',
    destination: null,
    vehicleNo: 'LHR-8841',
    driverName: 'Sajid Ali',
    issuedAt: null,
    notes: 'Outlet returns — staining',
    lines: [
      {
        id: 'gpl-2',
        itemId: 'item-polo',
        item: polo,
        quantity: '8',
        remarks: 'QC hold'
      }
    ]
  },
  {
    id: 'gp-003',
    code: 'GP-OUT-002',
    type: 'OUTWARD',
    reason: 'TRANSFER',
    status: 'CLOSED',
    locationId: 'loc-lhr',
    location: lahore,
    destinationId: 'loc-khi',
    destination: findCatalog(DUMMY_LOCATIONS, 'loc-khi'),
    vehicleNo: 'KHI-1022',
    driverName: 'Naveed Khan',
    issuedAt: '2026-08-08T14:40:00.000Z',
    notes: 'WIP fabric to Karachi cutting',
    lines: [
      {
        id: 'gpl-3',
        itemId: 'item-fabric',
        item: fabric,
        quantity: '85.000',
        remarks: 'Rolls 12–19'
      }
    ]
  }
];
