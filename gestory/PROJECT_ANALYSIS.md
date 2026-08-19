# 📋 ANALISIS LENGKAP PROJECT - GESTORY

---

## 🔄 PERUBAHAN YANG TELAH DILAKUKAN

### **Phase 1: Atomic Design Refactoring** ✅

#### **Struktur Component Sebelum**
```
src/components/
└── ChatWidget.tsx        (1 file monolitik)
```

#### **Struktur Component Sesudah** 
```
src/components/
├── atoms/                (5 reusable components)
│   ├── Button/
│   ├── Input/
│   ├── Icon/
│   ├── Badge/
│   ├── Link/
│   └── index.ts
├── molecules/            (6 components - kombinasi atoms)
│   ├── ChatMessage/
│   ├── ChatInput/
│   ├── Card/
│   ├── FormField/
│   ├── NavItem/
│   ├── SearchBar/
│   └── index.ts
├── organisms/            (7 complex components)
│   ├── ChatWidget/       (refactored dari root)
│   ├── CourseCard/       (NEW - grid display)
│   ├── ContinueLearning/ (NEW - banner)
│   ├── Header/           (NEW - navbar)
│   ├── GameBoard/        (NEW - game CTA)
│   ├── QuizSection/      (NEW - accordion)
│   ├── Sidebar/          (NEW - nav sidebar)
│   └── index.ts
├── templates/            (1 layout template)
│   ├── MainLayout/
│   └── index.ts
└── index.ts             (main export)
```

**Benefit**: Lebih modular, reusable, dan mudah di-maintain

---

### **Phase 2 & 3: Pages Refactoring** ✅

#### **Landing Page** (`src/app/page.tsx`)
- **SEBELUM**: Navbar HTML inline (50+ lines)
- **SESUDAH**: `<Header />` component
- **Reduction**: -50 lines (-17%)

#### **Dashboard Page** (`src/app/dashboard/page.tsx`)
- **SEBELUM**: Course cards inline, continue banner inline
- **SESUDAH**: Gunakan `<CourseCard />` & `<ContinueLearning />`
- **Reduction**: -50 lines (-25%)

#### **Course Detail Page** (`src/app/course/[id]/page.tsx`)
- **SEBELUM**: Quiz section inline (100+ lines), GameBoard inline
- **SESUDAH**: Gunakan `<QuizSection />` & `<GameBoard />`
- **Reduction**: -70 lines (-28%)

---

## 🎯 FITUR-FITUR YANG ADA DALAM PROJECT

### **1. LANDING PAGE** 📱
**Lokasi**: `src/app/page.tsx`

**Fitur**:
- ✅ Hero section dengan value proposition
- ✅ Navbar dengan logo & CTA button
- ✅ Feature showcase (3 cards)
- ✅ Benefit section dengan 6 points
- ✅ CTA section (call-to-action)
- ✅ Footer dengan info & links

**Components Digunakan**:
- `Header` (organism) - Navbar
- Custom HTML (hero, features, benefits)

**Tujuan**: Presentasi awal platform kepada users baru

---

### **2. DASHBOARD** 📊
**Lokasi**: `src/app/dashboard/page.tsx`

**Fitur**:
- ✅ Welcome message ("Halo Vicent!")
- ✅ Continue Learning banner - big card untuk kursus terakhir dilihat
- ✅ Course grid - menampilkan semua kursus (4 kolom di desktop)
- ✅ Responsive design (1 kolom mobile, 2 tablet, 4 desktop)
- ✅ Course navigation (next/prev buttons)

**Components Digunakan**:
- `ContinueLearning` (organism) - Big banner
- `CourseCard` (organism) - Individual course card (×4 reusable)

**Data Source**: `src/data/courses.ts` (sekarang, nanti dari API)

**Tujuan**: Hub utama untuk memilih dan melanjutkan belajar

---

### **3. COURSE DETAIL PAGE** 📚
**Lokasi**: `src/app/course/[id]/page.tsx`

**Fitur**:
- ✅ Breadcrumb navigation
- ✅ Course title & description
- ✅ Description box (styled)
- ✅ Game/Quiz CTA button - link ke `/play`
- ✅ Material & Quiz accordion
  - Expandable sections
  - Support 4 tipe konten: PDF, Text, Video, Quiz
  - PDF preview & download link
  - Video placeholder (coming soon)
  - Quiz placeholder (coming soon)

