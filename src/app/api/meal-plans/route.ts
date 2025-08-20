import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Meal Plans API - handles storing and retrieving meal plans

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Fetch meal plans for a specific goal
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const goalId = searchParams.get('goalId');
        const userId = searchParams.get('userId');

        if (!goalId || !userId) {
            return NextResponse.json(
                { error: 'Goal ID and User ID are required' },
                { status: 400 }
            );
        }

        const { data: mealPlans, error } = await supabase
            .from('meal_plans')
            .select('*')
            .eq('goal_id', goalId)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching meal plans:', error);
            return NextResponse.json(
                { error: 'Failed to fetch meal plans' },
                { status: 500 }
            );
        }

        return NextResponse.json({ mealPlans: mealPlans || [] });

    } catch (error) {
        console.error('Error in meal plans GET:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST: Create a new meal plan
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { goalId, userId, mealPlan } = body;

        if (!goalId || !userId || !mealPlan) {
            return NextResponse.json(
                { error: 'Goal ID, User ID, and meal plan are required' },
                { status: 400 }
            );
        }

        // Store the meal plan
        const { data: plan, error } = await supabase
            .from('meal_plans')
            .insert([{
                goal_id: goalId,
                user_id: userId,
                plan_data: mealPlan,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating meal plan:', error);
            return NextResponse.json(
                { error: 'Failed to create meal plan' },
                { status: 500 }
            );
        }

        return NextResponse.json(plan);

    } catch (error) {
        console.error('Error in meal plans POST:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
