'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProgressData {
  workoutPlan: {
    totalWorkouts: number;
    completedWorkouts: number;
    currentWeek: number;
    totalWeeks: number;
  };
  mealPlan: {
    totalDays: number;
    completedDays: number;
    currentDay: number;
    totalDays: number;
  };
  goal: {
    currentValue: number;
    targetValue: number;
    unit: string;
    progress: number;
  };
}

interface ProgressTrackerProps {
  progressData: ProgressData | null;
  isLoading?: boolean;
  onMarkWorkoutComplete?: (workoutId: string) => void;
  onMarkMealComplete?: (mealId: string) => void;
}

export function ProgressTracker({ 
  progressData, 
  isLoading = false,
  onMarkWorkoutComplete,
  onMarkMealComplete 
}: ProgressTrackerProps) {
  const [selectedMetric, setSelectedMetric] = useState<'workout' | 'meal' | 'goal'>('workout');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading progress...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!progressData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Progress Data Yet</h3>
            <p className="text-gray-600 mb-6">
              Start your fitness journey to see your progress!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const workoutProgress = (progressData.workoutPlan.completedWorkouts / progressData.workoutPlan.totalWorkouts) * 100;
  const mealProgress = (progressData.mealPlan.completedDays / progressData.mealPlan.totalDays) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Progress Tracker
        </CardTitle>
        <p className="text-gray-600">Track your fitness journey progress</p>
      </CardHeader>
      <CardContent>
        {/* Metric Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={selectedMetric === 'workout' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMetric('workout')}
          >
            🏋️ Workouts
          </Button>
          <Button
            variant={selectedMetric === 'meal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMetric('meal')}
          >
            🍽️ Meals
          </Button>
          <Button
            variant={selectedMetric === 'goal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMetric('goal')}
          >
            🎯 Goal
          </Button>
        </div>

        {/* Workout Progress */}
        {selectedMetric === 'workout' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Workout Progress</h3>
              <Badge variant="outline">
                Week {progressData.workoutPlan.currentWeek} of {progressData.workoutPlan.totalWeeks}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round(workoutProgress)}%</span>
                </div>
                <Progress value={workoutProgress} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-900">
                    {progressData.workoutPlan.completedWorkouts}
                  </div>
                  <div className="text-sm text-blue-700">Workouts Completed</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-900">
                    {progressData.workoutPlan.totalWorkouts - progressData.workoutPlan.completedWorkouts}
                  </div>
                  <div className="text-sm text-green-700">Workouts Remaining</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">This Week's Progress</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Progress 
                      value={(progressData.workoutPlan.currentWeek / progressData.workoutPlan.totalWeeks) * 100} 
                      className="h-2" 
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {progressData.workoutPlan.currentWeek}/{progressData.workoutPlan.totalWeeks} weeks
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meal Progress */}
        {selectedMetric === 'meal' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Meal Plan Progress</h3>
              <Badge variant="outline">
                Day {progressData.mealPlan.currentDay} of {progressData.mealPlan.totalDays}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round(mealProgress)}%</span>
                </div>
                <Progress value={mealProgress} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-900">
                    {progressData.mealPlan.completedDays}
                  </div>
                  <div className="text-sm text-yellow-700">Days Completed</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-900">
                    {progressData.mealPlan.totalDays - progressData.mealPlan.completedDays}
                  </div>
                  <div className="text-sm text-orange-700">Days Remaining</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Current Day Progress</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Progress 
                      value={(progressData.mealPlan.currentDay / progressData.mealPlan.totalDays) * 100} 
                      className="h-2" 
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {progressData.mealPlan.currentDay}/{progressData.mealPlan.totalDays} days
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goal Progress */}
        {selectedMetric === 'goal' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Goal Progress</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Goal Progress</span>
                  <span>{Math.round(progressData.goal.progress)}%</span>
                </div>
                <Progress value={progressData.goal.progress} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-900">
                    {progressData.goal.currentValue}
                  </div>
                  <div className="text-sm text-purple-700">Current {progressData.goal.unit}</div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-900">
                    {progressData.goal.targetValue}
                  </div>
                  <div className="text-sm text-indigo-700">Target {progressData.goal.unit}</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Remaining</h4>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {progressData.goal.targetValue - progressData.goal.currentValue} {progressData.goal.unit}
                  </div>
                  <div className="text-sm text-gray-600">to reach your goal</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-3">Quick Actions</h4>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              📝 Log Workout
            </Button>
            <Button size="sm" variant="outline">
              🍽️ Log Meal
            </Button>
            <Button size="sm" variant="outline">
              📊 View History
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
