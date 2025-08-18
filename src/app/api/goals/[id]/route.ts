import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: goalId } = await params;
    const body = await request.json();
    const { title, description, type, target, timeframe, startDate, targetDate, isActive, currentWeight, targetWeight, currentBench, targetBench, currentMileTime, targetMileTime } = body;

    // If this goal is being set as active, deactivate all other goals for the user
    if (isActive) {
      const { data: currentGoal } = await supabase
        .from('goals')
        .select('user_id')
        .eq('id', goalId)
        .single();

      if (currentGoal?.user_id) {
        await supabase
          .from('goals')
          .update({ is_active: false })
          .eq('user_id', currentGoal.user_id);
      }
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (target !== undefined) updateData.target = target;
    if (timeframe !== undefined) updateData.timeframe = timeframe;
    if (startDate !== undefined) updateData.start_date = startDate;
    if (targetDate !== undefined) updateData.target_date = targetDate;
    if (isActive !== undefined) updateData.is_active = isActive;
    if (currentWeight !== undefined) updateData.current_weight = currentWeight;
    if (targetWeight !== undefined) updateData.target_weight = targetWeight;
    if (currentBench !== undefined) updateData.current_bench = currentBench;
    if (targetBench !== undefined) updateData.target_bench = targetBench;
    if (currentMileTime !== undefined) updateData.current_mile_time = currentMileTime;
    if (targetMileTime !== undefined) updateData.target_mile_time = targetMileTime;

    const { data: goal, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', goalId)
      .select()
      .single();

    if (error) {
      console.error('Error updating goal:', error);
      return NextResponse.json(
        { error: 'Failed to update goal' },
        { status: 500 }
      );
    }

    return NextResponse.json(goal);

  } catch (error) {
    console.error('Error in goal PUT:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: goalId } = await params;

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error('Error deleting goal:', error);
      return NextResponse.json(
        { error: 'Failed to delete goal' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Goal deleted successfully' });

  } catch (error) {
    console.error('Error in goal DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
