import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/meals - Get meals for a user on specific dates
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const date = searchParams.get('date'); // YYYY-MM-DD format

        if (!userId) {
            return NextResponse.json({
                error: 'User ID is required',
                timestamp: new Date().toISOString()
            }, { status: 400 });
        }

        let query = supabaseAdmin
            .from('meals')
            .select('*')
            .eq('user_id', userId);

        if (date) {
            query = query.eq('date', date);
        }

        const { data: meals, error } = await query.order('date', { ascending: true });

        if (error) {
            return NextResponse.json({
                error: 'Failed to fetch meals',
                details: error.message,
                timestamp: new Date().toISOString()
            }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Meals retrieved successfully',
            meals: meals || [],
            count: meals?.length || 0,
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

// POST /api/meals - Create a new meal
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { user_id, date, meal_type, details } = body;

        // Validate required fields
        if (!user_id || !date || !meal_type || !details) {
            return NextResponse.json({
                error: 'Missing required fields: user_id, date, meal_type, details',
                timestamp: new Date().toISOString()
            }, { status: 400 });
        }

        // Validate meal type
        const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
        if (!validMealTypes.includes(meal_type)) {
            return NextResponse.json({
                error: 'Invalid meal type',
                validTypes: validMealTypes,
                timestamp: new Date().toISOString()
            }, { status: 400 });
        }

        // Create the meal
        const { data: meal, error } = await supabaseAdmin
            .from('meals')
            .insert({
                user_id,
                date,
                meal_type,
                details
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({
                error: 'Failed to create meal',
                details: error.message,
                timestamp: new Date().toISOString()
            }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Meal created successfully',
            meal,
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
