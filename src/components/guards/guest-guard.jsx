'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getToken } from '@/lib/get-token';
import { PATHS } from '@/lib/pages-path';

function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function GuestGuard({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = getToken();
    if (token && isTokenValid(token)) {
      const redirect = searchParams.get('redirect') || PATHS.REDIRECT_AFTER_LOGIN;
      router.replace(redirect);
    }
  }, [router, searchParams]);

  const token = getToken();
  if (token && isTokenValid(token)) return null;

  return children;
}
