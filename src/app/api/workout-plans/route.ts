import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goalId, userId, name, description, duration, workouts } = body;

    if (!goalId || !userId || !name || !duration || !workouts) {
      return NextResponse.json(
        { error: 'Missing required fields: goalId, userId, name, duration, workouts' },
        { status: 400 }
      );
    }

    // Create the workout plan
    const { data: workoutPlan, error: planError } = await supabase
      .from('workout_plans')
      .insert([{
        goal_id: goalId,
        user_id: userId,
        name,
        description: description || '',
        duration,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (planError) {
      console.error('Error creating workout plan:', planError);
      return NextResponse.json(
        { error: 'Failed to create workout plan' },
        { status: 500 }
      );
    }

    // Create weekly workouts
    for (const weeklyWorkout of workouts) {
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('weekly_workouts')
        .insert([{
          workout_plan_id: workoutPlan.id,
          week: weeklyWorkout.week,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (weeklyError) {
        console.error('Error creating weekly workout:', weeklyError);
        continue;
      }

      // Create daily workouts
      for (const dailyWorkout of weeklyWorkout.days) {
        const { data: dailyData, error: dailyError } = await supabase
          .from('daily_workouts')
          .insert([{
            weekly_workout_id: weeklyData.id,
            day: dailyWorkout.day,
            type: dailyWorkout.type,
            duration: dailyWorkout.duration,
            focus: dailyWorkout.focus,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (dailyError) {
          console.error('Error creating daily workout:', dailyError);
          continue;
        }

        // Create exercises
        if (dailyWorkout.exercises && dailyWorkout.exercises.length > 0) {
          const exerciseData = dailyWorkout.exercises.map(exercise => ({
            daily_workout_id: dailyData.id,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight || null,
            rest_time: exercise.restTime,
            notes: exercise.notes || null,
            created_at: new Date().toISOString()
          }));

          const { error: exerciseError } = await supabase
            .from('exercises')
            .insert(exerciseData);

          if (exerciseError) {
            console.error('Error creating exercises:', exerciseError);
          }
        }
      }
    }

    return NextResponse.json({
      message: 'Workout plan created successfully',
      workoutPlan: {
        ...workoutPlan,
        workouts
      }
    });

  } catch (error) {
    console.error('Error in workout plans POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Get the workout plan
    const { data: workoutPlan, error: planError } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('goal_id', goalId)
      .eq('user_id', userId)
      .single();

    if (planError) {
      return NextResponse.json(
        { error: 'Workout plan not found' },
        { status: 404 }
      );
    }

    // Get weekly workouts
    const { data: weeklyWorkouts, error: weeklyError } = await supabase
      .from('weekly_workouts')
      .select('*')
      .eq('workout_plan_id', workoutPlan.id)
      .order('week');

    if (weeklyError) {
      return NextResponse.json(
        { error: 'Failed to fetch weekly workouts' },
        { status: 500 }
      );
    }

    // Get daily workouts and exercises for each week
    const planWithWorkouts = {
      ...workoutPlan,
      workouts: await Promise.all(
        weeklyWorkouts.map(async (weekly) => {
          const { data: dailyWorkouts, error: dailyError } = await supabase
            .from('daily_workouts')
            .select('*')
            .eq('weekly_workout_id', weekly.id)
            .order('day');

          if (dailyError) return { ...weekly, days: [] };

          const daysWithExercises = await Promise.all(
            dailyWorkouts.map(async (daily) => {
              const { data: exercises, error: exerciseError } = await supabase
                .from('exercises')
                .select('*')
                .eq('daily_workout_id', daily.id)
                .order('created_at');

              if (exerciseError) return { ...daily, exercises: [] };

              return {
                ...daily,
                exercises: exercises.map(ex => ({
                  name: ex.name,
                  sets: ex.sets,
                  reps: ex.reps,
                  weight: ex.weight,
                  restTime: ex.rest_time,
                  notes: ex.notes
                }))
              };
            })
          );

          return {
            ...weekly,
            days: daysWithExercises
          };
        })
      )
    };

    return NextResponse.json({ workoutPlan: planWithWorkouts });

  } catch (error) {
    console.error('Error in workout plans GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
