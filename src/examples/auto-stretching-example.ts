// FitSmith Automatic Stretching Example
// This shows how stretching is automatically included based on user goals

import { autoIncludeStretching } from '../lib/stretching-rules';
import { GoalType } from '../types/goals';

// Example 1: Weight Loss Goal - Cardio Workout
const weightLossCardioWorkout = {
  date: '2024-01-15',
  title: 'Morning Cardio Session',
  focus: 'cardio',
  duration_min: 30,
  exercises: [
    {
      name: 'Running',
      exercise_type: 'cardio',
      sets: 1,
      reps: '30 minutes',
      notes: 'Moderate pace jogging'
    }
  ]
};

// Automatically include stretching for weight loss cardio
const enhancedWeightLossWorkout = autoIncludeStretching(
  weightLossCardioWorkout,
  'lose_weight_specific',
  'beginner'
);

console.log('Weight Loss Cardio Workout with Auto-Stretching:');
console.log('Original Duration:', weightLossCardioWorkout.duration_min, 'minutes');
console.log('Enhanced Duration:', enhancedWeightLossWorkout.duration_min, 'minutes');
console.log('Warm-up Exercises:', enhancedWeightLossWorkout.warm_up?.length || 0);
console.log('Cool-down Exercises:', enhancedWeightLossWorkout.cool_down?.length || 0);
console.log('Stretching Strategy:', enhancedWeightLossWorkout.goal_alignment?.stretching_strategy);

// Example 2: Muscle Building Goal - Strength Workout
const muscleBuildingStrengthWorkout = {
  date: '2024-01-16',
  title: 'Upper Body Strength',
  focus: 'strength',
  duration_min: 45,
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
    }
  ]
};

// Automatically include stretching for muscle building strength
const enhancedMuscleBuildingWorkout = autoIncludeStretching(
  muscleBuildingStrengthWorkout,
  'build_muscle_specific',
  'intermediate'
);

console.log('\nMuscle Building Strength Workout with Auto-Stretching:');
console.log('Original Duration:', muscleBuildingStrengthWorkout.duration_min, 'minutes');
console.log('Enhanced Duration:', enhancedMuscleBuildingWorkout.duration_min, 'minutes');
console.log('Warm-up Exercises:', enhancedMuscleBuildingWorkout.warm_up?.length || 0);
console.log('Cool-down Exercises:', enhancedMuscleBuildingWorkout.cool_down?.length || 0);
console.log('Stretching Strategy:', enhancedMuscleBuildingWorkout.goal_alignment?.stretching_strategy);

// Example 3: Strength Goal - Power Workout
const strengthPowerWorkout = {
  date: '2024-01-17',
  title: 'Power Lifting Session',
  focus: 'power',
  duration_min: 60,
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
    }
  ]
};

// Automatically include stretching for strength power
const enhancedStrengthWorkout = autoIncludeStretching(
  strengthPowerWorkout,
  'strength_specific',
  'advanced'
);

console.log('\nStrength Power Workout with Auto-Stretching:');
console.log('Original Duration:', strengthPowerWorkout.duration_min, 'minutes');
console.log('Enhanced Duration:', enhancedStrengthWorkout.duration_min, 'minutes');
console.log('Warm-up Exercises:', enhancedStrengthWorkout.warm_up?.length || 0);
console.log('Cool-down Exercises:', enhancedStrengthWorkout.cool_down?.length || 0);
console.log('Stretching Strategy:', enhancedStrengthWorkout.goal_alignment?.stretching_strategy);

// Example 4: Flexibility Goal - Dedicated Stretching
const flexibilityWorkout = {
  date: '2024-01-18',
  title: 'Flexibility & Mobility',
  focus: 'flexibility',
  duration_min: 30,
  exercises: [
    {
      name: 'Deep Stretching Sequence',
      exercise_type: 'stretching',
      sets: 1,
      reps: '20 minutes',
      notes: 'Focus on target flexibility areas'
    }
  ]
};

// Automatically include stretching for flexibility goals
const enhancedFlexibilityWorkout = autoIncludeStretching(
  flexibilityWorkout,
  'flexibility_specific',
  'beginner'
);

console.log('\nFlexibility Workout with Auto-Stretching:');
console.log('Original Duration:', flexibilityWorkout.duration_min, 'minutes');
console.log('Enhanced Duration:', enhancedFlexibilityWorkout.duration_min, 'minutes');
console.log('Warm-up Exercises:', enhancedFlexibilityWorkout.warm_up?.length || 0);
console.log('Cool-down Exercises:', enhancedFlexibilityWorkout.cool_down?.length || 0);
console.log('Stretching Strategy:', enhancedFlexibilityWorkout.goal_alignment?.stretching_strategy);

// Example 5: Complete Weekly Plan with Auto-Stretching
const weeklyPlan = {
  week_index: 1,
  workouts: [
    enhancedWeightLossWorkout,
    enhancedMuscleBuildingWorkout,
    enhancedStrengthWorkout,
    enhancedFlexibilityWorkout
  ],
  meals_day: {},
  shopping_list: []
};

console.log('\n=== COMPLETE WEEKLY PLAN WITH AUTO-STRETCHING ===');
console.log('Total Workouts:', weeklyPlan.workouts.length);
console.log('Total Stretching Time Added:', weeklyPlan.workouts.reduce((total, workout) => {
  const original = workout.exercises.length > 0 ? 30 : 0; // Estimate original time
  return total + (workout.duration_min - original);
}, 0), 'minutes');

// Show what stretching was automatically included
weeklyPlan.workouts.forEach((workout, index) => {
  console.log(`\nWorkout ${index + 1}: ${workout.title}`);
  console.log(`  Goal: ${workout.goal_alignment?.primary_goal}`);
  console.log(`  Stretching Strategy: ${workout.goal_alignment?.stretching_strategy}`);
  console.log(`  Warm-up: ${workout.warm_up?.length || 0} exercises`);
  console.log(`  Cool-down: ${workout.cool_down?.length || 0} exercises`);
  console.log(`  Focus Areas: ${workout.stretching_focus?.join(', ') || 'None'}`);
});

export {
  enhancedWeightLossWorkout,
  enhancedMuscleBuildingWorkout,
  enhancedStrengthWorkout,
  enhancedFlexibilityWorkout,
  weeklyPlan
};
