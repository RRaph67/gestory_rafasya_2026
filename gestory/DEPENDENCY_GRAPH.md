# 🔗 DEPENDENCY & USAGE GRAPH

## Component Tree - Keseluruhan

```
App (root layout.tsx)
│
├─ [Always Present]
│  └─ ChatWidget (organism)
│     ├─ ChatMessage (molecule)
│     ├─ ChatInput (molecule)
│     │  └─ Input (atom)
│     │     └─ Search icon (lucide-react)
│     └─ ChatToggleButton (atom - Button variant)
│
├─ Pages/Routes
│  │
│  ├─ page.tsx [/]
│  │  ├─ Header (organism)
│  │  │  └─ Logo + Nav Links
│  │  ├─ Hero Section
│  │  ├─ Features (3 cards)
│  │  ├─ Benefits (6 items)
│  │  └─ CTA Section
│  │
│  ├─ dashboard/page.tsx [/dashboard]
│  │  ├─ ContinueLearning (organism)
│  │  │  └─ Uses: PlayCircle icon, Clock icon
│  │  │
│  │  └─ CourseCard (organism) ×4 reusable
│  │     ├─ ChevronRight icon
│  │     └─ Uses: src/data/courses.ts
│  │
│  ├─ course/[id]/page.tsx [/course/:id]
│  │  ├─ GameBoard (organism)
│  │  │  └─ Gamepad2 icon
│  │  │
│  │  ├─ QuizSection (organism)
│  │  │  ├─ FileType icon
│  │  │  ├─ FileText icon
│  │  │  ├─ Video icon
│  │  │  ├─ ClipboardCheck icon
│  │  │  └─ ChevronRight/ChevronDown icons
│  │  │
│  │  └─ Uses: src/data/courses.ts
│  │
│  └─ play/page.tsx [/play]
│     └─ GameClient.tsx [Dynamic Import]
│        ├─ MediaPipe Hands API
│        ├── Canvas for webcam
│        ├── Crosshair element
│        ├── Target element
│        ├── Question display
│        ├── Answer buttons
│        ├── Audio elements (BGM + SFX)
│        └── Uses: BANK_SOAL (embedded data)
│
└─ Layout Structure
   ├─ globals.css (global styles)
   ├─ layout.tsx (root layout)
   └─ [theme colors, fonts, tailwind]
```

---

## Data Dependencies

```
Data Flows:
━━━━━━━━━

src/data/courses.ts
│
├─ dashboard/page.tsx
│  ├─ ContinueLearning → lastCourse = courses[0]
│  └─ CourseCard ×4 → map(courses)
│
└─ course/[id]/page.tsx
   ├─ useParams() → params.id
   ├─ find(courses, id) → specific course
   ├─ QuizSection → course.sections
   └─ Questions display → course.questions


play/GameClient.tsx
│
└─ BANK_SOAL (embedded)
   ├─ 5 questions
   ├─ Quiz logic
   └─ Scoring system
```

---

## Component Usage Matrix

```
┌──────────────────────────────────────────────────────────────────┐
│ COMPONENT USAGE IN PAGES                                         │
├──────────────────────────────────────────────────────────────────┤
│ Component           │ Landing │ Dashboard │ Course │ Game │ Chat │
├─────────────────────┼─────────┼───────────┼────────┼──────┼──────┤
│ Header              │    ✓    │           │        │      │      │
│ CourseCard          │         │     ✓×4   │        │      │      │
│ ContinueLearning    │         │     ✓     │        │      │      │
│ GameBoard           │         │           │   ✓    │      │      │
│ QuizSection         │         │           │   ✓    │      │      │
│ ChatWidget          │         │           │        │      │  ✓*  │
│ ChatMessage         │         │           │        │      │  ✓   │
│ ChatInput           │         │           │        │      │  ✓   │
│ Button              │   ✓     │     ✓     │   ✓    │  ✓   │  ✓   │
│ Input               │   ✓     │           │        │      │  ✓   │
│ Icon                │   ✓     │     ✓     │   ✓    │  ✓   │  ✓   │
│ Badge               │         │           │        │      │      │
│ Card                │         │           │        │      │  ✓   │
│ Link                │   ✓     │     ✓     │   ✓    │      │      │
│ NavItem             │         │           │        │      │      │
├─────────────────────┴─────────┴───────────┴────────┴──────┴──────┤
│ * ChatWidget is global (rendered in layout.tsx, not in pages)    │
└──────────────────────────────────────────────────────────────────┘
```

