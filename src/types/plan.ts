export type Exercise = {
  name: string;
  sets: number;
  reps: string | number;
  rpe?: string | number;
  rest_sec?: number;
  notes?: string;
  exercise_type?: 'strength' | 'cardio' | 'stretching' | 'flexibility' | 'recovery';
  stretching_focus?: string[]; // e.g., ['hamstrings', 'hip_flexors']
  hold_time?: number; // seconds for stretching exercises
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  is_auto_included?: boolean; // Whether this was automatically added by AI
  auto_reason?: string; // Why this exercise was automatically included
};

export type WorkoutDay = {
  date: string; // YYYY-MM-DD
  title: string;
  focus: 'upper' | 'lower' | 'full' | 'push' | 'pull' | 'legs' | 'cardio' | 'rest' | 'stretching' | 'flexibility' | 'recovery';
  duration_min: number;
  exercises: Exercise[];
  stretching_focus?: string[]; // Array of stretching focus areas
  warm_up?: Exercise[]; // Warm-up exercises (auto-included)
  cool_down?: Exercise[]; // Cool-down and stretching (auto-included)
  notes?: string;
  goal_alignment?: {
    primary_goal: string;
    stretching_strategy: 'recovery' | 'mobility' | 'flexibility' | 'maintenance';
    auto_stretching_included: boolean;
  };
};

export type MealEntry = {
  name: string;
  ingredients: { item: string; qty: string; kcal?: number; p?: number; c?: number; f?: number; }[];
  macros: { kcal: number; p: number; c: number; f: number; };
};

export type DayMeals = {
  target_kcal: number;
  totals: { kcal: number; p: number; c: number; f: number; };
  meals: MealEntry[];
};

export type WeeklyPlan = {
  week_index: number;
  workouts: WorkoutDay[];
  meals_day: Record<string, DayMeals>; // keyed by YYYY-MM-DD
  shopping_list: { item: string; qty: string }[];
  stretching_schedule?: {
    daily_routine?: Exercise[];
    focus_areas?: string[];
    total_stretching_time?: number; // minutes per week
    auto_included_stretching?: {
      goal_based: Exercise[];
      recovery_based: Exercise[];
      maintenance_based: Exercise[];
    };
  };
  auto_stretching_rules?: {
    weight_loss_goals: string[];
    muscle_building_goals: string[];
    strength_goals: string[];
    endurance_goals: string[];
    flexibility_goals: string[];
  };
};
