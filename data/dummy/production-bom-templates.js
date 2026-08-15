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

/** Per-piece reusable recipes. Apply on a BoM with an FG qty to scale lines. */
export const DUMMY_BOM_TEMPLATES = [
  {
    id: 'tpl-tshirt',
    code: 'TPL-TSHIRT-BASIC',
    name: 'Basic T-shirt (per piece)',
    itemId: 'item-tshirt',
    item: tshirt,
    baseQty: '1',
    notes: 'Standard crew-neck cut-make-trim.',
    isActive: true,
    lines: [
      {
        id: 'tl-1',
        itemId: 'item-fabric',
        item: fabric,
        quantity: '0.350',
        scrapPercent: '3',
        workCenterId: 'wc-cut'
      },
      {
        id: 'tl-rib',
        itemId: 'item-rib',
        item: rib,
        quantity: '0.040',
        scrapPercent: '4',
        workCenterId: 'wc-cut'
      },
      {
        id: 'tl-2',
        itemId: 'item-thread',
        item: thread,
        quantity: '12',
        scrapPercent: '5',
        workCenterId: 'wc-sew'
      },
      {
        id: 'tl-3',
        itemId: 'item-label',
        item: label,
        quantity: '1',
        scrapPercent: '0',
        workCenterId: 'wc-fin'
      },
      {
        id: 'tl-4',
        itemId: 'item-bag',
        item: bag,
        quantity: '1',
        scrapPercent: '0',
        workCenterId: 'wc-pack'
      }
    ]
  },
  {
    id: 'tpl-polo',
    code: 'TPL-POLO-PIQUE',
    name: 'Pique polo (per piece)',
    itemId: 'item-polo',
    item: polo,
    baseQty: '1',
    notes: 'Includes collar buttons.',
    isActive: true,
    lines: [
      {
        id: 'tl-5',
        itemId: 'item-fabric',
        item: fabric,
        quantity: '0.480',
        scrapPercent: '4',
        workCenterId: 'wc-cut'
      },
      {
        id: 'tl-6',
        itemId: 'item-thread',
        item: thread,
        quantity: '18',
        scrapPercent: '5',
        workCenterId: 'wc-sew'
      },
      {
        id: 'tl-btn',
        itemId: 'item-button',
        item: button,
        quantity: '3',
        scrapPercent: '2',
        workCenterId: 'wc-fin'
      },
      {
        id: 'tl-7',
        itemId: 'item-label',
        item: label,
        quantity: '1',
        scrapPercent: '0',
        workCenterId: 'wc-fin'
      }
    ]
  },
  {
    id: 'tpl-hoodie',
    code: 'TPL-HOODIE-ZIP',
    name: 'Zip hoodie (per piece)',
    itemId: 'item-hoodie',
    item: hoodie,
    baseQty: '1',
    notes: 'Full zip shell.',
    isActive: true,
    lines: [
      {
        id: 'tl-h1',
        itemId: 'item-fabric',
        item: fabric,
        quantity: '0.720',
        scrapPercent: '5',
        workCenterId: 'wc-cut'
      },
      {
        id: 'tl-h2',
        itemId: 'item-thread',
        item: thread,
        quantity: '24',
        scrapPercent: '5',
        workCenterId: 'wc-sew'
      },
      {
        id: 'tl-h3',
        itemId: 'item-zip',
        item: zip,
        quantity: '1',
        scrapPercent: '0',
        workCenterId: 'wc-fin'
      },
      {
        id: 'tl-h4',
        itemId: 'item-label',
        item: label,
        quantity: '1',
        scrapPercent: '0',
        workCenterId: 'wc-fin'
      }
    ]
  }
];
