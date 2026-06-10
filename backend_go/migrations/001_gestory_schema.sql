-- Gestory backend schema for Supabase Postgres.
-- Safe to run after the snapshot schema: it creates missing tables and adds
-- columns needed by the Next.js frontend contract.

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT
);

ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS slug TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);

CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    order_index INTEGER NOT NULL
);

ALTER TABLE public.materials
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS url TEXT;

CREATE INDEX IF NOT EXISTS idx_materials_course_id ON public.materials(course_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_materials_course_order ON public.materials(course_id, order_index);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    correct_answer TEXT,
    difficulty TEXT
);

ALTER TABLE public.quiz_questions
ADD COLUMN IF NOT EXISTS options JSONB NOT NULL DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS explanation TEXT;

CREATE INDEX IF NOT EXISTS idx_quiz_questions_course_id ON public.quiz_questions(course_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_questions_course_question ON public.quiz_questions(course_id, question);

CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    score INTEGER,
    completed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.quiz_results
ADD COLUMN IF NOT EXISTS time_spent INTEGER;

CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON public.quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_course_id ON public.quiz_results(course_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read courses" ON public.courses;
CREATE POLICY "Public can read courses"
ON public.courses FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public can read materials" ON public.materials;
CREATE POLICY "Public can read materials"
ON public.materials FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public can read quiz questions" ON public.quiz_questions;
CREATE POLICY "Public can read quiz questions"
ON public.quiz_questions FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can read own quiz results" ON public.quiz_results;
CREATE POLICY "Users can read own quiz results"
ON public.quiz_results FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz results" ON public.quiz_results;
CREATE POLICY "Users can insert own quiz results"
ON public.quiz_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
