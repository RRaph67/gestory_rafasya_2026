-- Migration to create game_scores table for leaderboard
CREATE TABLE IF NOT EXISTS public.game_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    accuracy NUMERIC DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

-- Policy to allow public inserts
DROP POLICY IF EXISTS "Anyone can insert game scores" ON public.game_scores;
CREATE POLICY "Anyone can insert game scores"
ON public.game_scores FOR INSERT
WITH CHECK (true);

-- Policy to allow public select
DROP POLICY IF EXISTS "Anyone can read game scores" ON public.game_scores;
CREATE POLICY "Anyone can read game scores"
ON public.game_scores FOR SELECT
USING (true);
