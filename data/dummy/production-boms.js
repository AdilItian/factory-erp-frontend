import { DUMMY_ITEMS, findCatalog } from './production-catalog';

const tshirt = findCatalog(DUMMY_ITEMS, 'item-tshirt');
const polo = findCatalog(DUMMY_ITEMS, 'item-polo');
const hoodie = findCatalog(DUMMY_ITEMS, 'item-hoodie');
const fabric = findCatalog(DUMMY_ITEMS, 'item-fabric');
const thread = findCatalog(DUMMY_ITEMS, 'item-thread');
const label = findCatalog(DUMMY_ITEMS, 'item-label');
const bag = findCatalog(DUMMY_ITEMS, 'item-bag');
const rib = findCatalog(DUMMY_ITEMS, 'item-rib');
const button = findCatalog(DUMMY_ITEMS, 'item-button');
const zip = findCatalog(DUMMY_ITEMS, 'item-zip');

export const DUMMY_BOMS = [
  {
    id: 'bom-tshirt',
    code: 'BOM-TSHIRT-BASIC',
    name: 'Basic T-shirt recipe',
    version: '1',
    outputQty: '1',
    itemId: 'item-tshirt',
    item: tshirt,
    isActive: true,
    lines: [
      {
        id: 'bl-1',
        itemId: 'item-fabric',
        item: fabric,
        quantity: '0.350',
        scrapPercent: '3',
        workCenterId: 'wc-cut'
      },
      {
        id: 'bl-rib',
        itemId: 'item-rib',
        item: rib,
        quantity: '0.040',
        scrapPercent: '4',
        workCenterId: 'wc-cut'
      },
      {
        id: 'bl-2',
        itemId: 'item-thread',
        item: thread,
        quantity: '12',
        scrapPercent: '5',
        workCenterId: 'wc-sew'
      },
      {
        id: 'bl-3',
        itemId: 'item-label',
        item: label,
        quantity: '1',
        scrapPercent: '0',
        workCenterId: 'wc-fin'
      },
      {
        id: 'bl-4',
        itemId: 'item-bag',
        item: bag,
        quantity: '1',
        scrapPercent: '0',
        workCenterId: 'wc-pack'
      }
    ]
  },
  {
    id: 'bom-polo',
    code: 'BOM-POLO-PIQUE',
    name: 'Pique polo recipe',
    version: '1',
    outputQty: '1',
    itemId: 'item-polo',
    item: polo,
    isActive: true,
    lines: [
      {
        id: 'bl-5',
        itemId: 'item-fabric',
        item: fabric,
        quantity: '0.480',
        scrapPercent: '4',
        workCenterId: 'wc-cut'
      },
      {
        id: 'bl-6',
        itemId: 'item-thread',
        item: thread,
        quantity: '18',
        scrapPercent: '5',
        workCenterId: 'wc-sew'
      },
      {
        id: 'bl-btn',
        itemId: 'item-button',
        item: button,
        quantity: '3',
        scrapPercent: '2',
        workCenterId: 'wc-fin'
      },
      {
        id: 'bl-7',
        itemId: 'item-label',
        item: label,
        quantity: '1',
        scrapPercent: '0',
        workCenterId: 'wc-fin'
      }
    ]
  },
  {
    id: 'bom-hoodie',
    code: 'BOM-HOODIE-ZIP',
    name: 'Zip hoodie recipe',
    version: '1',
    outputQty: '1',
    itemId: 'item-hoodie',
    item: hoodie,
    isActive: true,
    lines: [
      {
        id: 'bl-h1',
        itemId: 'item-fabric',
        item: fabric,
        quantity: '0.720',
        scrapPercent: '5',
        workCenterId: 'wc-cut'
      },
      {
        id: 'bl-h2',
        itemId: 'item-thread',
        item: thread,
        quantity: '24',
        scrapPercent: '5',
        workCenterId: 'wc-sew'
      },
      {
        id: 'bl-h3',
        itemId: 'item-zip',
        item: zip,
        quantity: '1',
        scrapPercent: '0',
        workCenterId: 'wc-fin'
      },
      {
        id: 'bl-h4',
        itemId: 'item-label',
        item: label,
        quantity: '1',
        scrapPercent: '0',
        workCenterId: 'wc-fin'
      }
    ]
  }
];