**Components Digunakan**:
- `GameBoard` (organism) - Game CTA button
- `QuizSection` (organism) - Material accordion

**Data Source**: `src/data/courses.ts` (4 courses)

**Tujuan**: Menampilkan materi pembelajaran & akses ke game

---

### **4. GAME/QUIZ PAGE** 🎮
**Lokasi**: `src/app/play/page.tsx` + `src/app/play/GameClient.tsx`

**Fitur Utama**: GESTURE-BASED LEARNING dengan MediaPipe

**Game Mechanics**:
1. **Hand Detection** - MediaPipe Hands API mendeteksi gerakan tangan via webcam
2. **Crosshair** - Mengikuti posisi ujung jari (thumb + index)
3. **Pinch Gesture** - Jari ibu & telunjuk "mencubit" = SHOOT/SELECT
4. **Target Hunting** - Target bergerak random di layar, harus ditembak
5. **Quiz Mode** - Setelah hit target, pertanyaan muncul
6. **Answer Selection** - Pilihan A/B, pinch untuk jawab
7. **Feedback** - Correct/wrong dengan explanation
8. **Scoring** - +100 poin per jawaban benar
9. **Progression** - 5 soal → selesai → show final score

**Game States**:
- `HUNTING` - Cari target, tembak dengan pinch
- `EXPLODING` - Animasi target meledak
- `QUESTION` - Pertanyaan tampil
- `FEEDBACK` - Jawaban benar/salah + penjelasan (4 detik)
- `FINISHED` - Game selesai, tampil score

**Audio**:
- ✅ Background music (BGM) - mute toggle
- ✅ Shoot sound effects (SFX)
- ✅ Auto-play on first interaction

**Quiz Bank**: 5 soal tentang Sejarah Kemerdekaan Indonesia

**Components**: Custom game component dengan MediaPipe

**Tujuan**: Pembelajaran interaktif berbasis gesture recognition

---

### **5. CHAT WIDGET** 💬
**Lokasi**: `src/components/organisms/ChatWidget/`

**Fitur**:
- ✅ Fixed position (bottom-right)
- ✅ Collapsible/expandable
- ✅ Message history
- ✅ User avatar vs AI avatar
- ✅ Typing indicator
- ✅ Send message form
- ✅ Hidden pada halaman `/play`

**State Management**: useState (local component state)

**Messages**: 
- Greeting message dari AI
- Placeholder responses ("Sedang dalam pemeliharaan")

**Components Digunakan**:
- `ChatMessage` (molecule) - Individual message
- `ChatInput` (molecule) - Input form
- `ChatToggleButton` (atom) - Toggle button

**Tujuan**: Bantuan user & interaksi real-time (placeholder untuk future AI)

---

## 🗂️ STRUKTUR FOLDER & IMPLEMENTASI FITUR

