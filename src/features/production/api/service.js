import { productionDummy } from '../../../../data/dummy/production-store';

// In-memory dummy data. Swap method bodies to apiClient + API_ENDPOINTS when the backend is ready.

class ProductionService {
  getCatalog() {
    return productionDummy.catalog;
  }

  getWorkCenters(params = { page: 1, limit: 20 }) {
    return productionDummy.workCenters.list(params);
  }

  createWorkCenter(payload) {
    return productionDummy.createWorkCenter(payload);
  }

  updateWorkCenter(id, payload) {
    return productionDummy.updateWorkCenter(id, payload);
  }

  deleteWorkCenter(id) {
    return productionDummy.workCenters.remove(id);
  }

  getBomTemplates(params = { page: 1, limit: 20 }) {
    return productionDummy.bomTemplates.list(params);
  }

  getBomTemplate(id) {
    return productionDummy.bomTemplates.get(id);
  }

  createBomTemplate(payload) {
    return productionDummy.createBomTemplate(payload);
  }

  updateBomTemplate(id, payload) {
    return productionDummy.updateBomTemplate(id, payload);
  }

  deleteBomTemplate(id) {
    return productionDummy.bomTemplates.remove(id);
  }

  getBoms(params = { page: 1, limit: 20 }) {
    return productionDummy.boms.list(params);
  }

  getBom(id) {
    return productionDummy.boms.get(id);
  }

  createBom(payload) {
    return productionDummy.createBom(payload);
  }

  updateBom(id, payload) {
    return productionDummy.updateBom(id, payload);
  }

  deleteBom(id) {
    return productionDummy.boms.remove(id);
  }

  addBomLine(id, payload) {
    return productionDummy.addBomLine(id, payload);
  }

  removeBomLine(id, lineId) {
    return productionDummy.removeBomLine(id, lineId);
  }

  getWorkOrders(params = { page: 1, limit: 20 }) {
    return productionDummy.workOrders.list(params);
  }

  createWorkOrder(payload) {
    return productionDummy.createWorkOrder(payload);
  }

  updateWorkOrder(id, payload) {
    return productionDummy.workOrders.update(id, payload);
  }

  deleteWorkOrder(id) {
    return productionDummy.workOrders.remove(id);
  }

  setWorkOrderStatus(id, status) {
    const extra =
      status === 'COMPLETED'
        ? { completedAt: new Date().toISOString() }
        : {};
    return productionDummy.workOrders.update(id, { status, ...extra });
  }

  getGatePasses(params = { page: 1, limit: 20 }) {
    return productionDummy.gatePasses.list(params);
  }

  getGatePass(id) {
    return productionDummy.gatePasses.get(id);
  }

  createGatePass(payload) {
    return productionDummy.createGatePass(payload);
  }

  updateGatePass(id, payload) {
    return productionDummy.gatePasses.update(id, payload);
  }

  deleteGatePass(id) {
    return productionDummy.gatePasses.remove(id);
  }

  addGatePassLine(id, payload) {
    return productionDummy.addGatePassLine(id, payload);
  }

  removeGatePassLine(id, lineId) {
    return productionDummy.removeGatePassLine(id, lineId);
  }

  setGatePassStatus(id, status) {
    const extra =
      status === 'ISSUED' ? { issuedAt: new Date().toISOString() } : {};
    return productionDummy.gatePasses.update(id, { status, ...extra });
  }
}

const productionService = new ProductionService();
export default productionService;
