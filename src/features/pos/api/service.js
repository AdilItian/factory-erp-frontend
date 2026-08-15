import { posDummy } from '../../../../data/dummy/pos-store';

class PosService {
  getOutlets() {
    return Promise.resolve(posDummy.getOutlets());
  }

  getSellableItems() {
    return Promise.resolve(posDummy.getSellableItems());
  }

  getSales(params = { page: 1, limit: 20 }) {
    return posDummy.sales.list(params);
  }

  getSale(id) {
    return posDummy.sales.get(id);
  }

  createSale(payload) {
    return posDummy.createSale(payload);
  }

  voidSale(id) {
    return posDummy.voidSale(id);
  }

  findSaleByCode(code) {
    return posDummy.findSaleByCode(code);
  }

  getReturns(params = { page: 1, limit: 20 }) {
    return posDummy.returns.list(params);
  }

  getReturn(id) {
    return posDummy.returns.get(id);
  }

  createReturn(payload) {
    return posDummy.createReturn(payload);
  }

  updateReturn(id, payload) {
    return posDummy.updateReturn(id, payload);
  }

  deleteReturn(id) {
    return posDummy.removeReturn(id);
  }

  addReturnLine(id, payload) {
    return posDummy.addReturnLine(id, payload);
  }

  removeReturnLine(id, lineId) {
    return posDummy.removeReturnLine(id, lineId);
  }

  completeReturn(id) {
    return posDummy.completeReturn(id);
  }
}

const posService = new PosService();
export default posService;
