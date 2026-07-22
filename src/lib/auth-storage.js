import { ACCESS_TOKEN_KEY } from '@/lib/enum';

const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

export function saveAuthData(responseData) {
  const { userToken, ...user } = responseData;
  localStorage.setItem(ACCESS_TOKEN_KEY, userToken.sessionToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, userToken.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function clearAuthData() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
