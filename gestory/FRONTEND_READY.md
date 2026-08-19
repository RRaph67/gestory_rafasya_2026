# 🚀 Frontend Ready - Data Contract Implementation

**Status**: ✅ Complete & Running  
**Dev Server**: http://localhost:3000  
**Implementation Date**: June 7, 2026

---

## 📋 Overview

Saya telah membuat **complete data contract infrastructure** agar UI sudah siap menerima data dari backend manapun (mock atau real). Project sekarang sudah **decoupled dari static data** dan siap untuk backend integration.

### 🎯 Tujuan Dicapai
- ✅ **Types**: Centralized interfaces untuk semua data structures
- ✅ **Services**: Mock API layer dengan fallback logic
- ✅ **Hooks**: Custom React hooks untuk data fetching
- ✅ **Pages Integration**: Dashboard, Course Detail, Game sudah pakai hooks
- ✅ **Error Handling**: Loading & error states di semua pages
- ✅ **Ready for Backend**: Tinggal ganti BASE_URL & add real API calls

---

## 📁 Folder Structure

```
src/
├── types/                    ← TypeScript Interfaces (Data Contracts)
│   ├── api.ts               ← ApiResponse, ApiError, ApiStatus
│   ├── course.ts            ← Course, CourseDetail, MaterialSection
│   ├── quiz.ts              ← Quiz, GameQuestion, GameScore
│   └── index.ts             ← Barrel export
│
├── services/                ← API Client & Service Layer
│   ├── api.ts               ← MockApiClient setup (easy switch to real axios)
│   ├── courseService.ts     ← getCourses(), getCourseById(), getCourseMaterials()
│   ├── gameService.ts       ← getGameQuestions(), submitGameScore()
│   ├── quizService.ts       ← getQuizQuestions(), submitQuiz()
│   └── index.ts             ← Barrel export
│
├── hooks/                   ← Custom React Hooks
│   ├── useApi.ts            ← Generic hook untuk any API call
│   ├── useFetchCourses.ts   ← Fetch semua courses
│   ├── useFetchCourseDetail.tsx ← Fetch single course with ID
│   ├── useGameQuestions.ts  ← Fetch game questions
│   ├── useQuizQuestions.ts  ← Fetch quiz questions per course
│   └── index.ts             ← Barrel export
│
└── app/
    ├── page.tsx             ← Landing (no hooks needed)
    ├── dashboard/
    │   └── page.tsx         ← ✅ Using useFetchCourses()
    ├── course/[id]/
    │   └── page.tsx         ← ✅ Using useFetchCourseDetail()
    └── play/
        └── GameClient.tsx   ← ✅ Using useGameQuestions()
```

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     PAGES / COMPONENTS                   │
│  (dashboard/page.tsx, course/[id]/page.tsx, GameClient) │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              CUSTOM HOOKS (useFetch*)                    │
│  (useFetchCourses, useFetchCourseDetail, useGameQuestions)
│  - Handle loading, error, refetch logic                  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│          SERVICE LAYER (courseService, gameService)     │
│  - API calls abstraction                                 │
│  - Mock data formatting                                  │
│  - Error handling                                        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│          API CLIENT (MockApiClient / Axios)             │
│  - HTTP requests                                         │
│  - Auth interceptors (ready for future)                  │
│  - Response handling                                     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│         DATA SOURCES (Mock atau Backend Real)           │
│  - src/data/courses.ts (current mock)                   │
│  - API Backend: http://localhost:8000 (future)          │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Types Directory (`src/types/`)

### 1. **api.ts** - Generic Response Types
```typescript
// Status enum untuk loading states
enum ApiStatus { IDLE, LOADING, SUCCESS, ERROR }

// Standard response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

// Hook response type
interface UseApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}
```

**Digunakan di**: Semua hooks dan services

---

### 2. **course.ts** - Course-Related Types
```typescript
interface CourseListItem {
  id: string;
  title: string;
  description: string;
  image: string;
  status?: string;
}

interface CourseDetail extends CourseListItem {
  breadcrumb: string;
  sections: MaterialSection[];
  questions: QuizQuestion[];
}

interface MaterialSection {
  type: "pdf" | "text" | "video" | "quiz";
  title: string;
  content?: string;
  url?: string;
}
```

