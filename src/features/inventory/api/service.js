import apiClient from '@/lib/axios/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { normalizePagedList, pageLimit } from '@/lib/normalize-list';

class InventoryService {
  async getOnHand(params = { page: 1, limit: 20 }) {
    const res = await apiClient.get(API_ENDPOINTS.INVENTORY.ON_HAND, {
      params: {
        page: params.page ?? 1,
        limit: pageLimit(params.limit),
        ...(params.itemId ? { itemId: params.itemId } : {}),
        ...(params.storeId ? { storeId: params.storeId } : {}),
        ...(params.locationId ? { locationId: params.locationId } : {}),
        ...(params.nonZeroOnly ? { nonZeroOnly: true } : {})
      }
    });
    return normalizePagedList(res.data, params);
  }

  async getLedger(params = { page: 1, limit: 50 }) {
    const res = await apiClient.get(API_ENDPOINTS.INVENTORY.LEDGER, {
      params: {
        page: params.page ?? 1,
        limit: pageLimit(params.limit, 200),
        ...(params.itemId ? { itemId: params.itemId } : {}),
        ...(params.storeId ? { storeId: params.storeId } : {}),
        ...(params.locationId ? { locationId: params.locationId } : {}),
        ...(params.movementType ? { movementType: params.movementType } : {})
      }
    });
    return normalizePagedList(res.data, params);
  }

  async recordOpening(payload) {
    const res = await apiClient.post(API_ENDPOINTS.INVENTORY.OPENING, payload);
    return res.data;
  }

  async adjustStock(payload) {
    const res = await apiClient.post(
      API_ENDPOINTS.INVENTORY.ADJUSTMENTS,
      payload
    );
    return res.data;
  }
}

const inventoryService = new InventoryService();
export default inventoryService;
