import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const { data: goals, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching goals:', error);
            return NextResponse.json(
                { error: 'Failed to fetch goals' },
                { status: 500 }
            );
        }

        return NextResponse.json({ goals: goals || [] });

    } catch (error) {
        console.error('Error in goals GET:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, title, description, type, target, timeframe, startDate, targetDate, isActive, currentWeight, targetWeight, currentBench, targetBench, currentMileTime, targetMileTime } = body;

        if (!userId || !title || !type || !target || !timeframe || !startDate || !targetDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // If this is the first goal or explicitly set as active, deactivate all other goals
        if (isActive) {
            await supabase
                .from('goals')
                .update({ is_active: false })
                .eq('user_id', userId);
        }

        const goalData = {
            user_id: userId,
            title,
            description: description || '',
            type,
            target,
            timeframe,
            start_date: startDate,
            target_date: targetDate,
            is_active: isActive || false,
            current_weight: currentWeight || null,
            target_weight: targetWeight || null,
            current_bench: currentBench || null,
            target_bench: targetBench || null,
            current_mile_time: currentMileTime || null,
            target_mile_time: targetMileTime || null,
            progress: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data: goal, error } = await supabase
            .from('goals')
            .insert([goalData])
            .select()
            .single();

        if (error) {
            console.error('Error creating goal:', error);
            return NextResponse.json(
                { error: 'Failed to create goal' },
                { status: 500 }
            );
        }

        return NextResponse.json(goal);

    } catch (error) {
        console.error('Error in goals POST:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
