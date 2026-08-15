import { createMemoryCollection } from './memory';
import {
  DUMMY_ITEMS,
  DUMMY_LOCATIONS,
  DUMMY_STORES,
  DUMMY_UOMS,
  findCatalog
} from './production-catalog';
import {
  DUMMY_BOMS,
  DUMMY_BOM_TEMPLATES,
  DUMMY_GATE_PASSES,
  DUMMY_WORK_CENTERS,
  DUMMY_WORK_ORDERS
} from './production-records';

const workCenters = createMemoryCollection(DUMMY_WORK_CENTERS);
const bomTemplates = createMemoryCollection(DUMMY_BOM_TEMPLATES);
const boms = createMemoryCollection(DUMMY_BOMS);
const workOrders = createMemoryCollection(DUMMY_WORK_ORDERS);
const gatePasses = createMemoryCollection(DUMMY_GATE_PASSES);

function nextCode(prefix, count) {
  return `${prefix}-${String(count + 1).padStart(3, '0')}`;
}

function hydrateBomLines(lines = []) {
  return lines.map((line) => {
    const item = findCatalog(DUMMY_ITEMS, line.itemId) || line.item || null;
    return {
      id: line.id || crypto.randomUUID(),
      itemId: line.itemId,
      item,
      quantity: line.quantity,
      scrapPercent: line.scrapPercent || '0',
      workCenterId: line.workCenterId || ''
    };
  });
}

export const productionDummy = {
  catalog: {
    items: DUMMY_ITEMS,
    locations: DUMMY_LOCATIONS,
    stores: DUMMY_STORES,
    uoms: DUMMY_UOMS
  },

  workCenters,
  bomTemplates,
  boms,
  workOrders,
  gatePasses,

  async createBomTemplate(payload) {
    const { lines, ...rest } = payload;
    const item = findCatalog(DUMMY_ITEMS, rest.itemId);
    const all = await bomTemplates.getAll();
    return bomTemplates.create({
      isActive: true,
      baseQty: rest.baseQty || '1',
      notes: rest.notes || '',
      ...rest,
      code: rest.code?.toUpperCase() || nextCode('TPL', all.length),
      item,
      lines: hydrateBomLines(lines)
    });
  },

  async updateBomTemplate(id, payload) {
    const { lines, ...rest } = payload;
    const item = findCatalog(DUMMY_ITEMS, rest.itemId);
    return bomTemplates.update(id, {
      ...rest,
      ...(item ? { item } : {}),
      ...(lines ? { lines: hydrateBomLines(lines) } : {})
    });
  },

  async createWorkCenter(payload) {
    const location = findCatalog(DUMMY_LOCATIONS, payload.locationId);
    return workCenters.create({
      isActive: true,
      ...payload,
      code: payload.code?.toUpperCase(),
      location,
      capacityPerDay: payload.capacityPerDay || '0'
    });
  },

  async updateWorkCenter(id, payload) {
    const location = findCatalog(DUMMY_LOCATIONS, payload.locationId);
    return workCenters.update(id, {
      ...payload,
      ...(location ? { location } : {})
    });
  },

  async createBom(payload) {
    const { lines, ...rest } = payload;
    const item = findCatalog(DUMMY_ITEMS, rest.itemId);
    const all = await boms.getAll();
    return boms.create({
      isActive: true,
      version: rest.version || '1',
      outputQty: rest.outputQty || '1',
      ...rest,
      code: rest.code?.toUpperCase() || nextCode('BOM', all.length),
      item,
      lines: hydrateBomLines(lines)
    });
  },

  async updateBom(id, payload) {
    const { lines, ...rest } = payload;
    const item = findCatalog(DUMMY_ITEMS, rest.itemId);
    return boms.update(id, {
      ...rest,
      ...(item ? { item } : {}),
      ...(lines ? { lines: hydrateBomLines(lines) } : {})
    });
  },

  async addBomLine(bomId, payload) {
    const bom = await boms.get(bomId);
    if (!bom) return null;
    const item = findCatalog(DUMMY_ITEMS, payload.itemId);
    const line = {
      id: crypto.randomUUID(),
      itemId: payload.itemId,
      item,
      quantity: payload.quantity,
      scrapPercent: payload.scrapPercent || '0',
      workCenterId: payload.workCenterId || ''
    };
    return boms.update(bomId, { lines: [...(bom.lines ?? []), line] });
  },

  async removeBomLine(bomId, lineId) {
    const bom = await boms.get(bomId);
    if (!bom) return null;
    return boms.update(bomId, {
      lines: (bom.lines ?? []).filter((line) => line.id !== lineId)
    });
  },

  async createWorkOrder(payload) {
    const item = findCatalog(DUMMY_ITEMS, payload.itemId);
    const bom = await boms.get(payload.bomId);
    const location = findCatalog(DUMMY_LOCATIONS, payload.locationId);
    const all = await workOrders.getAll();
    return workOrders.create({
      status: 'DRAFT',
      completedQty: '0',
      ...payload,
      code: payload.code || nextCode('WO-2026', all.length),
      item,
      bom: bom
        ? { id: bom.id, code: bom.code, name: bom.name }
        : null,
      location
    });
  },

  async createGatePass(payload) {
    const location = findCatalog(DUMMY_LOCATIONS, payload.locationId);
    const destination = findCatalog(DUMMY_LOCATIONS, payload.destinationId);
    const all = await gatePasses.getAll();
    const prefix = payload.type === 'INWARD' ? 'GP-IN' : 'GP-OUT';
    return gatePasses.create({
      status: 'DRAFT',
      issuedAt: null,
      lines: [],
      ...payload,
      code: payload.code || nextCode(prefix, all.length),
      location,
      destination
    });
  },

  async addGatePassLine(passId, payload) {
    const pass = await gatePasses.get(passId);
    if (!pass) return null;
    const item = findCatalog(DUMMY_ITEMS, payload.itemId);
    const line = {
      id: crypto.randomUUID(),
      itemId: payload.itemId,
      item,
      quantity: payload.quantity,
      remarks: payload.remarks || ''
    };
    return gatePasses.update(passId, { lines: [...(pass.lines ?? []), line] });
  },

  async removeGatePassLine(passId, lineId) {
    const pass = await gatePasses.get(passId);
    if (!pass) return null;
    return gatePasses.update(passId, {
      lines: (pass.lines ?? []).filter((line) => line.id !== lineId)
    });
  }
};
