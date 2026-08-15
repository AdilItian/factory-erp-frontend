import { pageLimit } from '@/lib/normalize-list';

function wait(ms = 80) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function matchesSearch(row, search) {
  if (!search) return true;
  return JSON.stringify(row).toLowerCase().includes(search);
}

export function createMemoryCollection(seed = []) {
  let rows = seed.map((row) => ({ ...row }));

  return {
    async list(params = {}) {
      await wait();
      const search = String(params.search ?? '').trim().toLowerCase();
      let items = rows.filter((row) => matchesSearch(row, search));

      if (params.status) {
        items = items.filter((row) => row.status === params.status);
      }
      if (params.type) {
        items = items.filter((row) => row.type === params.type);
      }

      const total = items.length;
      const limit = pageLimit(params.limit);
      const page = Number(params.page ?? 1);
      const start = (page - 1) * limit;

      return {
        items: items.slice(start, start + limit),
        total,
        page,
        limit
      };
    },

    async getAll() {
      await wait();
      return rows.map((row) => ({ ...row }));
    },

    async get(id) {
      await wait();
      const row = rows.find((item) => String(item.id) === String(id));
      return row ? { ...row } : null;
    },

    async create(payload) {
      await wait();
      const now = new Date().toISOString();
      const row = {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        ...payload
      };
      rows = [row, ...rows];
      return { ...row };
    },

    async update(id, payload) {
      await wait();
      const now = new Date().toISOString();
      rows = rows.map((row) =>
        String(row.id) === String(id)
          ? { ...row, ...payload, id: row.id, updatedAt: now }
          : row
      );
      const row = rows.find((item) => String(item.id) === String(id));
      return row ? { ...row } : null;
    },

    async remove(id) {
      await wait();
      const row = rows.find((item) => String(item.id) === String(id));
      rows = rows.filter((item) => String(item.id) !== String(id));
      return row ? { ...row } : null;
    }
  };
}
