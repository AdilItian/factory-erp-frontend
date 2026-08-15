import apiClient from '@/lib/axios/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import {
  normalizeArray,
  normalizePagedList,
  unwrapPayload
} from '@/lib/normalize-list';

class AttributesService {
  async getAttributes(params = { page: 1, limit: 20 }) {
    const res = await apiClient.get(API_ENDPOINTS.ATTRIBUTES.ALL, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        ...(params.search ? { search: params.search } : {}),
        ...(params.dataType ? { dataType: params.dataType } : {}),
        ...(params.groupId ? { groupId: params.groupId } : {})
      }
    });
    return normalizePagedList(res.data, params);
  }

  async getAttribute(id) {
    const res = await apiClient.get(API_ENDPOINTS.ATTRIBUTES.BY_ID(id));
    return unwrapPayload(res.data);
  }

  async createAttribute(payload) {
    const res = await apiClient.post(API_ENDPOINTS.ATTRIBUTES.ALL, payload);
    return res.data;
  }

  async updateAttribute(id, payload) {
    const res = await apiClient.patch(
      API_ENDPOINTS.ATTRIBUTES.BY_ID(id),
      payload
    );
    return res.data;
  }

  async deleteAttribute(id) {
    const res = await apiClient.delete(API_ENDPOINTS.ATTRIBUTES.BY_ID(id));
    return res.data;
  }

  async addOption(id, payload) {
    const res = await apiClient.post(
      API_ENDPOINTS.ATTRIBUTES.OPTIONS(id),
      payload
    );
    return res.data;
  }

  async updateOption(id, optionId, payload) {
    const res = await apiClient.patch(
      API_ENDPOINTS.ATTRIBUTES.OPTION(id, optionId),
      payload
    );
    return res.data;
  }

  async deleteOption(id, optionId) {
    const res = await apiClient.delete(
      API_ENDPOINTS.ATTRIBUTES.OPTION(id, optionId)
    );
    return res.data;
  }

  async getGroups() {
    const res = await apiClient.get(API_ENDPOINTS.ATTRIBUTE_GROUPS.ALL);
    return normalizeArray(res.data);
  }

  async createGroup(payload) {
    const res = await apiClient.post(
      API_ENDPOINTS.ATTRIBUTE_GROUPS.ALL,
      payload
    );
    return res.data;
  }

  async updateGroup(id, payload) {
    const res = await apiClient.patch(
      API_ENDPOINTS.ATTRIBUTE_GROUPS.BY_ID(id),
      payload
    );
    return res.data;
  }

  async deleteGroup(id) {
    const res = await apiClient.delete(API_ENDPOINTS.ATTRIBUTE_GROUPS.BY_ID(id));
    return res.data;
  }

  async getSets() {
    const res = await apiClient.get(API_ENDPOINTS.ATTRIBUTE_SETS.ALL);
    return normalizeArray(res.data);
  }

  async getSet(id) {
    const res = await apiClient.get(API_ENDPOINTS.ATTRIBUTE_SETS.BY_ID(id));
    return unwrapPayload(res.data);
  }

  async createSet(payload) {
    const res = await apiClient.post(API_ENDPOINTS.ATTRIBUTE_SETS.ALL, payload);
    return res.data;
  }

  async updateSet(id, payload) {
    const res = await apiClient.patch(
      API_ENDPOINTS.ATTRIBUTE_SETS.BY_ID(id),
      payload
    );
    return res.data;
  }

  async deleteSet(id) {
    const res = await apiClient.delete(API_ENDPOINTS.ATTRIBUTE_SETS.BY_ID(id));
    return res.data;
  }

  async addSetAttribute(id, payload) {
    const res = await apiClient.post(
      API_ENDPOINTS.ATTRIBUTE_SETS.ATTRIBUTES(id),
      payload
    );
    return res.data;
  }

  async updateSetAttribute(id, attributeId, payload) {
    const res = await apiClient.patch(
      API_ENDPOINTS.ATTRIBUTE_SETS.ATTRIBUTE(id, attributeId),
      payload
    );
    return res.data;
  }

  async removeSetAttribute(id, attributeId) {
    const res = await apiClient.delete(
      API_ENDPOINTS.ATTRIBUTE_SETS.ATTRIBUTE(id, attributeId)
    );
    return res.data;
  }
}

const attributesService = new AttributesService();
export default attributesService;
