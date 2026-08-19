/**
 * useGameQuestions Hook
 * Fetch game questions untuk play page
 * 
 * Usage:
 * const { data: questions, loading, error, refetch } = useGameQuestions();
 */

import { useEffect, useState } from "react";
import { gameService } from "@/services";
import type { GameQuestion, ApiError } from "@/types";

interface UseGameQuestionsResponse {
  data: GameQuestion[] | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useGameQuestions(): UseGameQuestionsResponse {
  const [data, setData] = useState<GameQuestion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await gameService.getGameQuestions();

      if (response.success && response.data) {
        setData(response.data.questions);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError({
        code: "FETCH_ERROR",
        message: err instanceof Error ? err.message : "Failed to fetch game questions",
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