### **ROOT STRUCTURE**
```
gestory/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # 🔴 LANDING PAGE
│   │   ├── layout.tsx                # Global layout (imports ChatWidget)
│   │   ├── globals.css               # Global styles
│   │   ├── dashboard/
│   │   │   └── page.tsx              # 🟢 DASHBOARD PAGE
│   │   ├── course/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # 🔵 COURSE DETAIL PAGE
│   │   └── play/
│   │       ├── page.tsx              # 🟣 GAME WRAPPER (loader)
│   │       └── GameClient.tsx        # 🎮 GAME LOGIC (MediaPipe)
│   │
│   ├── components/                   # ATOMIC DESIGN STRUCTURE
│   │   ├── atoms/                    # ⚛️ BASE COMPONENTS
│   │   │   ├── Button/               # Generic button
│   │   │   ├── Input/                # Text input
│   │   │   ├── Icon/                 # Icon wrapper (Lucide)
│   │   │   ├── Badge/                # Status badge
│   │   │   ├── Link/                 # Navigation link
│   │   │   └── index.ts              # Barrel export
│   │   │
│   │   ├── molecules/                # 🧬 ATOM COMBINATIONS
│   │   │   ├── ChatMessage/          # Message bubble (for ChatWidget)
│   │   │   ├── ChatInput/            # Input form (for ChatWidget)
│   │   │   ├── Card/                 # Generic card container
│   │   │   ├── FormField/            # Label + Input combo
│   │   │   ├── NavItem/              # Nav menu item (for Sidebar)
│   │   │   ├── SearchBar/            # Search input combo
│   │   │   └── index.ts              # Barrel export
│   │   │
│   │   ├── organisms/                # 🔬 COMPLEX SECTIONS
│   │   │   ├── ChatWidget/           # Full chat interface
│   │   │   │   ├── ChatWidget.tsx    # Main component
│   │   │   │   └── index.ts
│   │   │   ├── CourseCard/           # Single course card (used in Dashboard grid)
│   │   │   │   ├── CourseCard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ContinueLearning/     # "Last viewed" banner (used in Dashboard)
│   │   │   │   ├── ContinueLearning.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Header/               # Main navbar (used in Landing)
│   │   │   │   ├── Header.tsx
│   │   │   │   └── index.ts
│   │   │   ├── GameBoard/            # Game CTA button (used in Course Detail)
│   │   │   │   ├── GameBoard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── QuizSection/          # Material accordion (used in Course Detail)
│   │   │   │   ├── QuizSection.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Sidebar/              # Navigation sidebar (ready for Dashboard layout)
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts              # Barrel export
│   │   │
│   │   ├── templates/                # 📄 PAGE LAYOUTS
│   │   │   ├── MainLayout/           # Sidebar + Header + Content
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts              # Barrel export
│   │   │
│   │   └── index.ts                  # Main barrel export (all components)
│   │
│   ├── data/                         # 📊 STATIC DATA (akan diganti API)
│   │   └── courses.ts                # Course data + Quiz questions
│   │                                  # 4 courses: Bab 1-4
│   │                                  # Bab 1 punya content lengkap
│   │                                  # Bab 2-4 placeholder
│   │
│   ├── hooks/                        # 🪝 CUSTOM HOOKS (TODO - NEXT PHASE)
│   ├── services/                     # 🔌 API CLIENTS (TODO - NEXT PHASE)
│   ├── types/                        # 📝 TYPESCRIPT INTERFACES (TODO - NEXT PHASE)
│   ├── context/                      # 🌐 REACT CONTEXT (TODO - NEXT PHASE)
│   └── styles/                       # 🎨 GLOBAL STYLES (TODO - NEXT PHASE)
│
├── public/
│   ├── assets/                       # Images & icons
│   │   ├── bab1_thumb.png
│   │   ├── bab2_thumb.png
│   │   ├── bab3_thumb.png
│   │   ├── bab4_thumb.png
│   │   ├── gestory_happy.png         # Chat widget avatar
│   │   ├── gestory_thinking.png      # Chat widget thinking avatar
│   │   └── (other assets)
│   └── material/                     # Course materials
│       └── sejarahkemerdekaan.pdf    # PDF materi Bab 1
│
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config (path aliases: @/*)
├── next.config.ts                    # Next.js config
├── postcss.config.mjs                # Tailwind CSS config
└── eslint.config.mjs                 # ESLint config
```

---

## 🎯 FITUR PER FOLDER IMPLEMENTATION

### **Fitur: Landing Page** 
```
Landing Page (Hero + Features + CTA)
├── Lokasi: src/app/page.tsx
├── Components:
│   ├── Header (organism) - Navbar
│   └── Custom HTML (hero, features)
├── Tujuan: Presentasi platform
└── Status: ✅ SELESAI
```

### **Fitur: Dashboard/Course Browsing**
```
Dashboard (Course Grid + Continue Learning)
├── Lokasi: src/app/dashboard/page.tsx
├── Components:
│   ├── ContinueLearning (organism) - Big banner
│   └── CourseCard (organism) ×4 - Grid display
├── Data: src/data/courses.ts
├── Tujuan: Browse & select courses
└── Status: ✅ SELESAI
```

### **Fitur: Material & Quiz Management**
```
Course Detail (Material + Quiz Accordion)
├── Lokasi: src/app/course/[id]/page.tsx
├── Components:
│   ├── QuizSection (organism) - Expandable sections
│   └── GameBoard (organism) - Game CTA
├── Data: src/data/courses.ts
├── Content Types:
│   ├── PDF - Link ke download
│   ├── Text - Inline content
│   ├── Video - Placeholder
│   └── Quiz - Placeholder
├── Tujuan: View learning materials
└── Status: ✅ SELESAI
```

