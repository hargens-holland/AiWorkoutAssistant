import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Workout Plans API - handles storing and retrieving workout plans

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Fetch workout plans for a specific goal
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

    const { data: workoutPlans, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('goal_id', goalId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workout plans:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workout plans' },
        { status: 500 }
      );
    }

    return NextResponse.json({ workoutPlans: workoutPlans || [] });

  } catch (error) {
    console.error('Error in workout plans GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new workout plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goalId, userId, workoutPlan } = body;

    if (!goalId || !userId || !workoutPlan) {
      return NextResponse.json(
        { error: 'Goal ID, User ID, and workout plan are required' },
        { status: 400 }
      );
    }

    // Store the workout plan
    const { data: plan, error } = await supabase
      .from('workout_plans')
      .insert([{
        goal_id: goalId,
        user_id: userId,
        plan_data: workoutPlan,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating workout plan:', error);
      return NextResponse.json(
        { error: 'Failed to create workout plan' },
        { status: 500 }
      );
    }

    return NextResponse.json(plan);

  } catch (error) {
    console.error('Error in workout plans POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
