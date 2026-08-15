export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  USERS: {
    ALL: '/users',
    BY_ID: (userId) => `/users/${userId}`,
    ME: '/users/me',
    INVITE: '/users/invite'
  },
  PROJECTS: {
    ALL: '/projects',
    BY_ID: (projectId) => `/projects/${projectId}`,
    MANAGERS: (projectId) => `/projects/${projectId}/managers`,
    REMOVE_MANAGER: (projectId, userId) =>
      `/projects/${projectId}/managers/${userId}`,
    TASKS: (projectId) => `/projects/${projectId}/tasks`,
    /** Legacy boilerplate list endpoint */
    BOILERPLATE_LIST: '/projects/list'
  },
  TASKS: {
    ALL: '/tasks',
    ME: '/tasks/me',
    BY_ID: (taskId) => `/tasks/${taskId}`
  },
  ROLES: {
    ALL: '/roles',
    BY_ID: (roleId) => `/roles/${roleId}`,
    ASSIGN: '/roles/assign',
    REVOKE: '/roles/revoke'
  },
  LOCATIONS: {
    ALL: '/locations',
    ME: '/locations/me',
    BY_ID: (id) => `/locations/${id}`,
    USERS: (id) => `/locations/${id}/users`,
    REMOVE_USER: (id, userId) => `/locations/${id}/users/${userId}`
  },
  DEPARTMENTS: {
    ALL: '/departments',
    BY_ID: (id) => `/departments/${id}`
  },
  STORES: {
    ALL: '/stores',
    BY_ID: (id) => `/stores/${id}`,
    PROVISION: (locationId) => `/stores/provision/${locationId}`
  },
  UOMS: {
    ALL: '/uoms',
    BY_ID: (id) => `/uoms/${id}`
  },
  UOM_CONVERSIONS: {
    ALL: '/uom-conversions',
    BY_ID: (id) => `/uom-conversions/${id}`,
    CONVERT: '/uom-conversions/convert'
  },
  ITEM_CATEGORIES: {
    ALL: '/item-categories',
    BY_ID: (id) => `/item-categories/${id}`
  },
  ITEMS: {
    ALL: '/items',
    BY_ID: (id) => `/items/${id}`,
    BY_CODE: (code) => `/items/by-code/${code}`,
    VARIANTS: (id) => `/items/${id}/variants`,
    GENERATE_VARIANTS: (id) => `/items/${id}/variants/generate`
  },
  ATTRIBUTES: {
    ALL: '/attributes',
    BY_ID: (id) => `/attributes/${id}`,
    OPTIONS: (id) => `/attributes/${id}/options`,
    OPTION: (id, optionId) => `/attributes/${id}/options/${optionId}`,
    VALIDATE: (id) => `/attributes/${id}/validate`
  },
  ATTRIBUTE_GROUPS: {
    ALL: '/attribute-groups',
    BY_ID: (id) => `/attribute-groups/${id}`
  },
  ATTRIBUTE_SETS: {
    ALL: '/attribute-sets',
    BY_ID: (id) => `/attribute-sets/${id}`,
    ATTRIBUTES: (id) => `/attribute-sets/${id}/attributes`,
    ATTRIBUTE: (id, attributeId) =>
      `/attribute-sets/${id}/attributes/${attributeId}`
  },
  INVENTORY: {
    OPENING: '/inventory/opening',
    ADJUSTMENTS: '/inventory/adjustments',
    ON_HAND: '/inventory/on-hand',
    LEDGER: '/inventory/ledger',
    ITEM: (itemId) => `/inventory/items/${itemId}`,
    BATCHES: '/inventory/batches',
    INTEGRITY: '/inventory/integrity'
  },
  WORK_CENTERS: {
    ALL: '/work-centers',
    BY_ID: (id) => `/work-centers/${id}`
  },
  BOM_TEMPLATES: {
    ALL: '/bom-templates',
    BY_ID: (id) => `/bom-templates/${id}`,
    LINES: (id) => `/bom-templates/${id}/lines`,
    LINE: (id, lineId) => `/bom-templates/${id}/lines/${lineId}`
  },
  BOMS: {
    ALL: '/boms',
    BY_ID: (id) => `/boms/${id}`,
    LINES: (id) => `/boms/${id}/lines`,
    LINE: (id, lineId) => `/boms/${id}/lines/${lineId}`
  },
  WORK_ORDERS: {
    ALL: '/work-orders',
    BY_ID: (id) => `/work-orders/${id}`,
    RELEASE: (id) => `/work-orders/${id}/release`,
    START: (id) => `/work-orders/${id}/start`,
    COMPLETE: (id) => `/work-orders/${id}/complete`
  },
  GATE_PASSES: {
    ALL: '/gate-passes',
    BY_ID: (id) => `/gate-passes/${id}`,
    LINES: (id) => `/gate-passes/${id}/lines`,
    LINE: (id, lineId) => `/gate-passes/${id}/lines/${lineId}`,
    ISSUE: (id) => `/gate-passes/${id}/issue`,
    CLOSE: (id) => `/gate-passes/${id}/close`
  },
  SUPPLIERS: {
    ALL: '/suppliers',
    BY_ID: (id) => `/suppliers/${id}`
  },
  PURCHASE_ORDERS: {
    ALL: '/purchase-orders',
    BY_ID: (id) => `/purchase-orders/${id}`,
    LINES: (id) => `/purchase-orders/${id}/lines`,
    LINE: (id, lineId) => `/purchase-orders/${id}/lines/${lineId}`
  },
  CUSTOMERS: {
    ALL: '/customers',
    BY_ID: (id) => `/customers/${id}`
  },
  SALES_ORDERS: {
    ALL: '/sales-orders',
    BY_ID: (id) => `/sales-orders/${id}`,
    LINES: (id) => `/sales-orders/${id}/lines`,
    LINE: (id, lineId) => `/sales-orders/${id}/lines/${lineId}`
  },
  POS: {
    SALES: '/pos/sales',
    SALE: (id) => `/pos/sales/${id}`,
    VOID: (id) => `/pos/sales/${id}/void`,
    RETURNS: '/pos/returns',
    RETURN: (id) => `/pos/returns/${id}`,
    RETURN_LINES: (id) => `/pos/returns/${id}/lines`,
    RETURN_LINE: (id, lineId) => `/pos/returns/${id}/lines/${lineId}`,
    RETURN_REFUND: (id) => `/pos/returns/${id}/refund`,
    OUTLETS: '/pos/outlets',
    CATALOG: '/pos/catalog'
  },
  MRNS: {
    ALL: '/warehouse/mrns',
    BY_ID: (id) => `/warehouse/mrns/${id}`,
    LINES: (id) => `/warehouse/mrns/${id}/lines`,
    LINE: (id, lineId) => `/warehouse/mrns/${id}/lines/${lineId}`
  },
  MINS: {
    ALL: '/warehouse/mins',
    BY_ID: (id) => `/warehouse/mins/${id}`,
    LINES: (id) => `/warehouse/mins/${id}/lines`,
    LINE: (id, lineId) => `/warehouse/mins/${id}/lines/${lineId}`
  },
  MATERIAL_TRANSFERS: {
    ALL: '/warehouse/transfers',
    BY_ID: (id) => `/warehouse/transfers/${id}`,
    LINES: (id) => `/warehouse/transfers/${id}/lines`,
    LINE: (id, lineId) => `/warehouse/transfers/${id}/lines/${lineId}`
  },
  MATERIAL_RETURNS: {
    ALL: '/warehouse/returns',
    BY_ID: (id) => `/warehouse/returns/${id}`,
    LINES: (id) => `/warehouse/returns/${id}/lines`,
    LINE: (id, lineId) => `/warehouse/returns/${id}/lines/${lineId}`
  }
};
