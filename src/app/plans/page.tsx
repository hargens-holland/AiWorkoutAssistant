'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { WorkoutPlanViewer } from '@/components/WorkoutPlanViewer';
import { MealPlanViewer } from '@/components/MealPlanViewer';
import { ProgressTracker } from '@/components/ProgressTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGoal } from '@/contexts/GoalContext';
import { Badge } from '@/components/ui/badge';

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  workouts: Array<{
    week: number;
    days: Array<{
      day: number;
      type: 'strength' | 'cardio' | 'flexibility' | 'rest';
      duration: number;
      focus: string;
      exercises: Array<{
        name: string;
        sets: number;
        reps: string;
        weight?: number;
        restTime: number;
        notes?: string;
      }>;
    }>;
  }>;
}

interface MealPlan {
  id: string;
  name: string;
  description: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: Array<{
    day: number;
    meals: Array<{
      type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      prepTime: number;
      cookTime: number;
      ingredients: string[];
      instructions: string[];
    }>;
  }>;
}

export default function PlansPage() {
  const { data: session } = useSession();
  const { activeGoal } = useGoal();
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('workout');

  useEffect(() => {
    if (session?.user?.id && activeGoal) {
      fetchPlans();
    } else {
      setIsLoading(false);
    }
  }, [session?.user?.id, activeGoal]);

  const fetchPlans = async () => {
    if (!session?.user?.id || !activeGoal) return;

    setIsLoading(true);
    try {
      // Fetch workout plan
      const workoutResponse = await fetch(
        `/api/workout-plans?goalId=${activeGoal.id}&userId=${session.user.id}`
      );
      if (workoutResponse.ok) {
        const workoutData = await workoutResponse.json();
        setWorkoutPlan(workoutData.workoutPlan);
      }

      // Fetch meal plan
      const mealResponse = await fetch(
        `/api/meal-plans?goalId=${activeGoal.id}&userId=${session.user.id}`
      );
      if (mealResponse.ok) {
        const mealData = await mealResponse.json();
        setMealPlan(mealData.mealPlan);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockProgressData = () => {
    if (!workoutPlan || !mealPlan || !activeGoal) return null;

    // Calculate workout progress
    const totalWorkouts = workoutPlan.workouts.reduce(
      (total, week) => total + week.days.filter(day => day.type !== 'rest').length,
      0
    );
    const completedWorkouts = Math.floor(totalWorkouts * 0.3); // Mock 30% completion

    // Calculate meal progress
    const totalDays = mealPlan.meals.length;
    const completedDays = Math.floor(totalDays * 0.4); // Mock 40% completion

    // Calculate goal progress based on goal type
    let goalProgress = 0;
    let currentValue = 0;
    let targetValue = 0;
    let unit = '';

    if (activeGoal.type === 'weight_loss' && activeGoal.current_weight && activeGoal.target_weight) {
      currentValue = activeGoal.current_weight;
      targetValue = activeGoal.target_weight;
      unit = 'lbs';
      const totalWeightToLose = activeGoal.current_weight - activeGoal.target_weight;
      const weightLost = Math.abs(totalWeightToLose * 0.25); // Mock 25% progress
      goalProgress = Math.min((weightLost / Math.abs(totalWeightToLose)) * 100, 100);
    } else if (activeGoal.type === 'strength' && activeGoal.current_bench && activeGoal.target_bench) {
      currentValue = activeGoal.current_bench;
      targetValue = activeGoal.target_bench;
      unit = 'lbs';
      goalProgress = Math.min(((currentValue / targetValue) * 100), 100);
    } else {
      goalProgress = 25; // Default progress
      currentValue = 25;
      targetValue = 100;
      unit = '%';
    }

    return {
      workoutPlan: {
        totalWorkouts,
        completedWorkouts,
        currentWeek: 1,
        totalWeeks: workoutPlan.duration
      },
      mealPlan: {
        totalDays,
        completedDays,
        currentDay: 1,
        totalDays
      },
      goal: {
        currentValue,
        targetValue,
        unit,
        progress: goalProgress
      }
    };
  };

  if (!session?.user?.id) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Fitness Plans
            </h1>
            <p className="text-gray-600">
              {activeGoal 
                ? `Personalized plans for: ${activeGoal.title}`
                : 'Create a goal to get your personalized plans'
              }
            </p>
          </div>

          {!activeGoal ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Active Goal
                </h3>
                <p className="text-gray-600 mb-6">
                  Create a goal first to get your personalized workout and meal plans!
                </p>
                <Button onClick={() => window.location.href = '/dashboard'}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Plans Section */}
              <div className="lg:col-span-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="workout">🏋️ Workout Plan</TabsTrigger>
                    <TabsTrigger value="meal">🍽️ Meal Plan</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="workout" className="mt-6">
                    <WorkoutPlanViewer 
                      workoutPlan={workoutPlan} 
                      isLoading={isLoading} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="meal" className="mt-6">
                    <MealPlanViewer 
                      mealPlan={mealPlan} 
                      isLoading={isLoading} 
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Progress Sidebar */}
              <div className="space-y-6">
                <ProgressTracker 
                  progressData={generateMockProgressData()}
                  isLoading={isLoading}
                />

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => window.location.href = '/calendar'}
                    >
                      📅 View Calendar
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => window.location.href = '/chat'}
                    >
                      💬 Chat with AI
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => window.location.href = '/dashboard'}
                    >
                      📊 Update Progress
                    </Button>
                  </CardContent>
                </Card>

                {/* Plan Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Workout Plan</span>
                      <Badge variant={workoutPlan ? 'default' : 'secondary'}>
                        {workoutPlan ? 'Active' : 'Not Created'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Meal Plan</span>
                      <Badge variant={mealPlan ? 'default' : 'secondary'}>
                        {mealPlan ? 'Active' : 'Not Created'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Calendar Sync</span>
                      <Badge variant="outline">Connected</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
