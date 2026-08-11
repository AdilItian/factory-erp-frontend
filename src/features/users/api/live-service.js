import apiClient from '@/lib/axios/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

function unwrapPayload(data) {
  return data?.data ?? data;
}

function normalizeUsersList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
}

function normalizeUsersListResponse(data, params) {
  const payload = unwrapPayload(data);
  const users = normalizeUsersList(payload);

  const total =
    payload?.total ??
    payload?.totalItems ??
    payload?.total_items ??
    payload?.totalElements ??
    payload?.meta?.total ??
    data?.total ??
    users.length;

  return {
    users,
    total: Number(total) || users.length,
    page: params.page ?? 1,
    limit: params.limit ?? 20
  };
}

export function mapUsersToOptions(users) {
  return (users ?? [])
    .map((user) => {
      const value = String(user.id ?? user['_id'] ?? '');
      const fullName = [
        user.firstName,
        user.lastName,
        user.first_name,
        user.last_name
      ]
        .filter(Boolean)
        .join(' ')
        .trim();
      const label = fullName || user.name || user.email || value;

      return { label, value };
    })
    .filter((option) => option.value);
}

class UsersService {
  async getUsers(params = { page: 1, limit: 20 }) {
    const res = await apiClient.get(API_ENDPOINTS.USERS.ALL, { params });
    return normalizeUsersListResponse(res.data, params);
  }

  async getUser(userId) {
    const res = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(userId));
    return unwrapPayload(res.data);
  }

  async inviteUser(payload) {
    const res = await apiClient.post(API_ENDPOINTS.USERS.INVITE, payload);
    return res.data;
  }

  async updateUser(userId, payload) {
    const res = await apiClient.patch(API_ENDPOINTS.USERS.BY_ID(userId), payload);
    return res.data;
  }

  async deleteUser(userId) {
    const res = await apiClient.delete(API_ENDPOINTS.USERS.BY_ID(userId));
    return res.data;
  }
}

export { UsersService };
const usersService = new UsersService();
export default usersService;
