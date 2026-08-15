import apiClient from '@/lib/axios/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import {
  normalizeArray,
  normalizePagedList,
  unwrapPayload
} from '@/lib/normalize-list';

class ItemsService {
  async getItems(params = { page: 1, limit: 20 }) {
    const res = await apiClient.get(API_ENDPOINTS.ITEMS.ALL, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        ...(params.search ? { search: params.search } : {}),
        ...(params.type ? { type: params.type } : {}),
        ...(params.categoryId ? { categoryId: params.categoryId } : {})
      }
    });
    return normalizePagedList(res.data, params);
  }

  async getItem(id) {
    const res = await apiClient.get(API_ENDPOINTS.ITEMS.BY_ID(id));
    return unwrapPayload(res.data);
  }

  async createItem(payload) {
    const res = await apiClient.post(API_ENDPOINTS.ITEMS.ALL, payload);
    return res.data;
  }

  async updateItem(id, payload) {
    const res = await apiClient.patch(API_ENDPOINTS.ITEMS.BY_ID(id), payload);
    return res.data;
  }

  async deleteItem(id) {
    const res = await apiClient.delete(API_ENDPOINTS.ITEMS.BY_ID(id));
    return res.data;
  }

  async getCategories(params = {}) {
    const res = await apiClient.get(API_ENDPOINTS.ITEM_CATEGORIES.ALL, {
      params: {
        ...(params.search ? { search: params.search } : {}),
        ...(params.parentId ? { parentId: params.parentId } : {})
      }
    });
    return normalizeArray(res.data);
  }

  async createCategory(payload) {
    const res = await apiClient.post(
      API_ENDPOINTS.ITEM_CATEGORIES.ALL,
      payload
    );
    return res.data;
  }

  async updateCategory(id, payload) {
    const res = await apiClient.patch(
      API_ENDPOINTS.ITEM_CATEGORIES.BY_ID(id),
      payload
    );
    return res.data;
  }

  async deleteCategory(id) {
    const res = await apiClient.delete(API_ENDPOINTS.ITEM_CATEGORIES.BY_ID(id));
    return res.data;
  }
}

const itemsService = new ItemsService();
export default itemsService;
