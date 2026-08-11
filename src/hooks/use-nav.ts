'use client';

export function useFilteredNavItems(items) {
  return items ?? [];
}

export function useFilteredNavGroups(groups) {
  return (groups ?? []).filter((group) => (group.items?.length ?? 0) > 0);
}
