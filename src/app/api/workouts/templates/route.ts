import { NextRequest, NextResponse } from 'next/server';

// GET /api/workouts/templates - Get workout templates
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const goalType = searchParams.get('goalType') || 'general';
        const fitnessLevel = searchParams.get('fitnessLevel') || 'beginner';

        // Define workout templates based on goal type and fitness level
        const templates = getWorkoutTemplates(goalType, fitnessLevel);

        return NextResponse.json({
            message: 'Workout templates retrieved successfully',
            templates,
            goalType,
            fitnessLevel,
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

// Workout template generator function
function getWorkoutTemplates(goalType: string, fitnessLevel: string) {
    const templates: any = {};

    // Weight Loss Templates
    if (goalType === 'lose_weight_specific') {
        templates.cardio = {
            title: 'Weight Loss Cardio',
            focus: 'cardio',
            duration_min: 45,
            exercises: [
                {
                    name: 'Treadmill Running',
                    exercise_type: 'cardio',
                    sets: 1,
                    reps: '30 minutes',
                    notes: 'Moderate pace, maintain conversation'
                },
                {
                    name: 'Rowing Machine',
                    exercise_type: 'cardio',
                    sets: 1,
                    reps: '15 minutes',
                    notes: 'Steady pace, focus on form'
                }
            ],
            warm_up: [
                {
                    name: 'Dynamic Hip Circles',
                    exercise_type: 'stretching',
                    sets: 1,
                    reps: '10 each direction',
                    stretching_focus: ['hip_flexors', 'glutes'],
                    is_auto_included: true,
                    auto_reason: 'Prevents hip tightness from cardio'
                }
            ],
            cool_down: [
                {
                    name: 'Standing Forward Fold',
                    exercise_type: 'stretching',
                    sets: 3,
                    reps: '30 seconds',
                    stretching_focus: ['hamstrings', 'lower_back'],
                    is_auto_included: true,
                    auto_reason: 'Recovers hamstrings from cardio stress'
                }
            ]
        };

        templates.strength = {
            title: 'Weight Loss Strength',
            focus: 'full',
            duration_min: 40,
            exercises: [
                {
                    name: 'Squats',
                    exercise_type: 'strength',
                    sets: 3,
                    reps: '15-20',
                    notes: 'Body weight or light dumbbells'
                },
                {
                    name: 'Push-ups',
                    exercise_type: 'strength',
                    sets: 3,
                    reps: '10-15',
                    notes: 'Modified if needed'
                },
                {
                    name: 'Plank',
                    exercise_type: 'strength',
                    sets: 3,
                    reps: '30 seconds',
                    notes: 'Hold position'
                }
            ]
        };
    }

    // Muscle Building Templates
    if (goalType === 'build_muscle_specific') {
        templates.upper_body = {
            title: 'Muscle Building Upper Body',
            focus: 'upper',
            duration_min: 60,
            exercises: [
                {
                    name: 'Bench Press',
                    exercise_type: 'strength',
                    sets: 4,
                    reps: '8-10',
                    notes: 'Focus on form and control'
                },
                {
                    name: 'Overhead Press',
                    exercise_type: 'strength',
                    sets: 3,
                    reps: '8-10',
                    notes: 'Full range of motion'
                },
                {
                    name: 'Bent Over Rows',
                    exercise_type: 'strength',
                    sets: 3,
                    reps: '10-12',
                    notes: 'Squeeze shoulder blades'
                }
            ],
            warm_up: [
                {
                    name: 'World\'s Greatest Stretch',
                    exercise_type: 'stretching',
                    sets: 1,
                    reps: '5 each side',
                    stretching_focus: ['hip_flexors', 'hamstrings', 'chest'],
                    is_auto_included: true,
                    auto_reason: 'Comprehensive warm-up for strength training'
                }
            ]
        };

        templates.lower_body = {
            title: 'Muscle Building Lower Body',
            focus: 'lower',
            duration_min: 60,
            exercises: [
                {
                    name: 'Squats',
                    exercise_type: 'strength',
                    sets: 4,
                    reps: '8-10',
                    notes: 'Go parallel or below'
                },
                {
                    name: 'Deadlifts',
                    exercise_type: 'strength',
                    sets: 3,
                    reps: '8-10',
                    notes: 'Focus on hip hinge'
                },
                {
                    name: 'Lunges',
                    exercise_type: 'strength',
                    sets: 3,
                    reps: '10 each leg',
                    notes: 'Alternating legs'
                }
            ]
        };
    }

    // Strength Templates
    if (goalType === 'strength_specific') {
        templates.power_lifting = {
            title: 'Strength Power Lifting',
            focus: 'power',
            duration_min: 75,
            exercises: [
                {
                    name: 'Squat',
                    exercise_type: 'strength',
                    sets: 5,
                    reps: '3',
                    notes: 'Heavy weight, explosive movement'
                },
                {
                    name: 'Deadlift',
                    exercise_type: 'strength',
                    sets: 3,
                    reps: '5',
                    notes: 'Focus on hip hinge and form'
                },
                {
                    name: 'Bench Press',
                    exercise_type: 'strength',
                    sets: 5,
                    reps: '3',
                    notes: 'Control the descent'
                }
            ],
            warm_up: [
                {
                    name: 'Hip CARs',
                    exercise_type: 'stretching',
                    sets: 1,
                    reps: '5 each direction',
                    stretching_focus: ['hip_flexors', 'glutes'],
                    is_auto_included: true,
                    auto_reason: 'Improves hip mobility for power movements'
                }
            ]
        };
    }

    // Flexibility Templates
    if (goalType === 'flexibility_specific') {
        templates.flexibility = {
            title: 'Flexibility & Mobility',
            focus: 'flexibility',
            duration_min: 45,
            exercises: [
                {
                    name: 'Forward Fold',
                    exercise_type: 'stretching',
                    sets: 3,
                    reps: '60 seconds',
                    hold_time: 60,
                    stretching_focus: ['hamstrings', 'lower_back'],
                    notes: 'Relax into the stretch'
                },
                {
                    name: 'Pigeon Pose',
                    exercise_type: 'stretching',
                    sets: 2,
                    reps: '90 seconds each side',
                    hold_time: 90,
                    stretching_focus: ['hip_flexors', 'glutes'],
                    notes: 'Hold each side'
                },
                {
                    name: 'Cobra Stretch',
                    exercise_type: 'stretching',
                    sets: 3,
                    reps: '45 seconds',
                    hold_time: 45,
                    stretching_focus: ['chest', 'shoulders', 'lower_back'],
                    notes: 'Lift chest, keep hips down'
                }
            ]
        };
    }

    // General fitness template (fallback)
    if (Object.keys(templates).length === 0) {
        templates.general = {
            title: 'General Fitness',
            focus: 'full',
            duration_min: 45,
            exercises: [
                {
                    name: 'Bodyweight Squats',
                    exercise_type: 'strength',
                    sets: 3,
                    reps: '15',
                    notes: 'Good form is key'
                },
                {
                    name: 'Push-ups',
                    exercise_type: 'strength',
                    sets: 3,
                    reps: '10',
                    notes: 'Modified if needed'
                },
                {
                    name: 'Plank',
                    exercise_type: 'strength',
                    sets: 3,
                    reps: '30 seconds',
                    notes: 'Hold position'
                },
                {
                    name: 'Jumping Jacks',
                    exercise_type: 'cardio',
                    sets: 3,
                    reps: '30 seconds',
                    notes: 'Get heart rate up'
                }
            ]
        };
    }

    return templates;
}
