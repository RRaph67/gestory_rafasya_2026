/**
 * Generic useApi Hook
 * Reusable hook untuk API calls dengan loading dan error handling
 * 
 * Usage:
 * const { data, loading, error, refetch } = useApi(() => someService.fetchData());
 */

import { useState, useEffect, useCallback } from "react";
import type { UseApiResponse, ApiError } from "@/types";

export function useApi<T>(
  apiFunction: () => Promise<{ success: boolean; data?: T; error?: ApiError }>,
  dependencies: unknown[] = []
): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction();

      if (response.success && response.data) {
        setData(response.data);
        setError(null);
      } else if (response.error) {
        setError(response.error);
        setData(null);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error occurred";
      const isNetworkErr = msg.toLowerCase().includes("network") || msg.toLowerCase().includes("conn") || msg.toLowerCase().includes("timeout");
      setError({
        code: "CONNECTION_ERROR",
        message: isNetworkErr 
          ? "Gagal terhubung ke API/Database. Jika menggunakan database Supabase gratis, silakan periksa apakah database Anda sedang ditangguhkan (paused) di dashboard Supabase."
          : msg,
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    refetch();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

/**
 * Alternative: useApiWithPagination untuk endpoint dengan pagination
 */
export function useApiPaginated<T>(
  apiFunction: (page: number, limit: number) => Promise<any>,
  initialPage: number = 1,
  limit: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPage = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction(pageNum, limit);

      if (response.success) {
        setData(response.data?.data || []);
        setTotalPages(response.data?.totalPages || 1);
        setPage(pageNum);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      const isNetworkErr = msg.toLowerCase().includes("network") || msg.toLowerCase().includes("conn") || msg.toLowerCase().includes("timeout");
      setError({
        code: "CONNECTION_ERROR",
        message: isNetworkErr 
          ? "Gagal terhubung ke API/Database. Jika menggunakan database Supabase gratis, silakan periksa apakah database Anda sedang ditangguhkan (paused) di dashboard Supabase."
          : msg,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    goToPage: setPage,
    nextPage: () => setPage((p) => p + 1),
    prevPage: () => setPage((p) => Math.max(1, p - 1)),
  };
}
