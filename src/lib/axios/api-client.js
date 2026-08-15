"use client";

import axios from "axios";
import variables from "@/lib/variables";
import { getAccessToken } from "@/lib/auth-storage";

const apiClient = axios.create({
  baseURL: variables.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (!path.startsWith("/auth/")) {
        const redirect = encodeURIComponent(
          path + window.location.search,
        );
        window.location.href = `/auth/sign-in?redirect=${redirect}`;
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
