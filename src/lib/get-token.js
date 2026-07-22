import { ACCESS_TOKEN_KEY } from './enum';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}
