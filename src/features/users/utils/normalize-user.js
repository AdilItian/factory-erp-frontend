export function getUserId(user) {
  return String(user?.id ?? user?.['_id'] ?? '');
}

export function getUserEmail(user) {
  return user?.email ?? '';
}

export function getUserDisplayName(user) {
  const fullName = [user?.firstName, user?.lastName, user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();

  return fullName || getUserEmail(user) || getUserId(user) || 'Unknown user';
}

export function getUserRoles(user) {
  const roles = user?.roles ?? user?.roleNames ?? user?.role_names ?? [];

  if (Array.isArray(roles)) {
    return roles
      .map((role) => {
        if (typeof role === 'string') return role;
        return role?.name ?? role?.label ?? String(role?.id ?? '');
      })
      .filter(Boolean);
  }

  if (typeof user?.role === 'string') return [user.role];

  return [];
}

/**
 * Returns a Set of role IDs currently on the user.
 * Falls back to matching role names when only names are present.
 */
export function getUserRoleIdSet(user, allRoles = []) {
  const ids = new Set();
  const roles = user?.roles ?? [];
  const explicitIds = user?.roleIds ?? user?.role_ids ?? [];

  if (Array.isArray(explicitIds)) {
    for (const id of explicitIds) {
      if (id) ids.add(String(id));
    }
  }

  if (Array.isArray(roles)) {
    for (const role of roles) {
      if (typeof role === 'string') {
        const match = allRoles.find(
          (r) =>
            String(r.name ?? r.label ?? '').toLowerCase() === role.toLowerCase()
        );
        if (match?.id ?? match?.['_id']) {
          ids.add(String(match.id ?? match['_id']));
        }
        continue;
      }

      const id = role?.id ?? role?.['_id'] ?? role?.roleId;
      if (id) ids.add(String(id));
    }
  }

  return ids;
}

export function isUserActive(user) {
  if (typeof user?.isActive === 'boolean') return user.isActive;
  if (typeof user?.is_active === 'boolean') return user.is_active;
  if (typeof user?.active === 'boolean') return user.active;
  if (user?.status === 'Active') return true;
  if (user?.status === 'Inactive') return false;
  return true;
}

export function formatUserDate(value) {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
