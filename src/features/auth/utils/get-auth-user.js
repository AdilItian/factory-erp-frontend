import { getAccessToken, getUser } from '@/lib/auth-storage';
import { getUserFromJwtToken } from './decode-jwt';

function toRoleList(roles) {
  if (!roles) return [];
  if (Array.isArray(roles)) return roles.filter(Boolean);
  if (typeof roles === 'string') {
    return roles
      .split(/[,\s]+/)
      .map((role) => role.trim())
      .filter(Boolean);
  }
  return [roles];
}

function normalizeRoles(storedUser, tokenUser) {
  const merged = [
    ...toRoleList(storedUser?.roles ?? storedUser?.role),
    ...toRoleList(tokenUser?.roles)
  ];

  const seen = new Set();
  return merged.filter((role) => {
    const key =
      typeof role === 'string'
        ? role
        : String(role?.id ?? role?.name ?? role?.label ?? JSON.stringify(role));
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getAuthUser() {
  const storedUser = getUser();
  const tokenUser = getUserFromJwtToken(getAccessToken());

  const email =
    storedUser?.email ??
    storedUser?.emailAddress ??
    tokenUser?.email ??
    '';

  const name =
    storedUser?.fullName ??
    storedUser?.name ??
    storedUser?.username ??
    tokenUser?.name ??
    '';

  const id = String(
    storedUser?.id ??
      storedUser?.['_id'] ??
      storedUser?.userId ??
      tokenUser?.id ??
      ''
  );

  return {
    id: id || null,
    email,
    name,
    roles: normalizeRoles(storedUser, tokenUser),
    imageUrl:
      storedUser?.imageUrl ??
      storedUser?.avatar ??
      storedUser?.profilePicture ??
      ''
  };
}
