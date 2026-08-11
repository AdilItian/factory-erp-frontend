import apiClient from '@/lib/axios/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

function unwrapPayload(data) {
  return data?.data ?? data;
}

function normalizeTasksList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.tasks)) return payload.tasks;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
}

function normalizeTasksListResponse(data, params) {
  const payload = unwrapPayload(data);
  const tasks = normalizeTasksList(payload);

  const total =
    payload?.total ??
    payload?.totalItems ??
    payload?.total_items ??
    payload?.totalElements ??
    payload?.meta?.total ??
    data?.total ??
    tasks.length;

  return {
    tasks,
    total: Number(total) || tasks.length,
    page: params.page ?? 1,
    limit: params.limit ?? 20
  };
}

class ProjectTasksService {
  async getProjectTasks(projectId, params = { page: 1, limit: 20 }) {
    const res = await apiClient.get(API_ENDPOINTS.PROJECTS.TASKS(projectId), {
      params
    });
    return normalizeTasksListResponse(res.data, params);
  }

  async getMyTasks(params = { page: 1, limit: 20 }) {
    const res = await apiClient.get(API_ENDPOINTS.TASKS.ME, { params });
    return normalizeTasksListResponse(res.data, params);
  }

  async getTasks(params = { page: 1, limit: 20 }) {
    const res = await apiClient.get(API_ENDPOINTS.TASKS.ALL, { params });
    return normalizeTasksListResponse(res.data, params);
  }

  async getTask(taskId) {
    const res = await apiClient.get(API_ENDPOINTS.TASKS.BY_ID(taskId));
    return unwrapPayload(res.data);
  }

  async createProjectTask(projectId, payload) {
    const res = await apiClient.post(
      API_ENDPOINTS.PROJECTS.TASKS(projectId),
      payload
    );
    return res.data;
  }

  async updateTask(taskId, payload) {
    const res = await apiClient.patch(
      API_ENDPOINTS.TASKS.BY_ID(taskId),
      payload
    );
    return res.data;
  }

  async deleteTask(taskId) {
    const res = await apiClient.delete(API_ENDPOINTS.TASKS.BY_ID(taskId));
    return res.data;
  }
}

export { ProjectTasksService };
const projectTasksService = new ProjectTasksService();
export default projectTasksService;
