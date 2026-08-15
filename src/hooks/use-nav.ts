'use client';

import { useMemo } from 'react';
import type { NavGroup, NavItem } from '@/types';

export function useFilteredNavItems(items?: NavItem[] | null): NavItem[] {
  return items ?? [];
}

export function useFilteredNavGroups(groups?: NavGroup[] | null): NavGroup[] {
  return useMemo(
    () => (groups ?? []).filter((group) => (group.items?.length ?? 0) > 0),
    [groups]
  );
}
