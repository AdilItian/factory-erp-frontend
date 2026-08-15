import apiClient from '@/lib/axios/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { normalizePagedList, pageLimit, unwrapPayload } from '@/lib/normalize-list';

class StoresService {
  async getStores(params = { page: 1, limit: 20 }) {
    const res = await apiClient.get(API_ENDPOINTS.STORES.ALL, {
      params: {
        page: params.page ?? 1,
        limit: pageLimit(params.limit),
        ...(params.locationId ? { locationId: params.locationId } : {}),
        ...(params.type ? { type: params.type } : {})
      }
    });
    return normalizePagedList(res.data, params);
  }

  async getStore(id) {
    const res = await apiClient.get(API_ENDPOINTS.STORES.BY_ID(id));
    return unwrapPayload(res.data);
  }

  async createStore(payload) {
    const res = await apiClient.post(API_ENDPOINTS.STORES.ALL, payload);
    return res.data;
  }

  async updateStore(id, payload) {
    const res = await apiClient.patch(API_ENDPOINTS.STORES.BY_ID(id), payload);
    return res.data;
  }

  async deleteStore(id) {
    const res = await apiClient.delete(API_ENDPOINTS.STORES.BY_ID(id));
    return res.data;
  }

  async provisionStores(locationId) {
    const res = await apiClient.post(API_ENDPOINTS.STORES.PROVISION(locationId));
    return res.data;
  }
}

const storesService = new StoresService();
export default storesService;
