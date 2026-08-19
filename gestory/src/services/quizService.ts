/**
 * Quiz Service
 * Real backend via apiClient.
 */

import { apiClient } from "./api";
import type {
  ApiResponse,
  QuizQuestionsResponse,
  QuizQuestion,
  QuizSubmission,
  QuizSession,
} from "@/types";

/**
 * GET /api/v1/quiz/:slug/questions
 */
export async function getQuizQuestions(courseId: string): Promise<ApiResponse<QuizQuestionsResponse>> {
  return apiClient.get(`/api/v1/quiz/${courseId}/questions`);
}

/**
 * POST /api/v1/quiz/submit
 */
export async function submitQuiz(submissionData: {
  courseId: string;
  answers: { questionId: string; selectedAnswer: string }[];
}): Promise<
  ApiResponse<{
    score: number;
    total: number;
    percentage: number;
    results: Array<{ questionId: string; isCorrect: boolean }>;
  }>
> {
  return apiClient.post(`/api/v1/quiz/submit`, submissionData);
}

export const quizService = {
  getQuizQuestions,
  submitQuiz,
};

