import { NextRequest, NextResponse } from 'next/server';
import { createGoogleCalendarEvent } from '@/lib/google-calendar';

export async function POST(request: NextRequest) {
    try {
        const { plan, goalId, accessToken, refreshToken } = await request.json();

        if (!plan || !goalId) {
            return NextResponse.json({ error: 'Plan and goalId are required' }, { status: 400 });
        }

        console.log('Creating calendar events for plan:', plan);

        // Initialize Google Calendar service if access token is provided
        if (accessToken) {
            const { googleCalendarService } = await import('@/lib/google-calendar');
            console.log('Access token received:', accessToken.substring(0, 20) + '...');

            // Check if we need to refresh the token
            try {
                // First try with the current token
                googleCalendarService.setCredentials(accessToken);
                console.log('Google Calendar service initialized with access token');
            } catch (error) {
                console.log('Access token may be expired, attempting to refresh...');
                // The service will handle token refresh automatically
                throw new Error('Token refresh needed - please reconnect Google Calendar');
            }
        } else {
            console.warn('No access token provided, calendar events will not be created');
            return NextResponse.json({
                success: true,
                createdEvents: [],
                message: 'No Google Calendar access token provided. Calendar events were not created.'
            });
        }

        const createdEvents = [];
        const errors = [];

        // Helper function to get next occurrence of a day
        const getNextDayOccurrence = (dayName: string, startHour: number = 9) => {
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const targetDay = days.indexOf(dayName.toLowerCase());
            const today = new Date();
            const currentDay = today.getDay();

            let daysUntilTarget = targetDay - currentDay;
            if (daysUntilTarget <= 0) daysUntilTarget += 7; // Next week

            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + daysUntilTarget);
            targetDate.setHours(startHour, 0, 0, 0);

            return targetDate;
        };

        // Helper function to format workout description
        const formatWorkoutDescription = (workout: any) => {
            const exercises = workout.exercises.map((ex: any) =>
                `• ${ex.name}: ${ex.sets}x${ex.reps} @ ${ex.weight}\n  ${ex.notes}`
            ).join('\n\n');

            const stretching = workout.stretching.map((stretch: string) => `• ${stretch}`).join('\n');

            return `🏋️ ${workout.workout_type.toUpperCase()}\n\n💪 EXERCISES:\n${exercises}\n\n🧘 STRETCHING:\n${stretching}\n\n📝 Goal ID: ${goalId}`;
        };

        // Helper function to format meal description
        const formatMealDescription = (meal: any) => {
            const ingredients = meal.ingredients.map((ing: string) => `• ${ing}`).join('\n');
            return `🍽️ ${meal.name.toUpperCase()}\n\n📊 NUTRITION:\n• Calories: ${meal.calories}\n• Protein: ${meal.protein || 'N/A'}\n• Carbs: ${meal.carbs || 'N/A'}\n• Fat: ${meal.fat || 'N/A'}\n\n🥘 INGREDIENTS:\n${ingredients}\n\n👨‍🍳 INSTRUCTIONS:\n${meal.instructions}\n\n📝 Goal ID: ${goalId}`;
        };

        // Create workout events
        if (plan.workout_plan?.weekly_schedule) {
            for (const workout of plan.workout_plan.weekly_schedule) {
                try {
                    const startTime = getNextDayOccurrence(workout.day, 9); // 9 AM workouts
                    const endTime = new Date(startTime.getTime() + 45 * 60 * 1000); // 45 min duration

                    // Create actual Google Calendar event
                    const workoutEvent = await createGoogleCalendarEvent({
                        summary: `🏋️ ${workout.workout_type}`,
                        description: formatWorkoutDescription(workout),
                        start: startTime,
                        end: endTime,
                        goalId
                    });

                    createdEvents.push({
                        type: 'workout',
                        day: workout.day,
                        eventId: workoutEvent.id,
                        summary: `🏋️ ${workout.workout_type}`
                    });

                    console.log(`Created workout event for ${workout.day}:`, workoutEvent.id);

                } catch (error) {
                    console.error(`Error processing workout for ${workout.day}:`, error);
                    errors.push(`Workout event for ${workout.day}: ${error}`);
                }
            }
        }

        // Create meal events
        if (plan.meal_plan?.weekly_meals) {
            for (const dayMeals of plan.meal_plan.weekly_meals) {
                for (const meal of dayMeals.meals) {
                    try {
                        let startHour = 8; // Default breakfast time
                        if (meal.meal === 'lunch') startHour = 12;
                        else if (meal.meal === 'dinner') startHour = 18;
                        else if (meal.meal === 'snack') startHour = 15;

                        const startTime = getNextDayOccurrence(dayMeals.day, startHour);
                        const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 min meal

                        // Create actual Google Calendar event
                        const mealEvent = await createGoogleCalendarEvent({
                            summary: `🍽️ ${meal.name}`,
                            description: formatMealDescription(meal),
                            start: startTime,
                            end: endTime,
                            goalId
                        });

                        createdEvents.push({
                            type: 'meal',
                            day: dayMeals.day,
                            meal: meal.meal,
                            eventId: mealEvent.id,
                            summary: `🍽️ ${meal.name}`
                        });

                        console.log(`Created meal event for ${dayMeals.day} ${meal.meal}:`, mealEvent.id);

                    } catch (error) {
                        console.error(`Error processing meal for ${dayMeals.day} ${meal.meal}:`, error);
                        errors.push(`Meal event for ${dayMeals.day} ${meal.meal}: ${error}`);
                    }
                }
            }
        }

        // Create progress tracking events
        if (plan.progress_tracking) {
            try {
                // Weekly check-in (every Sunday)
                const nextSunday = getNextDayOccurrence('sunday', 10);
                const progressEvent = await createGoogleCalendarEvent({
                    summary: '📊 Weekly Progress Check-in',
                    description: `🎯 PROGRESS TRACKING:\n\n📈 Weekly Checkpoints:\n${plan.progress_tracking.weekly_checkpoints.map((cp: string) => `• ${cp}`).join('\n')}\n\n📝 Monthly Assessments:\n${plan.progress_tracking.monthly_assessments.map((ma: string) => `• ${ma}`).join('\n')}\n\n📝 Goal ID: ${goalId}`,
                    start: nextSunday,
                    end: new Date(nextSunday.getTime() + 30 * 60 * 1000),
                    goalId
                });

                createdEvents.push({
                    type: 'progress',
                    day: 'sunday',
                    eventId: progressEvent.id,
                    summary: progressEvent.summary
                });

                console.log('Created progress tracking event:', progressEvent.id);
            } catch (error) {
                console.error('Error creating progress tracking event:', error);
                errors.push(`Progress tracking event: ${error}`);
            }
        }

        return NextResponse.json({
            success: true,
            createdEvents,
            errors: errors.length > 0 ? errors : undefined,
            message: `Successfully created ${createdEvents.length} calendar events`
        });

    } catch (error) {
        console.error('Error creating calendar events:', error);
        return NextResponse.json(
            {
                error: 'Failed to create calendar events',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
