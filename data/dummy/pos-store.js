import { createMemoryCollection } from './memory';
import {
  DUMMY_ITEMS,
  DUMMY_LOCATIONS,
  findCatalog
} from './production-catalog';

/** Retail shelf prices for outlet POS (finished goods). */
export const POS_RETAIL_PRICES = {
  'item-tshirt': '890',
  'item-polo': '1450',
  'item-hoodie': '2890'
};

const sales = createMemoryCollection([
  {
    id: 'pos-001',
    code: 'POS-ISB-001',
    locationId: 'loc-isb',
    location: findCatalog(DUMMY_LOCATIONS, 'loc-isb'),
    paymentMethod: 'CASH',
    status: 'COMPLETED',
    subtotal: '1780',
    discount: '0',
    total: '1780',
    tendered: '2000',
    change: '220',
    soldAt: '2026-08-14T11:20:00.000Z',
    lines: [
      {
        id: 'posl-1',
        itemId: 'item-tshirt',
        item: findCatalog(DUMMY_ITEMS, 'item-tshirt'),
        quantity: '2',
        unitPrice: '890',
        lineTotal: '1780'
      }
    ]
  }
]);

const returns = createMemoryCollection([
  {
    id: 'ret-001',
    code: 'RET-ISB-001',
    status: 'REFUNDED',
    saleId: 'pos-001',
    saleCode: 'POS-ISB-001',
    locationId: 'loc-isb',
    location: findCatalog(DUMMY_LOCATIONS, 'loc-isb'),
    reason: 'SIZE_FIT',
    refundMethod: 'CASH',
    refundTotal: '890',
    notes: 'Customer exchanged size — refunded one tee',
    returnedAt: '2026-08-15T09:10:00.000Z',
    lines: [
      {
        id: 'retl-1',
        itemId: 'item-tshirt',
        item: findCatalog(DUMMY_ITEMS, 'item-tshirt'),
        quantity: '1',
        unitPrice: '890',
        lineTotal: '890'
      }
    ]
  }
]);

function nextCode(outletCode, count) {
  const prefix = outletCode?.replace(/^OUT-/, 'POS-') || 'POS';
  return `${prefix}-${String(count + 1).padStart(3, '0')}`;
}

function nextReturnCode(outletCode, count) {
  const prefix = outletCode?.replace(/^OUT-/, 'RET-') || 'RET';
  return `${prefix}-${String(count + 1).padStart(3, '0')}`;
}

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return String(Math.round(n * 100) / 100);
}

function refundTotalFromLines(lines = []) {
  return money(
    lines.reduce((sum, line) => {
      const qty = Number(line.quantity) || 0;
      const price = Number(line.unitPrice) || 0;
      return sum + qty * price;
    }, 0)
  );
}

