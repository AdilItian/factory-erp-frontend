import apiClient from '@/lib/axios/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { normalizeArray, normalizePagedList, pageLimit, unwrapPayload } from '@/lib/normalize-list';

class LocationsService {
  async getLocations(params = { page: 1, limit: 20 }) {
    const res = await apiClient.get(API_ENDPOINTS.LOCATIONS.ALL, {
      params: {
        page: params.page ?? 1,
        limit: pageLimit(params.limit),
        ...(params.search ? { search: params.search } : {}),
        ...(params.type ? { type: params.type } : {})
      }
    });
    return normalizePagedList(res.data, params);
  }

  async getMyLocations() {
    const res = await apiClient.get(API_ENDPOINTS.LOCATIONS.ME);
    return normalizeArray(res.data);
  }

  async getLocation(id) {
    const res = await apiClient.get(API_ENDPOINTS.LOCATIONS.BY_ID(id));
    return unwrapPayload(res.data);
  }

  async createLocation(payload) {
    const res = await apiClient.post(API_ENDPOINTS.LOCATIONS.ALL, payload);
    return res.data;
  }

  async updateLocation(id, payload) {
    const res = await apiClient.patch(API_ENDPOINTS.LOCATIONS.BY_ID(id), payload);
    return res.data;
  }

  async deleteLocation(id) {
    const res = await apiClient.delete(API_ENDPOINTS.LOCATIONS.BY_ID(id));
    return res.data;
  }

  async getLocationUsers(id) {
    const res = await apiClient.get(API_ENDPOINTS.LOCATIONS.USERS(id));
    return normalizeArray(res.data);
  }

  async assignUsers(id, payload) {
    const res = await apiClient.post(API_ENDPOINTS.LOCATIONS.USERS(id), payload);
    return res.data;
  }

  async removeUser(id, userId) {
    const res = await apiClient.delete(
      API_ENDPOINTS.LOCATIONS.REMOVE_USER(id, userId)
    );
    return res.data;
  }
}

const locationsService = new LocationsService();
export default locationsService;
