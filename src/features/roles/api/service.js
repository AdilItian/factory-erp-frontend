import apiClient from '@/lib/axios/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

function normalizeRolesResponse(data) {
  const roles = data?.data ?? data;
  return Array.isArray(roles) ? roles : [];
}

class RolesService {
  async getRoles() {
    const res = await apiClient.get(API_ENDPOINTS.ROLES.ALL);
    return normalizeRolesResponse(res.data);
  }

  async createRole(payload) {
    const res = await apiClient.post(API_ENDPOINTS.ROLES.ALL, payload);
    return res.data;
  }

  async deleteRole(roleId) {
    const res = await apiClient.delete(API_ENDPOINTS.ROLES.BY_ID(roleId));
    return res.data;
  }

  async assignRole({ userId, roleId }) {
    const res = await apiClient.post(API_ENDPOINTS.ROLES.ASSIGN, {
      userId,
      roleId
    });
    return res.data;
  }

  async revokeRole({ userId, roleId }) {
    const res = await apiClient.post(API_ENDPOINTS.ROLES.REVOKE, {
      userId,
      roleId
    });
    return res.data;
  }
}

export { RolesService };
const rolesService = new RolesService();
export default rolesService;