export const posDummy = {
  sales,
  returns,

  getOutlets() {
    return DUMMY_LOCATIONS.filter((row) => row.type === 'OUTLET');
  },

  getSellableItems() {
    return DUMMY_ITEMS.filter((row) => row.type === 'FINISHED_GOOD').map(
      (item) => ({
        ...item,
        retailPrice: POS_RETAIL_PRICES[item.id] || '0'
      })
    );
  },

  async createSale(payload) {
    const location = findCatalog(DUMMY_LOCATIONS, payload.locationId);
    const all = await sales.getAll();
    const lines = (payload.lines ?? []).map((line) => {
      const item = findCatalog(DUMMY_ITEMS, line.itemId);
      const qty = Number(line.quantity) || 0;
      const unitPrice = Number(line.unitPrice) || 0;
      return {
        id: crypto.randomUUID(),
        itemId: line.itemId,
        item,
        quantity: money(qty),
        unitPrice: money(unitPrice),
        lineTotal: money(qty * unitPrice)
      };
    });
    const subtotal = lines.reduce((sum, line) => sum + Number(line.lineTotal), 0);
    const discountType = payload.discountType === 'percent' ? 'percent' : 'amount';
    const discountValue = Math.max(0, Number(payload.discountValue) || 0);
    const discount =
      discountType === 'percent'
        ? Math.min(subtotal, (subtotal * Math.min(discountValue, 100)) / 100)
        : Math.min(subtotal, discountValue);
    const total = Math.max(0, subtotal - discount);
    const tendered = Number(payload.tendered) || total;
    const change = Math.max(0, tendered - total);

    return sales.create({
      status: 'COMPLETED',
      paymentMethod: payload.paymentMethod || 'CASH',
      locationId: payload.locationId,
      location,
      lines,
      subtotal: money(subtotal),
      discount: money(discount),
      discountType,
      discountValue: money(discountValue),
      discountPercent:
        discountType === 'percent' ? money(Math.min(discountValue, 100)) : null,
      total: money(total),
      tendered: money(tendered),
      change: money(change),
      soldAt: new Date().toISOString(),
      notes: payload.notes || '',
      code: nextCode(location?.code, all.length)
    });
  },

  async voidSale(id) {
    return sales.update(id, { status: 'VOIDED' });
  },

  async findSaleByCode(code) {
    const needle = String(code ?? '').trim().toLowerCase();
    if (!needle) return null;
    const all = await sales.getAll();
    return (
      all.find(
        (sale) =>
          String(sale.code ?? '').toLowerCase() === needle &&
          sale.status === 'COMPLETED'
      ) || null
    );
  },

  async createReturn(payload) {
    const sale = await sales.get(payload.saleId);
    if (!sale) throw new Error('Original sale not found');
    if (sale.status === 'VOIDED') {
      throw new Error('Cannot return a voided sale');
    }

    const location =
      findCatalog(DUMMY_LOCATIONS, sale.locationId) || sale.location;
    const all = await returns.getAll();

    const lines = (payload.lines?.length
      ? payload.lines
      : (sale.lines ?? []).map((line) => ({
          itemId: line.itemId,
          quantity: line.quantity,
          unitPrice: line.unitPrice
        }))
    ).map((line) => {
      const item = findCatalog(DUMMY_ITEMS, line.itemId);
      const qty = Number(line.quantity) || 0;
      const unitPrice = Number(line.unitPrice) || 0;
      return {
        id: crypto.randomUUID(),
        itemId: line.itemId,
        item,
        quantity: money(qty),
        unitPrice: money(unitPrice),
        lineTotal: money(qty * unitPrice)
      };
    });

    return returns.create({
      status: 'DRAFT',
      saleId: sale.id,
      saleCode: sale.code,
      locationId: sale.locationId,
      location,
      reason: payload.reason || 'OTHER',
      refundMethod: payload.refundMethod || sale.paymentMethod || 'CASH',
      refundTotal: refundTotalFromLines(lines),
      notes: payload.notes || '',
      returnedAt: null,
      lines,
      code: nextReturnCode(location?.code, all.length)
    });
  },

  async updateReturn(id, payload) {
    const current = await returns.get(id);
    if (!current) return null;
    if (current.status === 'REFUNDED') {
      throw new Error('Refunded returns cannot be edited');
    }
    const lines = payload.lines
      ? payload.lines.map((line) => {
          const item = findCatalog(DUMMY_ITEMS, line.itemId) || line.item;
          const qty = Number(line.quantity) || 0;
          const unitPrice = Number(line.unitPrice) || 0;
          return {
            id: line.id || crypto.randomUUID(),
            itemId: line.itemId,
            item,
            quantity: money(qty),
            unitPrice: money(unitPrice),
            lineTotal: money(qty * unitPrice)
          };
        })
      : current.lines;
    return returns.update(id, {
      ...payload,
      lines,
      refundTotal: refundTotalFromLines(lines)
    });
  },

  async addReturnLine(id, payload) {
    const doc = await returns.get(id);
    if (!doc) return null;
    if (doc.status === 'REFUNDED') {
      throw new Error('Refunded returns cannot be edited');
    }
    const item = findCatalog(DUMMY_ITEMS, payload.itemId);
    const qty = Number(payload.quantity) || 0;
    const unitPrice = Number(payload.unitPrice) || 0;
    const line = {
      id: crypto.randomUUID(),
      itemId: payload.itemId,
      item,
      quantity: money(qty),
      unitPrice: money(unitPrice),
      lineTotal: money(qty * unitPrice)
    };
    const lines = [...(doc.lines ?? []), line];
    return returns.update(id, {
      lines,
      refundTotal: refundTotalFromLines(lines)
    });
  },

  async removeReturnLine(id, lineId) {
    const doc = await returns.get(id);
    if (!doc) return null;
    if (doc.status === 'REFUNDED') {
      throw new Error('Refunded returns cannot be edited');
    }
    const lines = (doc.lines ?? []).filter((line) => line.id !== lineId);
    return returns.update(id, {
      lines,
      refundTotal: refundTotalFromLines(lines)
    });
  },

  async completeReturn(id) {
    const doc = await returns.get(id);
    if (!doc) return null;
    if (!doc.lines?.length) {
      throw new Error('Add at least one return line before refunding');
    }
    return returns.update(id, {
      status: 'REFUNDED',
      refundTotal: refundTotalFromLines(doc.lines),
      returnedAt: new Date().toISOString()
    });
  },

  removeReturn(id) {
    return returns.remove(id);
  }
};
