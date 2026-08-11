function base64UrlDecode(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

  if (typeof window !== 'undefined') {
    return atob(padded);
  }

  return Buffer.from(padded, 'base64').toString('utf-8');
}

export function decodeJwtToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return null;
  }
}

export function getUserFromJwtToken(token) {
  const payload = decodeJwtToken(token);
  if (!payload) return null;

  const rolesRaw = payload.roles ?? payload.role ?? null;
  const roles = Array.isArray(rolesRaw)
    ? rolesRaw
    : typeof rolesRaw === 'string'
      ? rolesRaw.split(/[,\s]+/).filter(Boolean)
      : rolesRaw
        ? [rolesRaw]
        : [];

  return {
    id: payload.sub ?? payload.id ?? payload.userId ?? null,
    email: payload.email ?? null,
    name: payload.name ?? payload.fullName ?? payload.username ?? null,
    roles,
    exp: payload.exp ?? null,
    iat: payload.iat ?? null
  };
}

export function isJwtExpired(token) {
  const payload = decodeJwtToken(token);
  if (!payload?.exp) return false;

  return Date.now() >= payload.exp * 1000;
}
