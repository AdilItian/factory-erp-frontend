import apiClient from '@/lib/axios/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

function collectList(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  const candidates = [
    payload.projects,
    payload.items,
    payload.content,
    payload.results,
    payload.records,
    payload.rows,
    payload.data
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  if (payload.data && typeof payload.data === 'object') {
    return collectList(payload.data);
  }

  return [];
}

function readTotal(payload, data, fallback) {
  const sources = [
    payload,
    payload?.meta,
    payload?.pagination,
    data,
    data?.meta,
    data?.data
  ];

  for (const source of sources) {
    if (!source || typeof source !== 'object') continue;
    const total =
      source.total ??
      source.totalItems ??
      source.total_items ??
      source.totalElements ??
      source.total_count ??
      source.count;
    if (total != null && total !== '') return Number(total);
  }

  return fallback;
}

function normalizeProjectsListResponse(data, params) {
  const payload = data?.data ?? data;
  const projects = collectList(payload);
  const total = readTotal(payload, data, projects.length);

  return {
    projects,
    total: Number.isFinite(total) ? total : projects.length,
    page: params.page ?? 1,
    limit: params.limit ?? 20
  };
}

class ProjectsService {
  async getProjects(params = { page: 1, limit: 20 }) {
    const res = await apiClient.get(API_ENDPOINTS.PROJECTS.ALL, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        ...(params.status ? { status: params.status } : {})
      }
    });
    return normalizeProjectsListResponse(res.data, params);
  }

  async getProject(projectId) {
    const res = await apiClient.get(API_ENDPOINTS.PROJECTS.BY_ID(projectId));
    return res.data?.data ?? res.data;
  }

  async createProject(payload) {
    const res = await apiClient.post(API_ENDPOINTS.PROJECTS.ALL, payload);
    return res.data;
  }

  async updateProject(projectId, payload) {
    const res = await apiClient.patch(
      API_ENDPOINTS.PROJECTS.BY_ID(projectId),
      payload
    );
    return res.data;
  }

  async deleteProject(projectId) {
    const res = await apiClient.delete(API_ENDPOINTS.PROJECTS.BY_ID(projectId));
    return res.data;
  }

  async assignManagers(projectId, projectManagerIds) {
    const res = await apiClient.post(API_ENDPOINTS.PROJECTS.MANAGERS(projectId), {
      projectManagerIds
    });
    return res.data;
  }

  async removeManager(projectId, userId) {
    const res = await apiClient.delete(
      API_ENDPOINTS.PROJECTS.REMOVE_MANAGER(projectId, userId)
    );
    return res.data;
  }
}

export { ProjectsService };
const projectsService = new ProjectsService();
export default projectsService;
