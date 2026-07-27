## Snapshot Fitur Project (FE vs BE)

---

# FRONTEND (FE) — `gestory/`
**Stack:** Next.js App Router (React + TypeScript) + Tailwind + Atomic Design Components

## 1) Halaman / Route Utama (Pages)
### a. Landing / Home: `/`
- **Header**: komponen `Header` (dipakai di halaman landing)
- **Hero section**:
  - headline utama + highlight kata ("Seru dan Aktif!")
  - deskripsi manfaat platform berbasis gestur
  - **CTA tombol** menuju:
    - `/dashboard` (button utama)
    - anchor `#fitur`
- **Social proof** (tampilan statistik siswa)
- **Ilustrasi** (gambar `kids_dancing.png`) + elemen dekoratif (blob backgrounds)
- **Fitur section** `#fitur`:
  - 3 kartu: Melatih Fokus, Kontrol Gerak, Umpan Balik Instan
- **Manfaat section** `#manfaat`:
  - benefit list + kartu stat
- **CTA banner** (background gradient) menuju `/dashboard`
- **Footer**:
  - link internal `#fitur`, `#manfaat`
  - link ke `/play`

### b. Dashboard: `/dashboard`
- **Fetch daftar courses** via hook `useFetchCourses`
- UI state:
  - loading spinner
  - error state (message + tombol refresh via `refetch`)
  - empty state (no courses)
- **Continue Learning**:
  - memakai `ContinueLearning` dengan course terakhir (berdasarkan `courses?.[0]`)
- **List course**:
  - grid responsive
  - render kartu menggunakan `CourseCard`

### c. Course Detail: `/course/[id]`
- `useParams()` untuk ambil `id` (dipakai sebagai `courseId`)
- **Fetch detail course** via `useFetchCourseDetail(courseId)`
- state UI:
  - loading
  - error + tombol retry + link kembali dashboard
  - fallback “Materi tidak ditemukan”
- **Breadcrumbs**: Dashboard → Kursus → `course.breadcrumb`
- Tampilan detail:
  - judul course
  - deskripsi singkat (box gaya tertentu)
- **GameBoard** ditampilkan untuk gamifikasi
- **QuizSection**:
  - props: `courseId`, `sections`, `openSection`, `onToggleSection`
  - jika `sections` kosong: tampilkan pesan materi dipersiapkan

---

## 2) Komponen UI (Atomic Design)
### a. Atoms
- `Button`
- `Input`
- `Icon`
- `Badge`
- `Link`

### b. Molecules
- `NavItem`
- `Card`
- `SearchBar`
- `ChatInput`
- `ChatMessage`
- `FormField`

### c. Organisms
- `Header` (dipakai di landing)
- `Sidebar` (struktur navigasi)
- `ChatWidget` (juga dipakai global)
- `ContinueLearning`
- `CourseCard`
- `GameBoard`
- `QuizSection`

### d. Templates (Layouts)
- `MainLayout`
- `DashboardLayout`
- `CourseLayout`
- `GameLayout`

---

## 3) Integrasi API (Service + API Client)
### a. API Client: `src/services/api.ts`
- `BASE_URL`: `NEXT_PUBLIC_API_URL` default `http://localhost:8000`
- `timeout`: 10.000ms
- headers default `Content-Type: application/json`
- **Request interceptor**:
  - baca `localStorage.authToken`
  - jika ada → set `Authorization: Bearer <token>`
- **Response interceptor**:
  - mengembalikan `response.data` saja

### b. Service Layer
#### `courseService.ts`
- `getCourses()` → `GET /api/v1/courses`
- `getCourseById(courseIdOrSlug)` → `GET /api/v1/courses/:slug`
- `getCourseMaterials(courseIdOrSlug)` → `GET /api/v1/courses/:slug/materials`
- `getCourseQuestions(courseIdOrSlug)` → `GET /api/v1/courses/:slug/questions`
- `createCourse()` (placeholder) → `POST /api/v1/courses`

#### `quizService.ts`
- `getQuizQuestions(courseId)` → `GET /api/v1/quiz/:slug/questions`
- `submitQuiz(submissionData)` → `POST /api/v1/quiz/submit`

