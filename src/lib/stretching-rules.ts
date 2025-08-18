// FitSmith Automatic Stretching Rules
// This system automatically includes appropriate stretching based on user goals

import { Exercise } from '../types/plan';
import { GoalType } from '../types/goals';

export interface StretchingRule {
    goal_type: GoalType;
    workout_focus: string;
    stretching_strategy: 'recovery' | 'mobility' | 'flexibility' | 'maintenance';
    warm_up_exercises: Exercise[];
    cool_down_exercises: Exercise[];
    recovery_day_exercises: Exercise[];
    frequency: 'every_workout' | '3x_week' | 'daily' | 'as_needed';
    duration_min: number;
    focus_areas: string[];
    notes: string;
}

// Comprehensive stretching rules for different goals and workout types
export const STRETCHING_RULES: StretchingRule[] = [
    // WEIGHT LOSS GOALS - Focus on recovery and mobility
    {
        goal_type: 'lose_weight_specific',
        workout_focus: 'cardio',
        stretching_strategy: 'recovery',
        warm_up_exercises: [
            {
                name: 'Dynamic Hip Circles',
                exercise_type: 'stretching',
                sets: 1,
                reps: '10 each direction',
                hold_time: 0,
                stretching_focus: ['hip_flexors', 'glutes'],
                is_auto_included: true,
                auto_reason: 'Prevents hip tightness from cardio sessions'
            },
            {
                name: 'Walking Knee Hugs',
                exercise_type: 'stretching',
                sets: 1,
                reps: '10 each leg',
                hold_time: 0,
                stretching_focus: ['hip_flexors', 'quadriceps'],
                is_auto_included: true,
                auto_reason: 'Warms up legs for cardio activity'
            },
            {
                name: 'Arm Circles',
                exercise_type: 'stretching',
                sets: 1,
                reps: '10 forward, 10 backward',
                hold_time: 0,
                stretching_focus: ['shoulders', 'chest'],
                is_auto_included: true,
                auto_reason: 'Prepares upper body for movement'
            }
        ],
        cool_down_exercises: [
            {
                name: 'Standing Forward Fold',
                exercise_type: 'stretching',
                sets: 3,
                reps: '30 seconds',
                hold_time: 30,
                stretching_focus: ['hamstrings', 'lower_back'],
                is_auto_included: true,
                auto_reason: 'Recovers hamstrings from cardio stress'
            },
            {
                name: 'Pigeon Pose',
                exercise_type: 'stretching',
                sets: 2,
                reps: '45 seconds each side',
                hold_time: 45,
                stretching_focus: ['hip_flexors', 'glutes'],
                is_auto_included: true,
                auto_reason: 'Releases hip tension from running/cycling'
            },
            {
                name: 'Child\'s Pose',
                exercise_type: 'stretching',
                sets: 1,
                reps: '60 seconds',
                hold_time: 60,
                stretching_focus: ['lower_back', 'shoulders'],
                is_auto_included: true,
                auto_reason: 'Gentle recovery for entire back'
            }
        ],
        recovery_day_exercises: [
            {
                name: 'Cat-Cow Stretch',
                exercise_type: 'stretching',
                sets: 3,
                reps: '10 reps',
                hold_time: 0,
                stretching_focus: ['spine', 'core'],
                is_auto_included: true,
                auto_reason: 'Mobility work for weight loss recovery'
            },
            {
                name: 'Seated Spinal Twist',
                exercise_type: 'stretching',
                sets: 2,
                reps: '30 seconds each side',
                hold_time: 30,
                stretching_focus: ['spine', 'obliques'],
                is_auto_included: true,
                auto_reason: 'Improves core mobility and digestion'
            }
        ],
        frequency: 'every_workout',
        duration_min: 15,
        focus_areas: ['hip_flexors', 'hamstrings', 'lower_back', 'shoulders'],
        notes: 'Weight loss cardio creates tightness - focus on recovery and mobility'
    },

    // MUSCLE BUILDING GOALS - Focus on recovery and flexibility maintenance
    {
        goal_type: 'build_muscle_specific',
        workout_focus: 'strength',
        stretching_strategy: 'recovery',
        warm_up_exercises: [
            {
                name: 'World\'s Greatest Stretch',
                exercise_type: 'stretching',
                sets: 1,
                reps: '5 each side',
                hold_time: 0,
                stretching_focus: ['hip_flexors', 'hamstrings', 'chest'],
                is_auto_included: true,
                auto_reason: 'Comprehensive warm-up for strength training'
            },
            {
                name: 'Thoracic Extension',
                exercise_type: 'stretching',
                sets: 1,
                reps: '10 reps',
                hold_time: 0,
                stretching_focus: ['upper_back', 'chest'],
                is_auto_included: true,
                auto_reason: 'Prepares spine for heavy lifting'
            },
            {
                name: 'Ankle Mobility',
                exercise_type: 'stretching',
                sets: 1,
                reps: '10 each ankle',
                hold_time: 0,
                stretching_focus: ['ankles', 'calves'],
                is_auto_included: true,
                auto_reason: 'Essential for squat and deadlift form'
            }
        ],
        cool_down_exercises: [
            {
                name: 'Cobra Stretch',
                exercise_type: 'stretching',
                sets: 3,
                reps: '30 seconds',
                hold_time: 30,
                stretching_focus: ['chest', 'shoulders', 'lower_back'],
                is_auto_included: true,
                auto_reason: 'Counters forward posture from pushing exercises'
            },
            {
                name: 'Hip Flexor Stretch',
                exercise_type: 'stretching',
                sets: 2,
                reps: '45 seconds each side',
                hold_time: 45,
                stretching_focus: ['hip_flexors'],
                is_auto_included: true,
                auto_reason: 'Releases tension from heavy leg work'
            },
            {
                name: 'Tricep Stretch',
                exercise_type: 'stretching',
                sets: 2,
                reps: '30 seconds each side',
                hold_time: 30,
                stretching_focus: ['triceps', 'shoulders'],
                is_auto_included: true,
                auto_reason: 'Recovers arms from pressing movements'
            }
        ],
        recovery_day_exercises: [
            {
                name: 'Foam Rolling Sequence',
                exercise_type: 'recovery',
                sets: 1,
                reps: '5 minutes',
                hold_time: 0,
                stretching_focus: ['full_body'],
                is_auto_included: true,
                auto_reason: 'Myofascial release for muscle recovery'
            },
            {
                name: 'Static Hamstring Stretch',
                exercise_type: 'stretching',
                sets: 3,
                reps: '60 seconds',
                hold_time: 60,
                stretching_focus: ['hamstrings'],
                is_auto_included: true,
                auto_reason: 'Maintains flexibility during muscle building'
            }
        ],
        frequency: 'every_workout',
        duration_min: 20,
        focus_areas: ['hip_flexors', 'chest', 'shoulders', 'hamstrings', 'ankles'],
        notes: 'Muscle building creates tightness - focus on recovery and flexibility maintenance'
    },

    // STRENGTH GOALS - Focus on joint mobility and form
    {
        goal_type: 'strength_specific',
        workout_focus: 'power',
        stretching_strategy: 'mobility',
        warm_up_exercises: [
            {
                name: 'Hip CARs (Controlled Articular Rotations)',
                exercise_type: 'stretching',
                sets: 1,
                reps: '5 each direction',
                hold_time: 0,
                stretching_focus: ['hip_flexors', 'glutes'],
                is_auto_included: true,
                auto_reason: 'Improves hip mobility for power movements'
            },
            {
                name: 'Shoulder Dislocates',
                exercise_type: 'stretching',
                sets: 1,
                reps: '10 reps',
                hold_time: 0,
                stretching_focus: ['shoulders', 'chest'],
                is_auto_included: true,
                auto_reason: 'Prepares shoulders for heavy pressing'
            },
            {
                name: 'Ankle Rockers',
                exercise_type: 'stretching',
                sets: 1,
                reps: '15 reps',
                hold_time: 0,
                stretching_focus: ['ankles', 'calves'],
                is_auto_included: true,
                auto_reason: 'Essential ankle mobility for lifts'
            }
        ],
        cool_down_exercises: [
            {
                name: 'Deep Squat Hold',
                exercise_type: 'stretching',
                sets: 3,
                reps: '30 seconds',
                hold_time: 30,
                stretching_focus: ['hip_flexors', 'ankles', 'glutes'],
                is_auto_included: true,
                auto_reason: 'Maintains squat depth and mobility'
            },
            {
                name: 'Wall Slides',
                exercise_type: 'stretching',
                sets: 2,
                reps: '10 reps',
                hold_time: 0,
                stretching_focus: ['shoulders', 'upper_back'],
                is_auto_included: true,
                auto_reason: 'Improves shoulder blade control'
            }
        ],
        recovery_day_exercises: [
            {
                name: 'Couch Stretch',
                exercise_type: 'stretching',
                sets: 2,
                reps: '60 seconds each side',
                hold_time: 60,
                stretching_focus: ['hip_flexors', 'quadriceps'],
                is_auto_included: true,
                auto_reason: 'Critical for maintaining squat form'
            },
            {
                name: 'Thoracic Extension on Foam Roller',
                exercise_type: 'stretching',
                sets: 1,
                reps: '5 minutes',
                hold_time: 0,
                stretching_focus: ['upper_back', 'chest'],
                is_auto_included: true,
                auto_reason: 'Maintains spine position for lifts'
            }
        ],
        frequency: 'every_workout',
        duration_min: 25,
        focus_areas: ['hip_flexors', 'ankles', 'shoulders', 'upper_back', 'thoracic_spine'],
        notes: 'Strength training requires optimal joint mobility for proper form'
    },

    // ENDURANCE GOALS - Focus on dynamic stretching and recovery
    {
        goal_type: 'endurance_specific',
        workout_focus: 'cardio',
        stretching_strategy: 'mobility',
        warm_up_exercises: [
            {
                name: 'Walking High Knees',
                exercise_type: 'stretching',
                sets: 1,
                reps: '20 steps',
                hold_time: 0,
                stretching_focus: ['hip_flexors', 'quadriceps'],
                is_auto_included: true,
                auto_reason: 'Dynamic warm-up for running/cycling'
            },
            {
                name: 'Leg Swings',
                exercise_type: 'stretching',
                sets: 1,
                reps: '15 each direction',
                hold_time: 0,
                stretching_focus: ['hip_flexors', 'hamstrings'],
                is_auto_included: true,
                auto_reason: 'Prepares hips for repetitive motion'
            },
            {
                name: 'Arm Swings',
                exercise_type: 'stretching',
                sets: 1,
                reps: '20 reps',
                hold_time: 0,
                stretching_focus: ['shoulders', 'chest'],
                is_auto_included: true,
                auto_reason: 'Warms up upper body for endurance'
            }
        ],
        cool_down_exercises: [
            {
                name: 'Walking Quad Stretch',
                exercise_type: 'stretching',
                sets: 1,
                reps: '10 each leg',
                hold_time: 0,
                stretching_focus: ['quadriceps', 'hip_flexors'],
                is_auto_included: true,
                auto_reason: 'Recovers quads from endurance work'
            },
            {
                name: 'Seated Forward Fold',
                exercise_type: 'stretching',
                sets: 3,
                reps: '45 seconds',
                hold_time: 45,
                stretching_focus: ['hamstrings', 'lower_back'],
                is_auto_included: true,
                auto_reason: 'Gentle recovery for tight hamstrings'
            }
        ],
        recovery_day_exercises: [
            {
                name: 'Foam Rolling Legs',
                exercise_type: 'recovery',
                sets: 1,
                reps: '10 minutes',
                hold_time: 0,
                stretching_focus: ['full_legs'],
                is_auto_included: true,
                auto_reason: 'Recovery for endurance athletes'
            },
            {
                name: 'Gentle Yoga Flow',
                exercise_type: 'stretching',
                sets: 1,
                reps: '15 minutes',
                hold_time: 0,
                stretching_focus: ['full_body'],
                is_auto_included: true,
                auto_reason: 'Active recovery and flexibility'
            }
        ],
        frequency: 'every_workout',
        duration_min: 20,
        focus_areas: ['hip_flexors', 'quadriceps', 'hamstrings', 'calves', 'shoulders'],
        notes: 'Endurance training requires dynamic warm-ups and gentle recovery'
    },

    // FLEXIBILITY GOALS - Focus on dedicated stretching sessions
    {
        goal_type: 'flexibility_specific',
        workout_focus: 'flexibility',
        stretching_strategy: 'flexibility',
        warm_up_exercises: [
            {
                name: 'Light Joint Mobility',
                exercise_type: 'stretching',
                sets: 1,
                reps: '5 minutes',
                hold_time: 0,
                stretching_focus: ['full_body'],
                is_auto_included: true,
                auto_reason: 'Gentle warm-up for flexibility work'
            }
        ],
        cool_down_exercises: [
            {
                name: 'Deep Stretching Sequence',
                exercise_type: 'stretching',
                sets: 1,
                reps: '20 minutes',
                hold_time: 0,
                stretching_focus: ['target_areas'],
                is_auto_included: true,
                auto_reason: 'Main flexibility work for goals'
            }
        ],
        recovery_day_exercises: [
            {
                name: 'Maintenance Stretching',
                exercise_type: 'stretching',
                sets: 1,
                reps: '15 minutes',
                hold_time: 0,
                stretching_focus: ['maintenance_areas'],
                is_auto_included: true,
                auto_reason: 'Maintains flexibility gains'
            }
        ],
        frequency: 'daily',
        duration_min: 30,
        focus_areas: ['user_specific'],
        notes: 'Flexibility goals require daily dedicated stretching sessions'
    }
];