**Digunakan di**: Dashboard, Course Detail, Services

---

### 3. **quiz.ts** - Quiz & Game Types
```typescript
interface GameQuestion {
  id: number;
  question: string;
  options: { A: string; B: string };
  correctAnswer: string;
  explanation: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
}

interface GameScore {
  sessionId: string;
  finalScore: number;
  correctAnswers: number;
  accuracy: number;
  timeSpent: number;
}
```

**Digunakan di**: Game, Quiz components, Services

---

## 🌐 Services Directory (`src/services/`)

### 1. **api.ts** - API Client Setup
```typescript
// Configuration
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  TIMEOUT: 10000,
  USE_MOCK: true,  // Toggle untuk mock vs real
};

// Mock delay untuk simulasi network latency
const MOCK_API_DELAY = 300;

// MockApiClient dengan methods: get(), post(), put(), delete()
export const apiClient = new MockApiClient();
```

**Key Feature**: 
- Bisa langsung switch ke real axios dengan ganti `USE_MOCK` flag
- Comment out MockApiClient & uncomment axios client
- Sudah siap interceptor untuk auth token

---

### 2. **courseService.ts** - Course API
```typescript
// GET /api/v1/courses - Fetch all courses
export async function getCourses(): Promise<ApiResponse<CourseListResponse>>

// GET /api/v1/courses/:id - Fetch single course with details
export async function getCourseById(courseId: string): Promise<ApiResponse<CourseDetailResponse>>

// GET /api/v1/courses/:id/materials - Fetch materials
export async function getCourseMaterials(courseId: string): Promise<ApiResponse<MaterialSection[]>>

// GET /api/v1/courses/:id/questions - Fetch quiz questions
export async function getCourseQuestions(courseId: string): Promise<ApiResponse<QuizQuestion[]>>

// POST /api/v1/courses - Create new course
export async function createCourse(courseData: Partial<CourseDetail>): Promise<ApiResponse<CourseDetail>>
```

**Mock Data Source**: `src/data/courses.ts`

---

### 3. **gameService.ts** - Game API
```typescript
// GET /api/v1/game/questions - Fetch game questions
export async function getGameQuestions(): Promise<ApiResponse<QuizQuestionsResponse>>

// POST /api/v1/game/submit - Submit game score
export async function submitGameScore(scoreData: any): Promise<ApiResponse<GameScore>>

// GET /api/v1/game/leaderboard - Fetch leaderboard
export async function getGameLeaderboard(limit?: number): Promise<ApiResponse<LeaderboardItem[]>>
```

**Mock Data Source**: `MOCK_GAME_QUESTIONS` array (5 questions)

---

### 4. **quizService.ts** - Quiz API
```typescript
// GET /api/v1/quiz/:courseId/questions - Fetch quiz questions
export async function getQuizQuestions(courseId: string): Promise<ApiResponse<QuizQuestionsResponse>>

// POST /api/v1/quiz/submit - Submit quiz answers & get score
export async function submitQuiz(submissionData: any): Promise<ApiResponse<QuizResult>>

// GET /api/v1/quiz/progress/:courseId - Get user progress
export async function getQuizProgress(courseId: string): Promise<ApiResponse<ProgressData>>
```

**Mock Data Source**: Course questions dari `src/data/courses.ts`

---

## 🎣 Hooks Directory (`src/hooks/`)

### 1. **useApi.ts** - Generic Hook
```typescript
// Generic hook untuk any API call
export function useApi<T>(
  apiFunction: () => Promise<{ success: boolean; data?: T; error?: ApiError }>,
  dependencies?: unknown[]
): UseApiResponse<T>

// Returns: { data, loading, error, refetch }
```

**Usage**:
```typescript
const { data, loading, error, refetch } = useApi(() => courseService.getCourses());
```

---

