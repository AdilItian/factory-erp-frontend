"use client";

import axios from "axios";
import variables from "@/lib/variables";
import { getAccessToken } from "@/lib/auth-storage";

const boilerplateClient = axios.create({
  baseURL: `${variables.BOILER_PLATE_BACKEND_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

boilerplateClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

boilerplateClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const redirect = encodeURIComponent(
        window.location.pathname + window.location.search,
      );
      window.location.href = `/auth/sign-in?redirect=${redirect}`;
    }
    return Promise.reject(error);
  },
);

export default boilerplateClient;
