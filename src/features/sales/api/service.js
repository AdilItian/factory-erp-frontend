import { salesDummy } from '../../../../data/dummy/sales-store';
import {
  DUMMY_ITEMS,
  DUMMY_LOCATIONS
} from '../../../../data/dummy/production-catalog';

class SalesService {
  getCatalog() {
    return { items: DUMMY_ITEMS, locations: DUMMY_LOCATIONS };
  }

  getCustomers(params = { page: 1, limit: 20 }) {
    return salesDummy.customers.list(params);
  }

  createCustomer(payload) {
    return salesDummy.createCustomer(payload);
  }

  updateCustomer(id, payload) {
    return salesDummy.updateCustomer(id, payload);
  }

  deleteCustomer(id) {
    return salesDummy.customers.remove(id);
  }

  getSalesOrders(params = { page: 1, limit: 20 }) {
    return salesDummy.salesOrders.list(params);
  }

  getSalesOrder(id) {
    return salesDummy.salesOrders.get(id);
  }

  createSalesOrder(payload) {
    return salesDummy.createSalesOrder(payload);
  }

  updateSalesOrder(id, payload) {
    return salesDummy.updateSalesOrder(id, payload);
  }

  deleteSalesOrder(id) {
    return salesDummy.salesOrders.remove(id);
  }

  addSalesOrderLine(id, payload) {
    return salesDummy.addSalesOrderLine(id, payload);
  }

  removeSalesOrderLine(id, lineId) {
    return salesDummy.removeSalesOrderLine(id, lineId);
  }

  setSalesOrderStatus(id, status) {
    return salesDummy.salesOrders.update(id, { status });
  }
}

const salesService = new SalesService();
export default salesService;