---

## Feature Implementation Map

```
🎯 FITUR #1: Landing Page Hero
├─ Komponen Utama: Header (organism)
├─ Tujuan: Present platform
├─ Data: Static (hardcoded)
├─ User Flow: view → click "Mulai Belajar" → /dashboard
└─ Lokasi: src/app/page.tsx

🎯 FITUR #2: Dashboard/Course Browsing
├─ Komponen Utama: ContinueLearning, CourseCard (organisms)
├─ Tujuan: Select and browse courses
├─ Data: src/data/courses.ts
├─ User Flow: view courses → click card → /course/[id]
└─ Lokasi: src/app/dashboard/page.tsx

🎯 FITUR #3: Course Details & Materials
├─ Komponen Utama: QuizSection, GameBoard (organisms)
├─ Tujuan: Access learning materials
├─ Data: src/data/courses.ts (course.sections, course.questions)
├─ Content Types:
│  ├─ PDF (preview + download)
│  ├─ Text (inline content)
│  ├─ Video (placeholder)
│  └─ Quiz (placeholder)
├─ User Flow: view materials → click game → /play
└─ Lokasi: src/app/course/[id]/page.tsx

🎯 FITUR #4: Gesture-Based Game & Quiz
├─ Komponen Utama: GameClient (custom component)
├─ Tujuan: Interactive learning via hand gestures
├─ Technology: MediaPipe Hands API
├─ Data: BANK_SOAL (5 embedded questions)
├─ Game States:
│  ├─ HUNTING (search + shoot target)
│  ├─ EXPLODING (target animation)
│  ├─ QUESTION (display quiz)
│  ├─ FEEDBACK (answer explanation - 4 sec)
│  └─ FINISHED (final score)
├─ Input: Pinch gesture (thumb + index finger)
├─ Audio: BGM + SFX (with mute toggle)
├─ Scoring: +100 per correct answer
└─ Lokasi: src/app/play/

🎯 FITUR #5: Chat Widget (Global)
├─ Komponen Utama: ChatWidget, ChatMessage, ChatInput (organisms + molecules)
├─ Tujuan: User support & interaction
├─ Placement: Fixed bottom-right (global)
├─ Features:
│  ├─ Collapsible/expandable
│  ├─ Message history
│  ├─ Typing indicator
│  ├─ Avatar (user vs AI)
│  └─ Hidden on /play
├─ State: Local useState (not persistent)
├─ Status: Basic UI ready (AI integration pending)
└─ Lokasi: src/components/organisms/ChatWidget/
   └─ Rendered in: src/app/layout.tsx
```

---

## File Structure with Purposes

```
src/
│
├── app/                           [PAGE ROUTES]
│   ├── page.tsx                   📍 Landing - Hero + CTA
│   ├── layout.tsx                 📍 Root layout (imports ChatWidget)
│   ├── globals.css                🎨 Global styles & Tailwind directives
│   │
│   ├── dashboard/
│   │   └── page.tsx               📍 Dashboard - Course browsing
│   │
│   ├── course/
│   │   └── [id]/
│   │       └── page.tsx           📍 Course Detail - Materials + Game link
│   │
│   └── play/
│       ├── page.tsx               📍 Game wrapper (SSR disabled)
│       └── GameClient.tsx         🎮 Game logic (MediaPipe)
│
├── components/                    [ATOMIC DESIGN LIBRARY]
│   ├── atoms/                     ⚛️ Base components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Icon/
│   │   ├── Badge/
│   │   ├── Link/
│   │   └── index.ts
│   │
│   ├── molecules/                 🧬 Atom combinations
│   │   ├── ChatMessage/
│   │   ├── ChatInput/
│   │   ├── Card/
│   │   ├── FormField/
│   │   ├── NavItem/
│   │   ├── SearchBar/
│   │   └── index.ts
│   │
│   ├── organisms/                 🔬 Complex sections
│   │   ├── ChatWidget/            💬 Chat UI
│   │   ├── Header/                📍 Navbar
│   │   ├── CourseCard/            🎓 Course item
│   │   ├── ContinueLearning/      ▶️ Resume banner
│   │   ├── GameBoard/             🎮 Game CTA
│   │   ├── QuizSection/           📚 Material accordion
│   │   ├── Sidebar/               🧭 Nav sidebar
│   │   └── index.ts
│   │
│   ├── templates/                 📄 Page layouts
│   │   ├── MainLayout/            🏗️ Sidebar + header layout
│   │   └── index.ts
│   │
│   └── index.ts                   [Main barrel export]
│
├── data/                          [STATIC DATA]
│   └── courses.ts                 📊 4 courses (Bab 1-4)
│                                   • Bab 1: Full content
│                                   • Bab 2-4: Placeholder
│
├── hooks/                         [TODO - Phase 4]
│   ├── useFetchCourses/
│   ├── useAuth/
│   └── useApi/
│
├── services/                      [TODO - Phase 4]
│   ├── api.ts                     (Axios config)
│   ├── courseService.ts
│   ├── authService.ts
│   └── gameService.ts
│
├── types/                         [TODO - Phase 4]
│   ├── course.ts
│   ├── quiz.ts
│   ├── user.ts
│   └── api.ts
│
├── context/                       [TODO - Phase 4]
│   ├── AuthContext.tsx
│   ├── CourseContext.tsx
│   └── GameContext.tsx
│
└── utils/                         [TODO - Phase 4]
    ├── constants.ts
    ├── validators.ts
    └── formatters.ts
```

