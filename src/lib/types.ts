export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'flexibility' | 'general_fitness';
  target: string; // e.g., "lose 20 pounds", "bench 225", "run 5k"
  timeframe: string; // e.g., "2 months", "6 months", "1 year"
  start_date: string;
  target_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Goal-specific parameters
  current_weight?: number;
  target_weight?: number;
  current_bench?: number;
  target_bench?: number;
  current_mile_time?: string;
  target_mile_time?: string;

  // Progress tracking
  progress: number; // 0-100 percentage
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description: string;
  targetValue: string;
  achievedValue?: string;
  isCompleted: boolean;
  dueDate: string;
  completedDate?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  age?: number;
  height?: number;
  weight?: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  dietaryRestrictions: string[];
  allergies: string[];
  preferredWorkoutTime: 'morning' | 'afternoon' | 'evening';
  workoutDuration: number; // in minutes
  activeGoalId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutPlan {
  id: string;
  goalId: string;
  userId: string;
  name: string;
  description: string;
  duration: number; // weeks
  workouts: WeeklyWorkout[];
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyWorkout {
  week: number;
  days: DailyWorkout[];
}

export interface DailyWorkout {
  day: number;
  type: 'strength' | 'cardio' | 'flexibility' | 'rest';
  exercises: Exercise[];
  duration: number; // minutes
  focus: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight?: number;
  restTime: number; // seconds
  notes?: string;
}

export interface MealPlan {
  id: string;
  goalId: string;
  userId: string;
  name: string;
  description: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: DailyMeal[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyMeal {
  day: number;
  meals: Meal[];
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
  prepTime: number; // minutes
  cookTime: number; // minutes
}
