import { purchasingDummy } from '../../../../data/dummy/purchasing-store';
import {
  DUMMY_ITEMS,
  DUMMY_LOCATIONS
} from '../../../../data/dummy/production-catalog';

class PurchasingService {
  getCatalog() {
    return { items: DUMMY_ITEMS, locations: DUMMY_LOCATIONS };
  }

  getSuppliers(params = { page: 1, limit: 20 }) {
    return purchasingDummy.suppliers.list(params);
  }

  createSupplier(payload) {
    return purchasingDummy.createSupplier(payload);
  }

  updateSupplier(id, payload) {
    return purchasingDummy.updateSupplier(id, payload);
  }

  deleteSupplier(id) {
    return purchasingDummy.suppliers.remove(id);
  }

  getPurchaseOrders(params = { page: 1, limit: 20 }) {
    return purchasingDummy.purchaseOrders.list(params);
  }

  getPurchaseOrder(id) {
    return purchasingDummy.purchaseOrders.get(id);
  }

  createPurchaseOrder(payload) {
    return purchasingDummy.createPurchaseOrder(payload);
  }

  updatePurchaseOrder(id, payload) {
    return purchasingDummy.updatePurchaseOrder(id, payload);
  }

  deletePurchaseOrder(id) {
    return purchasingDummy.purchaseOrders.remove(id);
  }

  addPurchaseOrderLine(id, payload) {
    return purchasingDummy.addPurchaseOrderLine(id, payload);
  }

  removePurchaseOrderLine(id, lineId) {
    return purchasingDummy.removePurchaseOrderLine(id, lineId);
  }

  setPurchaseOrderStatus(id, status) {
    return purchasingDummy.purchaseOrders.update(id, { status });
  }
}

const purchasingService = new PurchasingService();
export default purchasingService;
