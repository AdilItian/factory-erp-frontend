export const DUMMY_LOCATIONS = [
  { id: 'loc-lhr', code: 'FAC-LHR', name: 'Lahore Factory', type: 'FACTORY' },
  { id: 'loc-khi', code: 'FAC-KHI', name: 'Karachi Factory', type: 'FACTORY' },
  { id: 'loc-isb', code: 'OUT-ISB', name: 'Islamabad Outlet', type: 'OUTLET' },
  { id: 'loc-lhr-out', code: 'OUT-LHR', name: 'Lahore Outlet', type: 'OUTLET' }
];

export const DUMMY_STORES = [
  {
    id: 'store-raw',
    code: 'RAW',
    name: 'Raw Material Store',
    type: 'RAW',
    locationId: 'loc-lhr',
    location: { id: 'loc-lhr', code: 'FAC-LHR', name: 'Lahore Factory' }
  },
  {
    id: 'store-wip',
    code: 'WIP',
    name: 'WIP Floor',
    type: 'WIP',
    locationId: 'loc-lhr',
    location: { id: 'loc-lhr', code: 'FAC-LHR', name: 'Lahore Factory' }
  },
  {
    id: 'store-fg',
    code: 'FG',
    name: 'Finished Goods',
    type: 'FINISHED_GOODS',
    locationId: 'loc-lhr',
    location: { id: 'loc-lhr', code: 'FAC-LHR', name: 'Lahore Factory' }
  }
];

export const DUMMY_ITEMS = [
  {
    id: 'item-tshirt',
    code: 'TSHIRT-BASIC',
    name: 'Basic Crew Neck T-Shirt',
    type: 'FINISHED_GOOD',
    barcode: '8901001001001',
    uom: { id: 'uom-pcs', code: 'PCS', name: 'Piece' }
  },
  {
    id: 'item-polo',
    code: 'POLO-PIQUE',
    name: 'Pique Polo Shirt',
    type: 'FINISHED_GOOD',
    barcode: '8901001002008',
    uom: { id: 'uom-pcs', code: 'PCS', name: 'Piece' }
  },
  {
    id: 'item-fabric',
    code: 'FAB-JERSEY-180',
    name: 'Cotton Jersey 180gsm',
    type: 'RAW_MATERIAL',
    uom: { id: 'uom-kg', code: 'KG', name: 'Kilogram' }
  },
  {
    id: 'item-thread',
    code: 'THREAD-40',
    name: 'Sewing Thread 40s',
    type: 'RAW_MATERIAL',
    uom: { id: 'uom-m', code: 'M', name: 'Metre' }
  },
  {
    id: 'item-label',
    code: 'LABEL-MAIN',
    name: 'Main woven label',
    type: 'PACKAGING',
    uom: { id: 'uom-pcs', code: 'PCS', name: 'Piece' }
  },
  {
    id: 'item-bag',
    code: 'POLY-BAG',
    name: 'Poly bag',
    type: 'PACKAGING',
    uom: { id: 'uom-pcs', code: 'PCS', name: 'Piece' }
  },
  {
    id: 'item-rib',
    code: 'RIB-1X1',
    name: '1x1 neck rib',
    type: 'RAW_MATERIAL',
    uom: { id: 'uom-kg', code: 'KG', name: 'Kilogram' }
  },
  {
    id: 'item-button',
    code: 'BTN-14L',
    name: '14-ligne shirt button',
    type: 'RAW_MATERIAL',
    uom: { id: 'uom-pcs', code: 'PCS', name: 'Piece' }
  },
  {
    id: 'item-zip',
    code: 'ZIP-NYLON-20',
    name: 'Nylon zipper 20"',
    type: 'RAW_MATERIAL',
    uom: { id: 'uom-pcs', code: 'PCS', name: 'Piece' }
  },
  {
    id: 'item-hoodie',
    code: 'HOODIE-ZIP',
    name: 'Zip hoodie',
    type: 'FINISHED_GOOD',
    barcode: '8901001003005',
    uom: { id: 'uom-pcs', code: 'PCS', name: 'Piece' }
  }
];

export const DUMMY_UOMS = [
  { id: 'uom-pcs', code: 'PCS', name: 'Piece', symbol: 'pcs' },
  { id: 'uom-kg', code: 'KG', name: 'Kilogram', symbol: 'kg' },
  { id: 'uom-m', code: 'M', name: 'Metre', symbol: 'm' }
];

export function findCatalog(list, id) {
  return list.find((row) => String(row.id) === String(id)) ?? null;
}
