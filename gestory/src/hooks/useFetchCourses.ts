/**
 * useFetchCourses Hook
 * Fetch list semua courses untuk dashboard
 * 
 * Usage:
 * const { data: courses, loading, error, refetch } = useFetchCourses();
 */

import { useEffect, useState } from "react";
import { courseService } from "@/services";
import type { CourseListItem, ApiError } from "@/types";

interface UseFetchCoursesResponse {
  data: CourseListItem[] | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useFetchCourses(): UseFetchCoursesResponse {
  const [data, setData] = useState<CourseListItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await courseService.getCourses();

      if (response.success && response.data) {
        setData(response.data.courses);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError({
        code: "FETCH_ERROR",
        message: err instanceof Error ? err.message : "Failed to fetch courses",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