#### `gameService.ts`
- `getGameQuestions()` → `GET /api/v1/game/questions` (di backend ada query `courseId`)
- `submitGameScore(scoreData)` → `POST /api/v1/game/submit`
- `getGameLeaderboard(limit)` → `GET /api/v1/game/leaderboard?limit=...`

---

## 4) Fitur Tambahan
### Chat (Global)
- `ChatWidget` dimasukkan ke `RootLayout` sehingga selalu terlihat di bawah seluruh halaman.

---

# BACKEND (BE) — `backend_go/`
**Stack:** Go + Gin (HTTP) + GORM (DB) + Supabase Postgres

## 1) Arsitektur Layering
- `cmd/api/main.go`: entrypoint (load config, connect DB, wiring router)
- `internal/routes/router.go`: wiring endpoint + CORS
- `internal/handler/*`: Gin handlers (validasi input, pemanggilan service)
- `internal/service/*`: business logic
- `internal/repository/*`: akses data (GORM)
- `internal/dto/*`: contract request/response
- `internal/middleware/auth.go`: middleware auth (ada)
- `internal/response/response.go`: helper format respons standar

---

## 2) Middleware & Konfigurasi CORS
- Di `internal/routes/router.go`, Gin memakai `cors.New(cors.Config{...})`
- `AllowOrigins`: `cfg.FrontendURL`
- headers: `Origin`, `Content-Type`, `Authorization`
- methods: GET/POST/PUT/PATCH/DELETE/OPTIONS
- `AllowCredentials: true`

---

## 3) Endpoint REST API (Base Path `/api/v1`)
### Health
- `GET /api/v1/health`

### Courses
- `GET /api/v1/courses`
- `GET /api/v1/courses/:slug`
- `GET /api/v1/courses/:slug/materials`
- `GET /api/v1/courses/:slug/questions`

### Quiz
- `GET /api/v1/quiz/:slug/questions`
- `POST /api/v1/quiz/submit`

### Game
- `GET /api/v1/game/questions?courseId=bab-1` (default di handler: `bab-1`)
- `POST /api/v1/game/submit`
- `GET /api/v1/game/leaderboard?limit=10` (default limit: 10)

---

## 4) Standar Format Response
Di `internal/response/response.go`:
- `Success(status, data, message)` menghasilkan JSON:
  - `success: true`
  - `data`
  - `message`
  - `timestamp` (UTC, RFC3339)
- `Error(status, code, message)` menghasilkan JSON:
  - `success: false`
  - `error: { code, message }`
  - `timestamp`
- helper spesifik:
  - `BadRequest`
  - `NotFound`
  - `Internal`

---

## 5) Implementasi Handler (Contoh yang terlihat)
### `course_handler.go`
- `GetCourses()` → service `GetCourses()`
- `GetCourseBySlug(slug)`
  - jika `data == nil` → `NotFound("COURSE_NOT_FOUND", ...)`
- `GetMaterialsBySlug(slug)`
- `GetQuestionsBySlug(slug)`

### `quiz_handler.go`
- `GetQuestions(slug)` → courseService untuk ambil quiz questions
- `Submit()`:
  - `ShouldBindJSON` ke `dto.SubmitQuizRequest`
  - panggil `quizService.SubmitQuiz(request)`

### `game_handler.go`
- `GetQuestions()`:
  - ambil `courseId` dari query (`DefaultQuery("courseId","bab-1")`)
  - panggil `courseService.GetQuestionsBySlug(slug)`
- `SubmitScore()`:
  - `ShouldBindJSON` ke `dto.SubmitGameScoreRequest`
  - panggil `gameService.SubmitScore(request)`
- `GetLeaderboard()`:
  - parse `limit` dari query (fallback 10)
  - panggil `gameService.GetLeaderboard(limit)`

---

## 6) DTO & Model Data (yang terlihat di course DTO)
Di `internal/dto/course.go`:
- `CourseListItem`, `CourseListResponse`
- `CourseDetailResponse` → wrapper `course`
- `CourseDetail` berisi:
  - `id`, `title`, `breadcrumb`, `description`, `image`, `status`
  - `sections []MaterialSection`
  - `questions []QuizQuestionItem`
- `MaterialSection`: `type`, `title`, `content?`, `url?`

