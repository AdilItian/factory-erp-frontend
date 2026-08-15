import apiClient from '@/lib/axios/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { normalizePagedList, pageLimit, unwrapPayload } from '@/lib/normalize-list';

class DepartmentsService {
  async getDepartments(params = { page: 1, limit: 20 }) {
    const res = await apiClient.get(API_ENDPOINTS.DEPARTMENTS.ALL, {
      params: {
        page: params.page ?? 1,
        limit: pageLimit(params.limit),
        ...(params.locationId ? { locationId: params.locationId } : {})
      }
    });
    return normalizePagedList(res.data, params);
  }

  async getDepartment(id) {
    const res = await apiClient.get(API_ENDPOINTS.DEPARTMENTS.BY_ID(id));
    return unwrapPayload(res.data);
  }

  async createDepartment(payload) {
    const res = await apiClient.post(API_ENDPOINTS.DEPARTMENTS.ALL, payload);
    return res.data;
  }

  async updateDepartment(id, payload) {
    const res = await apiClient.patch(
      API_ENDPOINTS.DEPARTMENTS.BY_ID(id),
      payload
    );
    return res.data;
  }

  async deleteDepartment(id) {
    const res = await apiClient.delete(API_ENDPOINTS.DEPARTMENTS.BY_ID(id));
    return res.data;
  }
}

const departmentsService = new DepartmentsService();
export default departmentsService;