---

## Data Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ├─→ Visit Landing → / → Header + Hero + CTA
       │                        ↓
       │                    Click "Mulai Belajar"
       │                        ↓
       ├─→ Dashboard → /dashboard
       │              ├─ Fetch: src/data/courses.ts
       │              ├─ Render: ContinueLearning
       │              └─ Render: CourseCard ×4
       │                        ↓
       │                    Click Course Card
       │                        ↓
       ├─→ Course Detail → /course/[id]
       │                  ├─ Fetch: src/data/courses.ts (id)
       │                  ├─ Render: QuizSection (materials)
       │                  ├─ Render: GameBoard (game CTA)
       │                  ├─ Display: PDF/Text/Video/Quiz content
       │                  │           (from course.sections)
       │                  │           (from course.questions)
       │                  └─ View: Questions preview
       │                        ↓
       │                    Click "Game Button"
       │                        ↓
       ├─→ Game → /play
       │         ├─ Initialize: MediaPipe Hands
       │         ├─ Load: BANK_SOAL (5 questions)
       │         ├─ Gameplay:
       │         │  ├─ HUNTING: Detect hands, move crosshair
       │         │  ├─ Pinch: Shoot target
       │         │  ├─ QUESTION: Show quiz
       │         │  ├─ FEEDBACK: +100 if correct
       │         │  └─ FINISHED: Show score
       │         └─ Audio: BGM + SFX
       │
       └─→ Throughout: Chat Widget (global)
              └─ Position: bottom-right
                 Hidden: on /play
                 Features: collapsible, messaging, typing indicator
```

---

## Technology Stack by Feature

```
🌐 Frontend Framework
├─ Next.js 16.2.7        [Framework]
├─ React 19.2.4          [Library]
├─ TypeScript 5          [Language]
└─ Tailwind CSS 4        [Styling]

🎨 UI & Icons
├─ Lucide React 1.8.0    [Icons]
└─ Custom components     [Atomic Design]

🎮 Game & Interactions
├─ MediaPipe Hands       [Hand detection]
└─ Canvas API            [Rendering]

🔊 Audio
├─ HTML Audio API        [BGM + SFX]
└─ Browser volume API    [Mute control]

📱 Responsive Design
├─ Tailwind breakpoints  [Mobile/Tablet/Desktop]
└─ CSS Grid/Flexbox      [Layout]
```

---

## Summary: Apa yang Dimana

```
FEATURE          LOKASI                    KOMPONEN              DATA
────────────────────────────────────────────────────────────────────────
Landing          src/app/page.tsx          Header                Statis
Dashboard        src/app/dashboard/        CourseCard,           courses.ts
                 page.tsx                  ContinueLearning
Course Detail    src/app/course/[id]/      GameBoard,            courses.ts
                 page.tsx                  QuizSection
Game/Quiz        src/app/play/             GameClient            BANK_SOAL
Chat Widget      src/components/           ChatWidget,           useState
                 organisms/ChatWidget/     ChatMessage,
                                          ChatInput
```

