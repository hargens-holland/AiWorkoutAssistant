-- Fix user_id columns to accept email addresses instead of UUIDs
-- This migration updates the schema to work with email-based authentication

-- Update user_profile table
ALTER TABLE public.user_profile 
ALTER COLUMN user_id TYPE TEXT;

-- Update goals table
ALTER TABLE public.goals 
ALTER COLUMN user_id TYPE TEXT;

-- Update plans table
ALTER TABLE public.plans 
ALTER COLUMN user_id TYPE TEXT;

-- Update workouts table
ALTER TABLE public.workouts 
ALTER COLUMN user_id TYPE TEXT;

-- Update meals table
ALTER TABLE public.meals 
ALTER COLUMN user_id TYPE TEXT;

-- Update logs table
ALTER TABLE public.logs 
ALTER COLUMN user_id TYPE TEXT;

-- Update users table (if it exists and has user_id)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'user_id') THEN
        ALTER TABLE public.users ALTER COLUMN user_id TYPE TEXT;
    END IF;
END $$;

-- Add indexes for better performance with text user_ids
CREATE INDEX IF NOT EXISTS idx_user_profile_user_id ON public.user_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_plans_user_id ON public.plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON public.logs(user_id);

-- Update RLS policies to work with text user_ids
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profile;
CREATE POLICY "Users can view own profile" ON public.user_profile
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;
CREATE POLICY "Users can view own goals" ON public.goals
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "Users can view own plans" ON public.plans;
CREATE POLICY "Users can view own plans" ON public.plans
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "Users can view own workouts" ON public.workouts;
CREATE POLICY "Users can view own workouts" ON public.workouts
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "Users can view own meals" ON public.meals;
CREATE POLICY "Users can view own meals" ON public.meals
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "Users can view own logs" ON public.logs;
CREATE POLICY "Users can view own logs" ON public.logs
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'email');
