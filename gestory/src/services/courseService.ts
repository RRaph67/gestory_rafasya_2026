/**
 * Course Service
 * Handle semua API calls untuk course-related endpoints
 */

import { apiClient } from "./api";
import type {
  CourseDetail,
  CourseDetailResponse,
  CourseListResponse,
  MaterialSection,
  QuizQuestion,
  ApiResponse,
} from "@/types";

/**
 * GET /api/v1/courses
 * Fetch list semua courses untuk dashboard
 */
export async function getCourses(): Promise<ApiResponse<CourseListResponse>> {
  return apiClient.get("/api/v1/courses") as ApiResponse<CourseListResponse>;
}

/**
 * GET /api/v1/courses/:slug
 * Fetch detail course by slug dengan materials dan questions
 */
export async function getCourseById(courseIdOrSlug: string): Promise<ApiResponse<CourseDetailResponse>> {
  return apiClient.get(`/api/v1/courses/${courseIdOrSlug}`) as ApiResponse<CourseDetailResponse>;
}

/**
 * GET /api/v1/courses/:slug/materials
 */
export async function getCourseMaterials(courseIdOrSlug: string): Promise<ApiResponse<MaterialSection[]>> {
  return apiClient.get(`/api/v1/courses/${courseIdOrSlug}/materials`) as ApiResponse<MaterialSection[]>;
}

/**
 * GET /api/v1/courses/:slug/questions
 */
export async function getCourseQuestions(courseIdOrSlug: string): Promise<ApiResponse<QuizQuestion[]>> {
  return apiClient.get(`/api/v1/courses/${courseIdOrSlug}/questions`) as ApiResponse<QuizQuestion[]>;
}

/**
 * POST /api/v1/courses
 * Create new course (admin only) - placeholder
 */
export async function createCourse(courseData: Partial<CourseDetail>): Promise<ApiResponse<CourseDetail>> {
  return apiClient.post("/api/v1/courses", courseData) as ApiResponse<CourseDetail>;
}

export const courseService = {
  getCourses,
  getCourseById,
  getCourseMaterials,
  getCourseQuestions,
  createCourse,
};

