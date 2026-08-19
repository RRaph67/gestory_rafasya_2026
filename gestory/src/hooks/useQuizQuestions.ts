/**
 * useQuizQuestions Hook
 * Fetch quiz questions untuk course specific
 * 
 * Usage:
 * const { data: questions, loading, error, refetch } = useQuizQuestions("bab-1");
 */

import { useEffect, useState } from "react";
import { quizService } from "@/services";
import type { QuizQuestion, ApiError } from "@/types";

interface UseQuizQuestionsResponse {
  data: QuizQuestion[] | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useQuizQuestions(courseId: string): UseQuizQuestionsResponse {
  const [data, setData] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await quizService.getQuizQuestions(courseId);

      if (response.success && response.data) {
        setData(response.data.questions as QuizQuestion[]);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError({
        code: "FETCH_ERROR",
        message: err instanceof Error ? err.message : "Failed to fetch quiz questions",
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
