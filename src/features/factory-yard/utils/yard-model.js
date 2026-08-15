import {
  getEntityId,
  getEntityName,
  getEntityCode,
  getEntityType,
  isEntityActive,
  refId
} from '@/lib/entity';

export const MARSHALLING_ID = '__marshalling__';

export const YARD_TYPES = [
  { value: 'ALL', label: 'Whole works' },
  { value: 'FACTORY', label: 'Mills' },
  { value: 'WAREHOUSE', label: 'Sheds' },
  { value: 'OUTLET', label: 'Shops' },
  { value: 'HEAD_OFFICE', label: 'Offices' },
  { value: 'MARSHALLING', label: 'Apron' }
];

export function plotCode(index) {
  const col = index % 3;
  const row = Math.floor(index / 3);
  return `${String.fromCharCode(65 + row)}${col + 1}`;
}

export function locationKey(entity) {
  return refId(entity?.locationId) || refId(entity?.location) || refId(entity?.location_id);
}

export function stockQty(row) {
  const value = Number(
    row?.quantityOnHand ?? row?.quantity ?? row?.qty ?? row?.onHand ?? row?.availableQty ?? 0
  );
  return Number.isFinite(value) ? value : 0;
}

function pushUnique(list, item) {
  const id = getEntityId(item);
  if (!id || list.some((entry) => getEntityId(entry) === id)) return;
  list.push(item);
}

function addKey(keys, value) {
  const id = refId(value);
  if (id) keys.add(id);
}

export function locationLookupKeys(entity) {
  const keys = new Set();
  addKey(keys, entity?.locationId);
  addKey(keys, entity?.location);
  addKey(keys, entity?.location_id);
  addKey(keys, entity?.siteId);
  addKey(keys, entity?.site);

  const location = entity?.location && typeof entity.location === 'object' ? entity.location : null;
  if (location?.code) keys.add(`code:${String(location.code).toUpperCase()}`);
  if (entity?.locationCode) keys.add(`code:${String(entity.locationCode).toUpperCase()}`);
  const name = location?.name || entity?.locationName;
  if (name) keys.add(`name:${String(name).trim().toLowerCase()}`);
  return [...keys];
}

export function plotLookupKeys(location) {
  const keys = new Set();
  addKey(keys, location);
  if (location?.code) keys.add(`code:${String(location.code).toUpperCase()}`);
  if (location?.name) keys.add(`name:${String(location.name).trim().toLowerCase()}`);
  return [...keys];
}

function gather(index, keys) {
  const list = [];
  for (const key of keys) {
    for (const item of index.get(key) ?? []) pushUnique(list, item);
  }
  return list;
}

function indexByLocation(entities) {
  const index = new Map();
  for (const entity of entities) {
    for (const key of locationLookupKeys(entity)) {
      const list = index.get(key) ?? [];
      pushUnique(list, entity);
      index.set(key, list);
    }
  }
  return index;
}

function linesForStore(onHand, storeId) {
  return onHand.filter((row) => (refId(row?.storeId) || refId(row?.store)) === storeId);
}

function toBays(stores, onHand) {
  return stores.map((store) => {
    const id = getEntityId(store);
    const lines = linesForStore(onHand, id);
    return {
      id,
      store,
      stock: lines.reduce((sum, row) => sum + stockQty(row), 0),
      lines
    };
  });
}

function makePlot({
  location,
  index,
  type,
  name,
  code,
  city,
  active,
  stores,
  departments,
  onHand,
  synthetic = false
}) {
  const bays = toBays(stores, onHand);
  const stock = bays.reduce((sum, bay) => sum + bay.stock, 0);
  return {
    id: location ? getEntityId(location) : MARSHALLING_ID,
    location,
    plot: plotCode(index),
    type,
    name,
    code,
    city,
    active,
    synthetic,
    stores,
    bays,
    departments,
    stock
  };
}

export function buildYardWorld(locations = [], stores = [], departments = [], onHand = []) {
  const storeIndex = indexByLocation(stores);
  const deptIndex = indexByLocation(departments);
  const assignedIds = new Set();

  const plots = locations.map((location, index) => {
    const siteStores = gather(storeIndex, plotLookupKeys(location));
    for (const store of siteStores) assignedIds.add(getEntityId(store));

    return makePlot({
      location,
      index,
      type: getEntityType(location) || 'FACTORY',
      name: getEntityName(location),
      code: getEntityCode(location),
      city: location.city || location.addressLine || '',
      active: isEntityActive(location),
      stores: siteStores,
      departments: gather(deptIndex, plotLookupKeys(location)),
      onHand
    });
  });

  const unassigned = stores.filter((store) => !assignedIds.has(getEntityId(store)));
  if (unassigned.length > 0) {
    plots.push(
      makePlot({
        location: null,
        index: plots.length,
        type: 'MARSHALLING',
        name: 'Marshalling apron',
        code: 'YARD',
        city: 'Bays not yet tied to a mill',
        active: true,
        synthetic: true,
        stores: unassigned,
        departments: [],
        onHand
      })
    );
  }

  const maxStock = Math.max(0, ...plots.map((plot) => plot.stock));

  return {
    plots: plots.map((plot) => ({
      ...plot,
      heat: maxStock > 0 ? plot.stock / maxStock : 0
    })),
    storeCount: stores.length,
    assignedCount: assignedIds.size,
    unassignedCount: unassigned.length
  };
}

export function buildYardPlots(locations, stores, departments, onHand) {
  return buildYardWorld(locations, stores, departments, onHand).plots;
}

export function plotPosition(index, cols = 3) {
  const col = index % cols;
  const row = Math.floor(index / cols);
  return { x: 70 + col * 270, y: 90 + row * 230 };
}

export function siteRows(plots, cols = 3) {
  const rows = [];
  for (let index = 0; index < plots.length; index += cols) {
    const row = plots.slice(index, index + cols);
    while (row.length < cols) row.push(null);
    rows.push(row);
  }
  return rows;
}
