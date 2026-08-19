/**
 * Quiz & Game Types
 * Contracts untuk quiz dan game logic
 */

import type { QuizQuestion } from "./course";

export interface QuizSession {
  id: string;
  courseId: string;
  userId?: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  answers: QuizAnswer[];
  startedAt: Date;
  completedAt?: Date;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeTaken: number; // in seconds
}

export interface QuizSubmission {
  sessionId: string;
  answers: QuizAnswer[];
  finalScore: number;
  totalQuestions: number;
  duration: number; // in seconds
}

export interface GameQuestion {
  id: string;
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface GameSession {
  id: string;
  userId?: string;
  questions: GameQuestion[];
  currentQuestionIndex: number;
  score: number;
  lives: number;
  startedAt: Date;
  completedAt?: Date;
}

export interface GameScore {
  sessionId: string;
  finalScore: number;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number; // percentage
  timeSpent: number; // in seconds
  completedAt: Date;
}

export interface QuizQuestionsResponse {
  questions: GameQuestion[];
  total: number;
}