### 2. **useFetchCourses.ts** - Dashboard Hook
```typescript
export function useFetchCourses(): UseFetchCoursesResponse {
  // data: CourseListItem[] | null
  // loading: boolean
  // error: ApiError | null
  // refetch: () => Promise<void>
}
```

**Digunakan di**: `src/app/dashboard/page.tsx`

---

### 3. **useFetchCourseDetail.tsx** - Course Detail Hook
```typescript
export function useFetchCourseDetail(courseId: string): UseFetchCourseDetailResponse {
  // data: CourseDetail | null (includes sections & questions)
  // loading: boolean
  // error: ApiError | null
  // refetch: () => Promise<void>
}
```

**Digunakan di**: `src/app/course/[id]/page.tsx`

---

### 4. **useGameQuestions.ts** - Game Hook
```typescript
export function useGameQuestions(): UseGameQuestionsResponse {
  // data: GameQuestion[] | null (5 questions)
  // loading: boolean
  // error: ApiError | null
  // refetch: () => Promise<void>
}
```

**Digunakan di**: `src/app/play/GameClient.tsx`

---

### 5. **useQuizQuestions.ts** - Quiz Hook
```typescript
export function useQuizQuestions(courseId: string): UseQuizQuestionsResponse {
  // data: QuizQuestion[] | null
  // loading: boolean
  // error: ApiError | null
  // refetch: () => Promise<void>
}
```

**Ready untuk**: Quiz implementation di course detail

---

## ✅ Pages Integration

### 1. **Dashboard** (`src/app/dashboard/page.tsx`)
```typescript
"use client";
import { useFetchCourses } from "@/hooks";

export default function Dashboard() {
  const { data: courses, loading, error, refetch } = useFetchCourses();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  
  return (
    <>
      <ContinueLearning courseId={courses[0].id} />
      {courses.map(course => <CourseCard key={course.id} {...course} />)}
    </>
  );
}
```

**Changes**:
- ❌ Removed: `import { courses } from "@/data/courses"`
- ✅ Added: `useFetchCourses()` hook
- ✅ Added: Loading state UI
- ✅ Added: Error handling dengan retry button

---

### 2. **Course Detail** (`src/app/course/[id]/page.tsx`)
```typescript
"use client";
import { useFetchCourseDetail } from "@/hooks";

export default function CourseDetailPage() {
  const { data: course, loading, error, refetch } = useFetchCourseDetail(courseId);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  
  return (
    <>
      <h1>{course.title}</h1>
      <QuizSection sections={course.sections} />
    </>
  );
}
```

**Changes**:
- ❌ Removed: `courses.find()` logic
- ✅ Added: `useFetchCourseDetail()` hook
- ✅ Added: Loading & error states
- ✅ Added: Guard untuk sections kosong

---

### 3. **Game/Play** (`src/app/play/GameClient.tsx`)
```typescript
"use client";
import { useGameQuestions } from "@/hooks";

export default function GamePage() {
  const { data: questionsFromApi, loading, error } = useGameQuestions();
  
  // Use fetched questions atau fallback ke DEFAULT
  const BANK_SOAL = questionsFromApi || DEFAULT_BANK_SOAL;

  if (loading && !BANK_SOAL.length) return <LoadingScreen />;
  
  return <GameUI questions={BANK_SOAL} />;
}
```

**Changes**:
- ❌ Removed: Hardcoded `const BANK_SOAL = [...]`
- ✅ Added: `useGameQuestions()` hook
- ✅ Added: Fallback ke DEFAULT_BANK_SOAL jika error
- ✅ Added: Loading screen sebelum game start
- ✅ Added: Console warning jika API error

---

## 🔄 Data Flow Examples

### Dashboard Loading Flow
```
1. Component mount
   ↓
2. useFetchCourses() hook runs
   ↓
3. Show <LoadingSpinner /> - "Loading courses..."
   ↓
4. Hook calls courseService.getCourses()
   ↓
5. Service calls apiClient.get("/api/v1/courses")
   ↓
6. MockApiClient simulasi delay (300ms)
   ↓
7. Return mock data dari src/data/courses.ts
   ↓
8. Hook setState(courses)
   ↓
9. Component re-render dengan courses
   ↓
10. CourseCard components rendered ✅
```

