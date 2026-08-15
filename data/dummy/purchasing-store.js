import { createMemoryCollection } from './memory';
import {
  DUMMY_ITEMS,
  DUMMY_LOCATIONS,
  findCatalog
} from './production-catalog';
import {
  DUMMY_PURCHASE_ORDERS,
  DUMMY_SUPPLIERS
} from './purchasing-records';

const suppliers = createMemoryCollection(DUMMY_SUPPLIERS);
const purchaseOrders = createMemoryCollection(DUMMY_PURCHASE_ORDERS);

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
      quantity: String(line.quantity ?? ''),
      unitPrice: String(line.unitPrice ?? '0')
    };
  });
}

export const purchasingDummy = {
  suppliers,
  purchaseOrders,

  async createSupplier(payload) {
    const all = await suppliers.getAll();
    return suppliers.create({
      isActive: true,
      ...payload,
      code: payload.code?.toUpperCase() || nextCode('SUP', all.length)
    });
  },

  async updateSupplier(id, payload) {
    return suppliers.update(id, {
      ...payload,
      ...(payload.code ? { code: payload.code.toUpperCase() } : {})
    });
  },

  async createPurchaseOrder(payload) {
    const { lines, ...rest } = payload;
    const supplier = await suppliers.get(rest.supplierId);
    const location = findCatalog(DUMMY_LOCATIONS, rest.locationId);
    const all = await purchaseOrders.getAll();
    return purchaseOrders.create({
      status: 'DRAFT',
      orderDate: rest.orderDate || new Date().toISOString().slice(0, 10),
      ...rest,
      code: rest.code || nextCode('PO-2026', all.length),
      supplier,
      location,
      lines: hydrateLines(lines)
    });
  },

  async updatePurchaseOrder(id, payload) {
    const { lines, ...rest } = payload;
    const supplier = rest.supplierId
      ? await suppliers.get(rest.supplierId)
      : null;
    const location = findCatalog(DUMMY_LOCATIONS, rest.locationId);
    return purchaseOrders.update(id, {
      ...rest,
      ...(supplier ? { supplier } : {}),
      ...(location ? { location } : {}),
      ...(lines ? { lines: hydrateLines(lines) } : {})
    });
  },

  async addPurchaseOrderLine(id, payload) {
    const order = await purchaseOrders.get(id);
    if (!order) return null;
    const item = findCatalog(DUMMY_ITEMS, payload.itemId);
    const line = {
      id: crypto.randomUUID(),
      itemId: payload.itemId,
      item,
      quantity: payload.quantity,
      unitPrice: payload.unitPrice || '0'
    };
    return purchaseOrders.update(id, {
      lines: [...(order.lines ?? []), line]
    });
  },

  async removePurchaseOrderLine(id, lineId) {
    const order = await purchaseOrders.get(id);
    if (!order) return null;
    return purchaseOrders.update(id, {
      lines: (order.lines ?? []).filter((line) => line.id !== lineId)
    });
  }
};
