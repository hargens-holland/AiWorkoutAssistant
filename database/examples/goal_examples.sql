-- FitSmith Enhanced Goal Examples
-- This file shows how to create specific, measurable goals
-- Run this AFTER setting up your database schema

-- Example 1: Specific Weight Loss Goal
INSERT INTO public.goals (
    user_id,
    goal_type,
    title,
    description,
    target_value,
    timeframe,
    constraints,
    progress
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Replace with real user ID
    'lose_weight_specific',
    'Lose 20 Pounds in 4 Months',
    'I want to lose 20 pounds by summer to feel more confident and healthy',
    '{
        "current_weight": 180,
        "target_weight": 160,
        "pounds_to_lose": 20,
        "weekly_rate": 1.25,
        "method": "calorie_deficit",
        "measurements": {
            "waist": 36,
            "chest": 42,
            "arms": 14
        }
    }',
    '{
        "start_date": "2024-01-15",
        "target_date": "2024-05-15",
        "weeks_duration": 16,
        "milestones": [
            {"week": 4, "target": 175, "description": "First 5 pounds"},
            {"week": 8, "target": 170, "description": "Halfway there"},
            {"week": 12, "target": 165, "description": "Almost there"},
            {"week": 16, "target": 160, "description": "Goal achieved!"}
        ]
    }',
    '{
        "dietary_restrictions": ["no_dairy"],
        "exercise_preferences": ["cardio", "strength_training"],
        "time_constraints": "45_minutes_per_day",
        "equipment_available": ["dumbbells", "treadmill"]
    }',
    '{
        "current_weight": 175,
        "pounds_lost": 5,
        "weeks_completed": 4,
        "on_track": true,
        "last_updated": "2024-02-15"
    }'
);

-- Example 2: Specific Muscle Building Goal
INSERT INTO public.goals (
    user_id,
    goal_type,
    title,
    description,
    target_value,
    timeframe,
    constraints,
    progress
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Replace with real user ID
    'build_muscle_specific',
    'Gain 15 Pounds of Muscle in 6 Months',
    'I want to build muscle mass and strength for better athletic performance',
    '{
        "current_weight": 160,
        "target_weight": 175,
        "pounds_to_gain": 15,
        "weekly_rate": 0.6,
        "focus_areas": ["chest", "arms", "legs", "back"],
        "strength_targets": {
            "bench_press": {"current": 135, "target": 185},
            "squat": {"current": 185, "target": 225},
            "deadlift": {"current": 225, "target": 275}
        }
    }',
    '{
        "start_date": "2024-01-15",
        "target_date": "2024-07-15",
        "weeks_duration": 24,
        "phases": [
            {"weeks": "1-8", "focus": "strength_foundation"},
            {"weeks": "9-16", "focus": "hypertrophy"},
            {"weeks": "17-24", "focus": "strength_peaking"}
        ]
    }',
    '{
        "dietary_preferences": ["high_protein"],
        "supplement_plan": ["protein_powder", "creatine"],
        "gym_access": true,
        "training_experience": "intermediate"
    }',
    '{
        "current_weight": 165,
        "pounds_gained": 5,
        "weeks_completed": 8,
        "strength_progress": {
            "bench_press": 155,
            "squat": 195,
            "deadlift": 235
        }
    }'
);

-- Example 3: Specific Strength Goal
INSERT INTO public.goals (
    user_id,
    goal_type,
    title,
    description,
    target_value,
    timeframe,
    constraints,
    progress
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Replace with real user ID
    'strength_specific',
    'Bench Press 225 Pounds in 3 Months',
    'I want to achieve a 225-pound bench press for my powerlifting competition',
    '{
        "exercise": "bench_press",
        "current_max": 185,
        "target_max": 225,
        "pounds_to_gain": 40,
        "weekly_increase": 3,
        "rep_schemes": {
            "strength": "3x5",
            "hypertrophy": "4x8",
            "power": "5x3"
        }
    }',
    '{
        "start_date": "2024-01-15",
        "target_date": "2024-04-15",
        "weeks_duration": 12,
        "deload_weeks": [6, 12]
    }',
    '{
        "equipment_available": ["barbell", "bench", "rack"],
        "training_partner": true,
        "form_priority": true
    }',
    '{
        "current_max": 195,
        "pounds_gained": 10,
        "weeks_completed": 6,
        "last_test": "2024-02-15"
    }'
);

