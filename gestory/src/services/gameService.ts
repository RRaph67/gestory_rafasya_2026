/**
 * Game Service
 * Real backend via apiClient.
 */

import { apiClient } from "./api";
import type { ApiResponse, GameScore, QuizQuestionsResponse } from "@/types";

// Backend has: GET /api/v1/game/questions -> returns QuizQuestionsResponse shape
export async function getGameQuestions(): Promise<ApiResponse<QuizQuestionsResponse>> {
  return apiClient.get(`/api/v1/game/questions`);
}

export async function submitGameScore(scoreData: {
  playerName: string;
  finalScore: number;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  timeSpent: number;
}): Promise<ApiResponse<GameScore>> {
  return apiClient.post(`/api/v1/game/submit`, scoreData);
}

export async function getGameLeaderboard(
  limit: number = 10
): Promise<ApiResponse<Array<{ rank: number; score: number; playerName: string; date: string }>>> {
  return apiClient.get(`/api/v1/game/leaderboard?limit=${limit}`);
}

export const gameService = {
  getGameQuestions,
  submitGameScore,
  getGameLeaderboard,
};

