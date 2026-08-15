import apiClient from '@/lib/axios/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { normalizeArray, unwrapPayload } from '@/lib/normalize-list';

class UomsService {
  async getUoms(params = {}) {
    const res = await apiClient.get(API_ENDPOINTS.UOMS.ALL, {
      params: params.search ? { search: params.search } : undefined
    });
    return normalizeArray(res.data);
  }

  async getUom(id) {
    const res = await apiClient.get(API_ENDPOINTS.UOMS.BY_ID(id));
    return unwrapPayload(res.data);
  }

  async createUom(payload) {
    const res = await apiClient.post(API_ENDPOINTS.UOMS.ALL, payload);
    return res.data;
  }

  async updateUom(id, payload) {
    const res = await apiClient.patch(API_ENDPOINTS.UOMS.BY_ID(id), payload);
    return res.data;
  }

  async deleteUom(id) {
    const res = await apiClient.delete(API_ENDPOINTS.UOMS.BY_ID(id));
    return res.data;
  }

  async getConversions() {
    const res = await apiClient.get(API_ENDPOINTS.UOM_CONVERSIONS.ALL);
    return normalizeArray(res.data);
  }

  async createConversion(payload) {
    const res = await apiClient.post(API_ENDPOINTS.UOM_CONVERSIONS.ALL, payload);
    return res.data;
  }

  async deleteConversion(id) {
    const res = await apiClient.delete(API_ENDPOINTS.UOM_CONVERSIONS.BY_ID(id));
    return res.data;
  }
}

const uomsService = new UomsService();
export default uomsService;