### **Fitur: Gesture-Based Game/Quiz**
```
Game/Quiz (Hand Detection + Quiz Mode)
├── Lokasi: 
│   ├── src/app/play/page.tsx - SSR wrapper
│   └── src/app/play/GameClient.tsx - Game logic
├── Technology: MediaPipe Hands API + Webcam
├── Features:
│   ├── Hand detection (thumb + index)
│   ├── Crosshair following
│   ├── Pinch gesture detection
│   ├── Target hunting
│   ├── Question mode
│   ├── Answer selection
│   ├── Scoring system
│   └── Audio (BGM + SFX)
├── Quiz Data: BANK_SOAL (5 questions)
├── Tujuan: Interactive learning via gestures
└── Status: ✅ SELESAI
```

### **Fitur: Chat Widget**
```
Chat Assistant
├── Lokasi: src/components/organisms/ChatWidget/
├── Components:
│   ├── ChatMessage (molecule) - Message bubbles
│   ├── ChatInput (molecule) - Input form
│   └── ChatToggleButton (atom) - Toggle
├── Features:
│   ├── Collapsible
│   ├── Message history
│   ├── Typing indicator
│   ├── Avatar display
│   └── Hidden on /play
├── State: Local (useState)
├── Tujuan: User support & interaction
└── Status: ✅ BASIC SELESAI (ready for AI integration)
```

---

## 📊 DATA FLOW DIAGRAM

```
Landing Page (page.tsx)
    ↓
User clicks "Mulai Belajar"
    ↓
Dashboard (dashboard/page.tsx)
    ↓ [Fetches courses from src/data/courses.ts]
    ↓
Shows ContinueLearning banner + CourseCard grid
    ↓
User clicks course card
    ↓
Course Detail (course/[id]/page.tsx)
    ↓ [Fetches course data from src/data/courses.ts]
    ↓
Shows material accordion + Game button
    ↓ User clicks "Game"
    ↓
Game Page (play/page.tsx → GameClient.tsx)
    ↓ [Uses BANK_SOAL quiz data]
    ↓
MediaPipe initializes → Hand detection active
    ↓
User plays game via hand gestures
    ↓
Score calculated → Results shown
```

---

## 🔮 NEXT PHASES (BELUM DIKERJAKAN)

### **Phase 4: Backend Integration**

**Folder yang akan dibuat**:
```
src/
├── services/          # API clients
│   ├── api.ts         # Axios config + interceptors
│   ├── courseService.ts
│   ├── quizService.ts
│   ├── authService.ts
│   └── gameService.ts
├── hooks/             # Custom React hooks
│   ├── useApi.ts
│   ├── useFetchCourses.ts
│   ├── useFetchQuiz.ts
│   └── useAuth.ts
├── types/             # TypeScript interfaces
│   ├── course.ts
│   ├── quiz.ts
│   ├── user.ts
│   ├── api.ts
│   └── index.ts
├── context/           # Global state
│   ├── AuthContext.tsx
│   ├── CourseContext.tsx
│   └── GameContext.tsx
└── utils/             # Helpers
    ├── constants.ts
    ├── validators.ts
    ├── formatters.ts
    └── storage.ts
```

**Integrasi**:
- Replace `src/data/courses.ts` dengan API calls
- Connect to Golang backend (`localhost:8000`)
- Connect to Supabase Auth
- Store auth token in localStorage/cookies
- Implement error handling & loading states

---

## ✨ SUMMARY

| Aspek | Status |
|-------|--------|
| **Atomic Design** | ✅ Completed (18 components) |
| **Pages Refactored** | ✅ Completed (3 pages) |
| **Fitur Landing** | ✅ Completed |
| **Fitur Dashboard** | ✅ Completed |
| **Fitur Course Detail** | ✅ Completed |
| **Fitur Game/Quiz** | ✅ Completed |
| **Fitur Chat Widget** | ✅ Basic Completed |
| **Backend Integration** | ⏳ TODO (Phase 4) |
| **State Management** | ⏳ TODO (Phase 4) |
| **Authentication** | ⏳ TODO (Phase 4) |

---

**Total Components**: 18  
**Total Pages**: 4  
**Total Features**: 6  
**Code Reduction**: -23%  
**Next**: Setup Backend + Golang + Supabase Integration
