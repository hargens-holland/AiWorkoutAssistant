-- FitSmith Database Schema - Row Level Security (RLS) Policies
-- Run this in your Supabase SQL Editor AFTER running 001_initial_schema.sql

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- User profile policies
CREATE POLICY "Users can view own profile" ON public.user_profile
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own profile" ON public.user_profile
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own profile" ON public.user_profile
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own profile" ON public.user_profile
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Goals policies
CREATE POLICY "Users can view own goals" ON public.goals
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own goals" ON public.goals
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own goals" ON public.goals
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own goals" ON public.goals
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Plans policies
CREATE POLICY "Users can view own plans" ON public.plans
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own plans" ON public.plans
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own plans" ON public.plans
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own plans" ON public.plans
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Workouts policies
CREATE POLICY "Users can view own workouts" ON public.workouts
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own workouts" ON public.workouts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own workouts" ON public.workouts
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own workouts" ON public.workouts
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Meals policies
CREATE POLICY "Users can view own meals" ON public.meals
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own meals" ON public.meals
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own meals" ON public.meals
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own meals" ON public.meals
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Logs policies
CREATE POLICY "Users can view own logs" ON public.logs
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own logs" ON public.logs
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own logs" ON public.logs
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own logs" ON public.logs
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Service role bypass (for admin operations)
CREATE POLICY "Service role can do everything" ON public.users
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON public.user_profile
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON public.goals
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON public.plans
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON public.workouts
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON public.meals
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON public.logs
    FOR ALL USING (auth.role() = 'service_role');
