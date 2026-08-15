import { createMemoryCollection } from './memory';
import {
  DUMMY_ITEMS,
  DUMMY_LOCATIONS,
  findCatalog
} from './production-catalog';
import { DUMMY_CUSTOMERS, DUMMY_SALES_ORDERS } from './sales-records';

const customers = createMemoryCollection(DUMMY_CUSTOMERS);
const salesOrders = createMemoryCollection(DUMMY_SALES_ORDERS);

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

export const salesDummy = {
  customers,
  salesOrders,

  async createCustomer(payload) {
    const all = await customers.getAll();
    return customers.create({
      isActive: true,
      ...payload,
      code: payload.code?.toUpperCase() || nextCode('CUS', all.length)
    });
  },

  async updateCustomer(id, payload) {
    return customers.update(id, {
      ...payload,
      ...(payload.code ? { code: payload.code.toUpperCase() } : {})
    });
  },

  async createSalesOrder(payload) {
    const { lines, ...rest } = payload;
    const customer = await customers.get(rest.customerId);
    const location = findCatalog(DUMMY_LOCATIONS, rest.locationId);
    const shipTo = findCatalog(DUMMY_LOCATIONS, rest.shipToId);
    const all = await salesOrders.getAll();
    return salesOrders.create({
      status: 'DRAFT',
      orderDate: rest.orderDate || new Date().toISOString().slice(0, 10),
      ...rest,
      code: rest.code || nextCode('SO-2026', all.length),
      customer,
      location,
      shipTo,
      lines: hydrateLines(lines)
    });
  },

  async updateSalesOrder(id, payload) {
    const { lines, ...rest } = payload;
    const customer = rest.customerId
      ? await customers.get(rest.customerId)
      : null;
    const location = findCatalog(DUMMY_LOCATIONS, rest.locationId);
    const shipTo = findCatalog(DUMMY_LOCATIONS, rest.shipToId);
    return salesOrders.update(id, {
      ...rest,
      ...(customer ? { customer } : {}),
      ...(location ? { location } : {}),
      shipTo: rest.shipToId === '__none__' || !rest.shipToId ? null : shipTo,
      ...(lines ? { lines: hydrateLines(lines) } : {})
    });
  },

  async addSalesOrderLine(id, payload) {
    const order = await salesOrders.get(id);
    if (!order) return null;
    const item = findCatalog(DUMMY_ITEMS, payload.itemId);
    const line = {
      id: crypto.randomUUID(),
      itemId: payload.itemId,
      item,
      quantity: payload.quantity,
      unitPrice: payload.unitPrice || '0'
    };
    return salesOrders.update(id, {
      lines: [...(order.lines ?? []), line]
    });
  },

  async removeSalesOrderLine(id, lineId) {
    const order = await salesOrders.get(id);
    if (!order) return null;
    return salesOrders.update(id, {
      lines: (order.lines ?? []).filter((line) => line.id !== lineId)
    });
  }
};
