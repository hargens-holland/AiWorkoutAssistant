import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      goalId, 
      userId, 
      accessToken, 
      refreshToken, 
      workoutPlan, 
      mealPlan, 
      startDate 
    } = body;

    if (!goalId || !userId || !accessToken || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields: goalId, userId, accessToken, startDate' },
        { status: 400 }
      );
    }

    if (!workoutPlan && !mealPlan) {
      return NextResponse.json(
        { error: 'At least one plan (workout or meal) is required' },
        { status: 400 }
      );
    }

    const calendarService = new GoogleCalendarService();
    calendarService.setCredentials(accessToken, refreshToken);

    const createdEvents = [];
    const startDateObj = new Date(startDate);

    // Create workout events
    if (workoutPlan && workoutPlan.workouts) {
      for (const weeklyWorkout of workoutPlan.workouts) {
        for (const dailyWorkout of weeklyWorkout.days) {
          if (dailyWorkout.type === 'rest') continue;

          // Calculate the date for this workout
          const workoutDate = new Date(startDateObj);
          workoutDate.setDate(startDateObj.getDate() + (weeklyWorkout.week - 1) * 7 + dailyWorkout.day - 1);

          // Create workout event
          const workoutEvent = {
            title: `${dailyWorkout.type.charAt(0).toUpperCase() + dailyWorkout.type.slice(1)}: ${dailyWorkout.focus}`,
            date: workoutDate.toISOString().split('T')[0],
            startTime: '09:00', // Default time, can be customized
            duration: dailyWorkout.duration,
            workoutType: dailyWorkout.type,
            exercises: dailyWorkout.exercises || [],
            focus: dailyWorkout.focus
          };

          try {
            const eventId = await calendarService.createWorkoutEvent(workoutEvent);
            createdEvents.push({
              type: 'workout',
              eventId,
              date: workoutDate.toISOString().split('T')[0],
              title: workoutEvent.title
            });
          } catch (error) {
            console.error('Error creating workout event:', error);
          }
        }
      }
    }

    // Create meal events
    if (mealPlan && mealPlan.meals) {
      for (const dailyMeal of mealPlan.meals) {
        const mealDate = new Date(startDateObj);
        mealDate.setDate(startDateObj.getDate() + dailyMeal.day - 1);

        // Create meal events for each meal type
        for (const meal of dailyMeal.meals) {
          const mealEvent = {
            title: meal.name,
            date: mealDate.toISOString().split('T')[0],
            startTime: getMealTime(meal.type),
            mealType: meal.type,
            calories: meal.calories,
            macros: {
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fat
            },
            ingredients: meal.ingredients || [],
            instructions: meal.instructions || []
          };

          try {
            const eventId = await calendarService.createMealEvent(mealEvent);
            createdEvents.push({
              type: 'meal',
              eventId,
              date: mealDate.toISOString().split('T')[0],
              title: mealEvent.title
            });
          } catch (error) {
            console.error('Error creating meal event:', error);
          }
        }
      }
    }

    return NextResponse.json({
      message: 'Calendar events created successfully',
      createdEvents,
      totalEvents: createdEvents.length
    });

  } catch (error) {
    console.error('Error creating calendar events from plans:', error);
    return NextResponse.json(
      { error: 'Failed to create calendar events' },
      { status: 500 }
    );
  }
}

// Helper function to get meal times
function getMealTime(mealType: string): string {
  switch (mealType) {
    case 'breakfast': return '08:00';
    case 'lunch': return '12:00';
    case 'dinner': return '18:00';
    case 'snack': return '15:00';
    default: return '12:00';
  }
}
