// Enhanced Goal Types for FitSmith
// These types match the enhanced database schema

export type GoalType =
  | 'lose_weight_specific'
  | 'build_muscle_specific'
  | 'strength_specific'
  | 'endurance_specific'
  | 'skill_specific'
  | 'flexibility_specific'
  | 'maintain_fitness'
  | 'general_improvement';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'abandoned';

// Base Goal interface
export interface Goal {
  id: string;
  user_id: string;
  goal_type: GoalType;
  title: string;
  description?: string;
  target_value: GoalTargetValue;
  timeframe: GoalTimeframe;
  constraints?: GoalConstraints;
  status: GoalStatus;
  progress?: GoalProgress;
  created_at: string;
  updated_at: string;
}

// Specific Goal Target Values
export type GoalTargetValue =
  | WeightLossTarget
  | MuscleBuildingTarget
  | StrengthTarget
  | EnduranceTarget
  | SkillTarget
  | FlexibilityTarget
  | GeneralTarget;

// Weight Loss Specific
export interface WeightLossTarget {
  current_weight: number;
  target_weight: number;
  pounds_to_lose: number;
  weekly_rate: number;
  method: 'calorie_deficit' | 'intermittent_fasting' | 'keto' | 'balanced';
  measurements?: {
    waist?: number;
    chest?: number;
    arms?: number;
    hips?: number;
  };
}

// Muscle Building Specific
export interface MuscleBuildingTarget {
  current_weight: number;
  target_weight: number;
  pounds_to_gain: number;
  weekly_rate: number;
  focus_areas: string[];
  strength_targets?: {
    bench_press?: { current: number; target: number };
    squat?: { current: number; target: number };
    deadlift?: { current: number; target: number };
    overhead_press?: { current: number; target: number };
  };
}

// Strength Specific
export interface StrengthTarget {
  exercise: string;
  current_max: number;
  target_max: number;
  pounds_to_gain: number;
  weekly_increase: number;
  rep_schemes?: {
    strength?: string;
    hypertrophy?: string;
    power?: string;
  };
}

// Endurance Specific
export interface EnduranceTarget {
  activity: 'running' | 'cycling' | 'swimming' | 'rowing' | 'elliptical';
  distance?: string;
  current_time: string;
  target_time: string;
  time_to_improve: string;
  pace_targets?: {
    current_pace: string;
    target_pace: string;
  };
}

// Skill Specific
export interface SkillTarget {
  exercise: string;
  current_max: number;
  target_max: number;
  reps_to_gain: number;
  weekly_increase: number;
  progression_method: 'grease_the_groove' | 'progressive_overload' | 'pyramid' | 'ladder';
  form_standards?: {
    chest_to_ground?: boolean;
    full_extension?: boolean;
    no_rest?: boolean;
    strict_form?: boolean;
  };
}

// Flexibility Specific
export interface FlexibilityTarget {
  focus_areas: string[]; // e.g., ['hamstrings', 'hip_flexors', 'shoulders', 'lower_back']
  current_flexibility: Record<string, number>; // e.g., { 'hamstrings': 45, 'hip_flexors': 30 }
  target_flexibility: Record<string, number>; // e.g., { 'hamstrings': 90, 'hip_flexors': 60 }
  measurement_unit: 'degrees' | 'inches' | 'cm' | 'fingers_to_toes';
  stretching_frequency: 'daily' | '3x_week' | '5x_week';
  session_duration: number; // minutes
  progression_method: 'static_hold' | 'dynamic_stretching' | 'pnf' | 'yoga_based';
  specific_poses?: string[]; // e.g., ['forward_fold', 'pigeon_pose', 'cobra']
}

// General Target (for maintain_fitness and general_improvement)
export interface GeneralTarget {
  description: string;
  metrics?: Record<string, { current: number; target: number }>;
  focus_areas?: string[];
}

// Timeframe for all goals
export interface GoalTimeframe {
  start_date: string; // YYYY-MM-DD
  target_date: string; // YYYY-MM-DD
  weeks_duration: number;
  milestones?: GoalMilestone[];
  phases?: GoalPhase[];
  deload_weeks?: number[];
}

export interface GoalMilestone {
  week: number;
  target: number;
  description: string;
}

export interface GoalPhase {
  weeks: string; // e.g., "1-8", "9-16"
  focus: string;
  description?: string;
}

// Constraints for all goals
export interface GoalConstraints {
  dietary_restrictions?: string[];
  dietary_preferences?: string[];
  exercise_preferences?: string[];
  time_constraints?: string;
  equipment_available?: string[];
  gym_access?: boolean;
  training_experience?: 'beginner' | 'intermediate' | 'advanced';
  training_partner?: boolean;
  form_priority?: boolean;
  supplement_plan?: string[];
  running_surface?: string[];
  weather_conditions?: string;
  training_frequency?: string;
  rest_days?: string[];
  progression_rate?: 'conservative' | 'moderate' | 'aggressive';
  flexibility_limitations?: string[]; // e.g., ['tight_hamstrings', 'previous_injury']
  stretching_preferences?: string[]; // e.g., ['yoga', 'dynamic', 'static']
}

// Progress tracking for all goals
export interface GoalProgress {
  current_weight?: number;
  pounds_lost?: number;
  pounds_gained?: number;
  weeks_completed: number;
  on_track?: boolean;
  last_updated: string;
  current_max?: number;
  reps_gained?: number;
  time_improved?: string;
  strength_progress?: Record<string, number>;
  last_test?: string;
  measurements?: Record<string, number>;
  flexibility_progress?: Record<string, number>; // Track flexibility improvements
  stretching_consistency?: number; // Days per week stretching
}

// Goal creation helpers
export interface CreateGoalRequest {
  goal_type: GoalType;
  title: string;
  description?: string;
  target_value: GoalTargetValue;
  timeframe: GoalTimeframe;
  constraints?: GoalConstraints;
}

// Goal update helpers
export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  target_value?: GoalTargetValue;
  timeframe?: GoalTimeframe;
  constraints?: GoalConstraints;
  status?: GoalStatus;
}

// Goal progress update
export interface UpdateProgressRequest {
  progress: Partial<GoalProgress>;
}

// Goal validation
export interface GoalValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Goal analytics
export interface GoalAnalytics {
  completion_rate: number;
  average_duration: number;
  success_factors: string[];
  common_challenges: string[];
  recommended_adjustments: string[];
}