-- Example 4: Specific Endurance Goal
INSERT INTO public.goals (
    user_id,
    goal_type,
    title,
    description,
    target_value,
    timeframe,
    constraints,
    progress
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Replace with real user ID
    'endurance_specific',
    'Run a 5K in Under 25 Minutes',
    'I want to improve my running endurance and speed for better cardiovascular health',
    '{
        "activity": "running",
        "distance": "5K",
        "current_time": "32:00",
        "target_time": "25:00",
        "time_to_improve": "7:00",
        "pace_targets": {
            "current_pace": "10:20/mile",
            "target_pace": "8:03/mile"
        }
    }',
    '{
        "start_date": "2024-01-15",
        "target_date": "2024-04-15",
        "weeks_duration": 12,
        "training_phases": [
            {"weeks": "1-4", "focus": "base_mileage"},
            {"weeks": "5-8", "focus": "tempo_runs"},
            {"weeks": "9-12", "focus": "speed_work"}
        ]
    }',
    '{
        "running_surface": ["pavement", "treadmill"],
        "weather_conditions": "all_weather",
        "time_available": "45_minutes_3x_week"
    }',
    '{
        "current_time": "28:30",
        "time_improved": "3:30",
        "weeks_completed": 8,
        "last_race": "2024-02-15"
    }'
);

-- Example 5: Specific Skill Goal
INSERT INTO public.goals (
    user_id,
    goal_type,
    title,
    description,
    target_value,
    timeframe,
    constraints,
    progress
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Replace with real user ID
    'skill_specific',
    'Do 100 Pushups in One Set',
    'I want to build upper body strength and endurance through pushup progression',
    '{
        "exercise": "pushups",
        "current_max": 25,
        "target_max": 100,
        "reps_to_gain": 75,
        "weekly_increase": 5,
        "progression_method": "grease_the_groove",
        "form_standards": {
            "chest_to_ground": true,
            "full_extension": true,
            "no_rest": true
        }
    }',
    '{
        "start_date": "2024-01-15",
        "target_date": "2024-07-15",
        "weeks_duration": 24,
        "milestones": [
            {"week": 6, "target": 50, "description": "Halfway to 100"},
            {"week": 12, "target": 75, "description": "Three quarters"},
            {"week": 18, "target": 90, "description": "Almost there"},
            {"week": 24, "target": 100, "description": "Century achieved!"}
        ]
    }',
    '{
        "training_frequency": "daily",
        "rest_days": ["sunday"],
        "progression_rate": "conservative"
    }',
    '{
        "current_max": 45,
        "reps_gained": 20,
        "weeks_completed": 12,
        "last_test": "2024-02-15"
    }'
);

-- Example 6: Specific Flexibility Goal
INSERT INTO public.goals (
    user_id,
    goal_type,
    title,
    description,
    target_value,
    timeframe,
    constraints,
    progress
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Replace with real user ID
    'flexibility_specific',
    'Touch My Toes and Improve Hip Flexibility in 3 Months',
    'I want to improve my flexibility for better posture and reduced back pain',
    '{
        "focus_areas": ["hamstrings", "hip_flexors", "lower_back", "shoulders"],
        "current_flexibility": {
            "hamstrings": 45,
            "hip_flexors": 30,
            "lower_back": 20,
            "shoulders": 60
        },
        "target_flexibility": {
            "hamstrings": 90,
            "hip_flexors": 60,
            "lower_back": 45,
            "shoulders": 90
        },
        "measurement_unit": "degrees",
        "stretching_frequency": "daily",
        "session_duration": 15,
        "progression_method": "static_hold",
        "specific_poses": ["forward_fold", "pigeon_pose", "cobra", "child_pose"]
    }',
    '{
        "start_date": "2024-01-15",
        "target_date": "2024-04-15",
        "weeks_duration": 12,
        "milestones": [
            {"week": 4, "target": 60, "description": "First flexibility gains"},
            {"week": 8, "target": 75, "description": "Halfway to goal"},
            {"week": 12, "target": 90, "description": "Full flexibility achieved!"}
        ]
    }',
    '{
        "flexibility_limitations": ["tight_hamstrings", "desk_job_posture"],
        "stretching_preferences": ["yoga", "static"],
        "time_constraints": "15_minutes_daily",
        "equipment_available": ["yoga_mat", "strap"]
    }',
    '{
        "weeks_completed": 6,
        "flexibility_progress": {
            "hamstrings": 65,
            "hip_flexors": 45,
            "lower_back": 30,
            "shoulders": 75
        },
        "stretching_consistency": 5,
        "last_updated": "2024-02-15"
    }'
);
