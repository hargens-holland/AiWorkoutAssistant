-- Create missing tables for FitSmith app

-- Create workout_plans table
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    plan_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    plan_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for workout_plans
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout plans" ON public.workout_plans
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own workout plans" ON public.workout_plans
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own workout plans" ON public.workout_plans
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own workout plans" ON public.workout_plans
    FOR DELETE USING (auth.uid()::text = user_id);

-- Add RLS policies for meal_plans
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own meal plans" ON public.meal_plans
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own meal plans" ON public.meal_plans
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own meal plans" ON public.meal_plans
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own meal plans" ON public.meal_plans
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workout_plans_goal_id ON public.workout_plans(goal_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id ON public.workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_goal_id ON public.meal_plans(goal_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON public.meal_plans(user_id);
