export type Exercise = {
  name: string;
  sets: number;
  reps: string | number;
  rpe?: string | number;
  rest_sec?: number;
  notes?: string;
};

export type WorkoutDay = {
  date: string; // YYYY-MM-DD
  title: string;
  focus: 'upper' | 'lower' | 'full' | 'push' | 'pull' | 'legs' | 'cardio' | 'rest';
  duration_min: number;
  exercises: Exercise[];
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
};
