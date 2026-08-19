/**
 * Course Types
 * Contracts untuk course-related data dari backend
 */

export interface MaterialSection {
  type: "pdf" | "text" | "video" | "quiz";
  title: string;
  content?: string;
  url?: string;
}

export interface CourseDetail {
  id: string;
  title: string;
  breadcrumb: string;
  description: string;
  image: string;
  status?: string;
  sections: MaterialSection[];
  questions: QuizQuestion[];
}

export interface CourseListItem {
  id: string;
  title: string;
  description: string;
  image: string;
  status?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation: string;
}

export interface CourseListResponse {
  courses: CourseListItem[];
  total: number;
}

export interface CourseDetailResponse {
  course: CourseDetail;
}

/**
 * Extend dari existing interfaces di src/data/courses.ts
 * Sekarang sudah di-centralize di sini
 */
