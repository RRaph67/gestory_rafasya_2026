/**
 * API Client
 * Real backend via axios.
 */

import axios from "axios";

// In this codebase, axios types are intentionally loosened via legacy typings.
// We keep apiClient as `any` to avoid TS compile errors from axios interop.

export const API_CONFIG = {

  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  TIMEOUT: 10000,
};

// existing services/hooks assume apiClient.get/post returns backend JSON body,
// which already matches ApiResponse<T> shape: { success, data, message, timestamp, ... }
export const apiClient: any = (axios as any).create({


  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: any) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: any) => response.data,
  (error: any) => Promise.reject(error)
);