// Function to get appropriate stretching for a goal and workout type
export function getStretchingForGoal(
    goal_type: GoalType,
    workout_focus: string,
    user_flexibility_level: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
): StretchingRule | null {
    const rule = STRETCHING_RULES.find(
        rule => rule.goal_type === goal_type && rule.workout_focus === workout_focus
    );

    if (!rule) {
        // Return default stretching rule
        return STRETCHING_RULES[0]; // Weight loss cardio as default
    }

    return rule;
}

// Function to automatically include stretching in a workout
export function autoIncludeStretching(
    workout: any,
    goal_type: GoalType,
    user_flexibility_level: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
): any {
    const stretchingRule = getStretchingForGoal(goal_type, workout.focus, user_flexibility_level);

    if (!stretchingRule) return workout;

    // Add warm-up exercises
    workout.warm_up = stretchingRule.warm_up_exercises;

    // Add cool-down exercises
    workout.cool_down = stretchingRule.cool_down_exercises;

    // Update workout duration
    workout.duration_min += stretchingRule.duration_min;

    // Add stretching focus areas
    workout.stretching_focus = stretchingRule.focus_areas;

    // Add goal alignment info
    workout.goal_alignment = {
        primary_goal: goal_type,
        stretching_strategy: stretchingRule.stretching_strategy,
        auto_stretching_included: true
    };

    return workout;
}