### Error Handling Flow
```
1. Component tries to fetch
   ↓
2. Network/API error occurs
   ↓
3. Hook setState(error)
   ↓
4. Component renders <ErrorState /> with:
   - Error message
   - "Try Again" button
   ↓
5. User click "Try Again"
   ↓
6. Hook.refetch() called
   ↓
7. Repeat fetch ↻
```

---

## 🔧 Configuration

### Environment Variables (`.env.example`)
```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase (future auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# Feature flags
NEXT_PUBLIC_USE_MOCK_API=true
```

---

## 🚀 Ready for Backend Integration

### Step 1: Setup Real Backend URL
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000  # Your Golang backend
```

### Step 2: Switch from Mock to Real API
Edit `src/services/api.ts`:
```typescript
// Option 1: Toggle flag
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  USE_MOCK: false,  // ← Change to false
};

// Option 2: Replace MockApiClient with real axios (see commented code in api.ts)
export const apiClient = createAxiosClient();  // Uncomment
```

### Step 3: Update API Endpoints
Services sudah siap, tinggal verify endpoint URLs match backend:
- ✅ `GET /api/v1/courses`
- ✅ `GET /api/v1/courses/:id`
- ✅ `GET /api/v1/game/questions`
- ✅ `POST /api/v1/quiz/submit`

---

## 📊 File Structure Summary

| Layer | Files | Purpose |
|-------|-------|---------|
| **Types** | 3 files (api.ts, course.ts, quiz.ts) | Data contracts/interfaces |
| **Services** | 4 files (api.ts, course/game/quiz Service) | API abstraction & mock data |
| **Hooks** | 5 files (useApi, useFetch*) | Data fetching & state management |
| **Pages** | 3 files (dashboard, course/[id], play) | **UPDATED** to use hooks |
| **Total** | 15 new files | Complete data layer |

---

## ✨ Key Features Implemented

✅ **Type Safety**: Centralized TypeScript interfaces  
✅ **Loading States**: All pages show loading UI  
✅ **Error Handling**: Error boundaries + retry logic  
✅ **Mock-to-Real Ready**: Easy switch to real backend  
✅ **Refetch Capability**: Retry failed requests  
✅ **Fallback Logic**: Game works even if API fails  
✅ **Separation of Concerns**: Pages ← Hooks ← Services ← Data  
✅ **Reusable Hooks**: `useApi()` generic untuk any endpoint  

---

## 🧪 Testing Checklist

- [x] Dev server runs without errors
- [x] Dashboard loads courses from hook
- [x] Course detail loads with hook
- [x] Game loads questions from hook
- [x] Loading states display correctly
- [x] Error states display correctly
- [x] Refetch buttons work
- [x] Mock data formats correctly
- [x] No TypeScript errors
- [x] All imports resolved

---

## 📝 Next Steps

### Phase 4 - Backend Integration
1. **Setup Golang Backend** pada port 8000
2. **Implement API Endpoints** matching contracts
3. **Update .env.local** dengan backend URL
4. **Switch API_CONFIG.USE_MOCK** ke false
5. **Test dengan real data**

### Optional Enhancements
- Add request/response interceptors
- Add timeout handling
- Add retry logic dengan exponential backoff
- Add caching layer
- Add optimistic updates

---

## 🎯 Success Metrics

| Metric | Status |
|--------|--------|
| Zero compilation errors | ✅ Pass |
| All pages render | ✅ Pass |
| Loading states work | ✅ Pass |
| Error states work | ✅ Pass |
| Mock data displays | ✅ Pass |
| Hooks integrate correctly | ✅ Pass |
| Ready for backend | ✅ Pass |

---

## 📞 Support

Pertanyaan atau issue? Struktur sudah siap untuk:
- Real API backend
- Authentication integration (Supabase)
- Advanced state management (Redux/Zustand)
- Real-time data (WebSocket)

**Project Status**: 🟢 Ready for Production-Like Development

---

Generated: June 7, 2026
