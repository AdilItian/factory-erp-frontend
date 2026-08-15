import { createMemoryCollection } from './memory';
import {
  DUMMY_ITEMS,
  DUMMY_STORES,
  findCatalog
} from './production-catalog';
import { DUMMY_SUPPLIERS } from './purchasing-records';
import {
  DUMMY_MINS,
  DUMMY_MRNS,
  DUMMY_RETURNS,
  DUMMY_TRANSFERS
} from './warehouse-records';

const collections = {
  MRN: createMemoryCollection(DUMMY_MRNS),
  MIN: createMemoryCollection(DUMMY_MINS),
  MTN: createMemoryCollection(DUMMY_TRANSFERS),
  MRR: createMemoryCollection(DUMMY_RETURNS)
};

const CODE_PREFIX = {
  MRN: 'MRN-2026',
  MIN: 'MIN-2026',
  MTN: 'MTN-2026',
  MRR: 'MRR-2026'
};

function nextCode(prefix, count) {
  return `${prefix}-${String(count + 1).padStart(3, '0')}`;
}

function hydrateLines(lines = []) {
  return lines.map((line) => {
    const item = findCatalog(DUMMY_ITEMS, line.itemId) || line.item || null;
    return {
      id: line.id || crypto.randomUUID(),
      itemId: line.itemId,
      item,
      quantity: String(line.quantity ?? '')
    };
  });
}

function findSupplier(id) {
  return DUMMY_SUPPLIERS.find((row) => String(row.id) === String(id)) || null;
}

function hydrateRefs(type, payload) {
  const store = findCatalog(DUMMY_STORES, payload.storeId);
  const fromStore = findCatalog(DUMMY_STORES, payload.fromStoreId);
  const toStore = findCatalog(DUMMY_STORES, payload.toStoreId);
  const supplier = payload.supplierId
    ? findSupplier(payload.supplierId)
    : null;

  return {
    ...payload,
    ...(store ? { store } : {}),
    ...(fromStore ? { fromStore } : {}),
    ...(toStore ? { toStore } : {}),
    ...(supplier ? { supplier } : {})
  };
}

export const warehouseDummy = {
  collections,
  getCatalog() {
    return {
      items: DUMMY_ITEMS,
      stores: DUMMY_STORES,
      suppliers: DUMMY_SUPPLIERS.filter((row) => row.isActive !== false)
    };
  },

  list(type, params) {
    return collections[type].list(params);
  },

  get(type, id) {
    return collections[type].get(id);
  },

  async create(type, payload) {
    const { lines, ...rest } = payload;
    const all = await collections[type].getAll();
    return collections[type].create(
      hydrateRefs(type, {
        status: 'DRAFT',
        docDate: rest.docDate || new Date().toISOString().slice(0, 10),
        ...rest,
        code: rest.code || nextCode(CODE_PREFIX[type], all.length),
        lines: hydrateLines(lines)
      })
    );
  },

  async update(type, id, payload) {
    const { lines, ...rest } = payload;
    return collections[type].update(
      id,
      hydrateRefs(type, {
        ...rest,
        ...(lines ? { lines: hydrateLines(lines) } : {})
      })
    );
  },

  remove(type, id) {
    return collections[type].remove(id);
  },

  async addLine(type, id, payload) {
    const doc = await collections[type].get(id);
    if (!doc) return null;
    const item = findCatalog(DUMMY_ITEMS, payload.itemId);
    const line = {
      id: crypto.randomUUID(),
      itemId: payload.itemId,
      item,
      quantity: payload.quantity
    };
    return collections[type].update(id, {
      lines: [...(doc.lines ?? []), line]
    });
  },

  async removeLine(type, id, lineId) {
    const doc = await collections[type].get(id);
    if (!doc) return null;
    return collections[type].update(id, {
      lines: (doc.lines ?? []).filter((line) => line.id !== lineId)
    });
  },

  setStatus(type, id, status) {
    return collections[type].update(id, { status });
  }
};
