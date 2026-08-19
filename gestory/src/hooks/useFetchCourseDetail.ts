/**
 * useFetchCourseDetail Hook
 * Fetch detail course by ID dengan materials dan questions
 * 
 * Usage:
 * const { data: course, loading, error, refetch } = useFetchCourseDetail("bab-1");
 */

import { useEffect, useState } from "react";
import { courseService } from "@/services";
import type { CourseDetail, ApiError } from "@/types";

interface UseFetchCourseDetailResponse {
  data: CourseDetail | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useFetchCourseDetail(courseId: string): UseFetchCourseDetailResponse {
  const [data, setData] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await courseService.getCourseById(courseId);

      if (response.success && response.data) {
        setData(response.data.course);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError({
        code: "FETCH_ERROR",
        message: err instanceof Error ? err.message : "Failed to fetch course detail",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [courseId]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
