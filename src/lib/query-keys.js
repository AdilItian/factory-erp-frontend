export const projectKeys = {
  all: ['projects'],
  lists: () => [...projectKeys.all, 'list'],
  list: (filters) => [...projectKeys.lists(), filters],
  detail: (id) => [...projectKeys.all, 'detail', id]
};

export const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
  list: (filters) => [...taskKeys.lists(), filters],
  project: (projectId, filters) => [
    ...taskKeys.all,
    'project',
    projectId,
    filters
  ],
  mine: (filters) => [...taskKeys.all, 'me', filters],
  detail: (id) => [...taskKeys.all, 'detail', id]
};

export const authKeys = {
  all: ['auth']
};

export const roleKeys = {
  all: ['roles'],
  lists: () => [...roleKeys.all, 'list'],
  list: () => [...roleKeys.lists()]
};

export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), filters],
  options: () => [...userKeys.all, 'options']
};

export const locationKeys = {
  all: ['locations'],
  lists: () => [...locationKeys.all, 'list'],
  list: (filters) => [...locationKeys.lists(), filters],
  options: () => [...locationKeys.all, 'options'],
  detail: (id) => [...locationKeys.all, 'detail', id],
  users: (id) => [...locationKeys.all, 'users', id],
  mine: () => [...locationKeys.all, 'me']
};

export const departmentKeys = {
  all: ['departments'],
  lists: () => [...departmentKeys.all, 'list'],
  list: (filters) => [...departmentKeys.lists(), filters]
};

export const storeKeys = {
  all: ['stores'],
  lists: () => [...storeKeys.all, 'list'],
  list: (filters) => [...storeKeys.lists(), filters],
  options: () => [...storeKeys.all, 'options']
};

export const uomKeys = {
  all: ['uoms'],
  lists: () => [...uomKeys.all, 'list'],
  list: (filters) => [...uomKeys.lists(), filters],
  options: () => [...uomKeys.all, 'options']
};

export const uomConversionKeys = {
  all: ['uom-conversions'],
  lists: () => [...uomConversionKeys.all, 'list'],
  list: () => [...uomConversionKeys.lists()]
};

export const itemCategoryKeys = {
  all: ['item-categories'],
  lists: () => [...itemCategoryKeys.all, 'list'],
  list: (filters) => [...itemCategoryKeys.lists(), filters]
};

export const itemKeys = {
  all: ['items'],
  lists: () => [...itemKeys.all, 'list'],
  list: (filters) => [...itemKeys.lists(), filters],
  options: () => [...itemKeys.all, 'options'],
  detail: (id) => [...itemKeys.all, 'detail', id],
  variants: (id) => [...itemKeys.all, 'variants', id]
};

export const attributeKeys = {
  all: ['attributes'],
  lists: () => [...attributeKeys.all, 'list'],
  list: (filters) => [...attributeKeys.lists(), filters],
  options: () => [...attributeKeys.all, 'options'],
  detail: (id) => [...attributeKeys.all, 'detail', id]
};

export const attributeGroupKeys = {
  all: ['attribute-groups'],
  lists: () => [...attributeGroupKeys.all, 'list'],
  list: (filters) => [...attributeGroupKeys.lists(), filters]
};

export const attributeSetKeys = {
  all: ['attribute-sets'],
  lists: () => [...attributeSetKeys.all, 'list'],
  list: (filters) => [...attributeSetKeys.lists(), filters],
  detail: (id) => [...attributeSetKeys.all, 'detail', id]
};

export const inventoryKeys = {
  all: ['inventory'],
  onHand: (filters) => [...inventoryKeys.all, 'on-hand', filters],
  ledger: (filters) => [...inventoryKeys.all, 'ledger', filters],
  item: (itemId, filters) => [...inventoryKeys.all, 'item', itemId, filters],
  batches: (itemId) => [...inventoryKeys.all, 'batches', itemId]
};

export const workCenterKeys = {
  all: ['work-centers'],
  lists: () => [...workCenterKeys.all, 'list'],
  list: (filters) => [...workCenterKeys.lists(), filters],
  options: () => [...workCenterKeys.all, 'options']
};

export const bomTemplateKeys = {
  all: ['bom-templates'],
  lists: () => [...bomTemplateKeys.all, 'list'],
  list: (filters) => [...bomTemplateKeys.lists(), filters],
  options: () => [...bomTemplateKeys.all, 'options'],
  detail: (id) => [...bomTemplateKeys.all, 'detail', id]
};

export const bomKeys = {
  all: ['boms'],
  lists: () => [...bomKeys.all, 'list'],
  list: (filters) => [...bomKeys.lists(), filters],
  options: () => [...bomKeys.all, 'options'],
  detail: (id) => [...bomKeys.all, 'detail', id]
};

export const workOrderKeys = {
  all: ['work-orders'],
  lists: () => [...workOrderKeys.all, 'list'],
  list: (filters) => [...workOrderKeys.lists(), filters],
  detail: (id) => [...workOrderKeys.all, 'detail', id]
};

export const gatePassKeys = {
  all: ['gate-passes'],
  lists: () => [...gatePassKeys.all, 'list'],
  list: (filters) => [...gatePassKeys.lists(), filters],
  detail: (id) => [...gatePassKeys.all, 'detail', id]
};

export const supplierKeys = {
  all: ['suppliers'],
  lists: () => [...supplierKeys.all, 'list'],
  list: (filters) => [...supplierKeys.lists(), filters],
  options: () => [...supplierKeys.all, 'options']
};

export const purchaseOrderKeys = {
  all: ['purchase-orders'],
  lists: () => [...purchaseOrderKeys.all, 'list'],
  list: (filters) => [...purchaseOrderKeys.lists(), filters],
  detail: (id) => [...purchaseOrderKeys.all, 'detail', id]
};

export const customerKeys = {
  all: ['customers'],
  lists: () => [...customerKeys.all, 'list'],
  list: (filters) => [...customerKeys.lists(), filters],
  options: () => [...customerKeys.all, 'options']
};

export const salesOrderKeys = {
  all: ['sales-orders'],
  lists: () => [...salesOrderKeys.all, 'list'],
  list: (filters) => [...salesOrderKeys.lists(), filters],
  detail: (id) => [...salesOrderKeys.all, 'detail', id]
};

export const posKeys = {
  all: ['pos'],
  lists: () => [...posKeys.all, 'list'],
  list: (filters) => [...posKeys.lists(), filters],
  detail: (id) => [...posKeys.all, 'detail', id],
  outlets: () => [...posKeys.all, 'outlets'],
  catalog: () => [...posKeys.all, 'catalog'],
  returns: () => [...posKeys.all, 'returns'],
  returnList: (filters) => [...posKeys.returns(), 'list', filters],
  returnDetail: (id) => [...posKeys.returns(), 'detail', id]
};

export const warehouseDocKeys = {
  all: (type) => ['warehouse-docs', type],
  lists: (type) => [...warehouseDocKeys.all(type), 'list'],
  list: (type, filters) => [...warehouseDocKeys.lists(type), filters],
  detail: (type, id) => [...warehouseDocKeys.all(type), 'detail', id]
};
