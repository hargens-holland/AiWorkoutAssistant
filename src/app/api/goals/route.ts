import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/goals - Get all goals for a user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({
                error: 'User ID is required',
                timestamp: new Date().toISOString()
            }, { status: 400 });
        }

        // Get all goals for the user
        const { data: goals, error } = await supabaseAdmin
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({
                error: 'Failed to fetch goals',
                details: error.message,
                timestamp: new Date().toISOString()
            }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Goals retrieved successfully',
            goals: goals || [],
            count: goals?.length || 0,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}

// POST /api/goals - Create a new goal
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            user_id,
            goal_type,
            title,
            description,
            target_value,
            timeframe,
            constraints
        } = body;

        // Validate required fields
        if (!user_id || !goal_type || !title || !target_value || !timeframe) {
            return NextResponse.json({
                error: 'Missing required fields: user_id, goal_type, title, target_value, timeframe',
                timestamp: new Date().toISOString()
            }, { status: 400 });
        }

        // Validate goal type
        const validGoalTypes = [
            'lose_weight_specific',
            'build_muscle_specific',
            'strength_specific',
            'endurance_specific',
            'skill_specific',
            'flexibility_specific',
            'maintain_fitness',
            'general_improvement'
        ];

        if (!validGoalTypes.includes(goal_type)) {
            return NextResponse.json({
                error: 'Invalid goal type',
                validTypes: validGoalTypes,
                timestamp: new Date().toISOString()
            }, { status: 400 });
        }

        // Create the goal
        const { data: goal, error } = await supabaseAdmin
            .from('goals')
            .insert({
                user_id,
                goal_type,
                title,
                description: description || '',
                target_value,
                timeframe,
                constraints: constraints || {},
                status: 'active'
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({
                error: 'Failed to create goal',
                details: error.message,
                timestamp: new Date().toISOString()
            }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Goal created successfully',
            goal,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
