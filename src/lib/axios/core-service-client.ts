'use client';

import axios from 'axios';
import variables from '@/lib/variables';
import { getToken } from '@/lib/get-token';
const coreServiceClient = axios.create({
  baseURL: variables.CORE_SERVICE_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor — attach auth token when available
coreServiceClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — redirect to sign-in on 401
coreServiceClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const redirect = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/auth/sign-in?redirect=${redirect}`;
    }
    return Promise.reject(error);
  }
);

export default coreServiceClient;
