import { warehouseDummy } from '../../../../data/dummy/warehouse-store';

class WarehouseService {
  getCatalog() {
    return warehouseDummy.getCatalog();
  }

  list(type, params = { page: 1, limit: 20 }) {
    return warehouseDummy.list(type, params);
  }

  get(type, id) {
    return warehouseDummy.get(type, id);
  }

  create(type, payload) {
    return warehouseDummy.create(type, payload);
  }

  update(type, id, payload) {
    return warehouseDummy.update(type, id, payload);
  }

  remove(type, id) {
    return warehouseDummy.remove(type, id);
  }

  addLine(type, id, payload) {
    return warehouseDummy.addLine(type, id, payload);
  }

  removeLine(type, id, lineId) {
    return warehouseDummy.removeLine(type, id, lineId);
  }

  setStatus(type, id, status) {
    return warehouseDummy.setStatus(type, id, status);
  }
}

const warehouseService = new WarehouseService();
export default warehouseService;
