'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight?: number;
  restTime: number;
  notes?: string;
}

interface DailyWorkout {
  day: number;
  type: 'strength' | 'cardio' | 'flexibility' | 'rest';
  duration: number;
  focus: string;
  exercises: Exercise[];
}

interface WeeklyWorkout {
  week: number;
  days: DailyWorkout[];
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  workouts: WeeklyWorkout[];
}

interface WorkoutPlanViewerProps {
  workoutPlan: WorkoutPlan | null;
  isLoading?: boolean;
}

export function WorkoutPlanViewer({ workoutPlan, isLoading = false }: WorkoutPlanViewerProps) {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workout Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading workout plan...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!workoutPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workout Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏋️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Workout Plan Yet</h3>
            <p className="text-gray-600 mb-6">
              Your AI agent will create a personalized workout plan based on your goal!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentWeek = workoutPlan.workouts.find(w => w.week === selectedWeek);
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDayExpansion = (day: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case 'strength': return 'bg-red-100 text-red-800';
      case 'cardio': return 'bg-blue-100 text-blue-800';
      case 'flexibility': return 'bg-green-100 text-green-800';
      case 'rest': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkoutTypeIcon = (type: string) => {
    switch (type) {
      case 'strength': return '💪';
      case 'cardio': return '🏃';
      case 'flexibility': return '🧘';
      case 'rest': return '😴';
      default: return '🏋️';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏋️ {workoutPlan.name}
        </CardTitle>
        <p className="text-gray-600">{workoutPlan.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Duration: {workoutPlan.duration} weeks</span>
          <span>Focus: {currentWeek?.days[0]?.focus || 'General Fitness'}</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Week Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {workoutPlan.workouts.map((week) => (
            <Button
              key={week.week}
              variant={selectedWeek === week.week ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedWeek(week.week)}
            >
              Week {week.week}
            </Button>
          ))}
        </div>

        {/* Current Week Display */}
        {currentWeek && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Week {selectedWeek} - {currentWeek.days.length} days
            </h3>

            <div className="grid gap-4">
              {currentWeek.days.map((dailyWorkout, index) => (
                <Card key={index} className="border-l-4 border-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getWorkoutTypeIcon(dailyWorkout.type)}</span>
                        <div>
                          <h4 className="font-semibold">
                            Day {dailyWorkout.day} - {weekDays[dailyWorkout.day - 1]}
                          </h4>
                          <p className="text-sm text-gray-600">{dailyWorkout.focus}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getWorkoutTypeColor(dailyWorkout.type)}>
                          {dailyWorkout.type.charAt(0).toUpperCase() + dailyWorkout.type.slice(1)}
                        </Badge>
                        <Badge variant="outline">{dailyWorkout.duration} min</Badge>
                        {dailyWorkout.exercises.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDayExpansion(dailyWorkout.day)}
                          >
                            {expandedDays.has(dailyWorkout.day) ? 'Hide' : 'Show'} Exercises
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {/* Exercises (expandable) */}
                  {expandedDays.has(dailyWorkout.day) && dailyWorkout.exercises.length > 0 && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-800">Exercises:</h5>
                        {dailyWorkout.exercises.map((exercise, exIndex) => (
                          <div key={exIndex} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h6 className="font-medium">{exercise.name}</h6>
                              <div className="flex gap-2 text-sm">
                                <Badge variant="secondary">{exercise.sets} sets</Badge>
                                <Badge variant="secondary">{exercise.reps} reps</Badge>
                                {exercise.weight && (
                                  <Badge variant="secondary">{exercise.weight} lbs</Badge>
                                )}
                                <Badge variant="outline">{exercise.restTime}s rest</Badge>
                              </div>
                            </div>
                            {exercise.notes && (
                              <p className="text-sm text-gray-600">{exercise.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}

                  {/* Rest Day Message */}
                  {dailyWorkout.type === 'rest' && (
                    <CardContent className="pt-0">
                      <div className="text-center py-4 text-gray-500">
                        <div className="text-4xl mb-2">😴</div>
                        <p>Rest and Recovery Day</p>
                        <p className="text-sm">Focus on stretching, hydration, and rest</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
