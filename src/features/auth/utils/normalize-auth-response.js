import { getUserFromJwtToken } from './decode-jwt';

export function normalizeAuthResponse(data) {
  if (!data) {
    return { success: false, message: 'Login failed' };
  }

  const payload = data.data ?? data;
  const token =
    payload?.accessToken ??
    payload?.access_token ??
    payload?.token ??
    data.accessToken ??
    data.access_token ??
    data.token;
  const rawUser = payload?.user ?? data.user ?? {};
  const refreshToken =
    payload?.refreshToken ??
    payload?.refresh_token ??
    data.refreshToken ??
    data.refresh_token;

  if (token) {
    const tokenUser = getUserFromJwtToken(token);
    const user = {
      ...rawUser,
      id:
        rawUser?.id ??
        rawUser?.['_id'] ??
        rawUser?.userId ??
        tokenUser?.id ??
        null,
      roles: rawUser?.roles ?? rawUser?.role ?? tokenUser?.roles ?? []
    };

    return {
      success: true,
      auth: {
        token,
        user,
        refreshToken
      },
      message: data.description ?? data.message ?? null
    };
  }

  return {
    success: false,
    message: data.description ?? data.message ?? 'Login failed'
  };
}

export function getAuthErrorMessage(error, fallback = 'Login failed') {
  return (
    error?.response?.data?.description ??
    error?.response?.data?.message ??
    fallback
  );
}
