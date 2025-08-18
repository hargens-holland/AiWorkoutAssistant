'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ShoppingCart, Utensils, Dumbbell } from 'lucide-react';

export default function PlanPage() {
  // Mock weekly plan data - replace with real API data
  const weeklyPlan = {
    week_index: 1,
    workouts: [
      {
        date: '2024-01-15',
        title: 'Upper Body Strength',
        focus: 'upper' as const,
        duration_min: 45,
        exercises: [
          { name: 'Push-ups', sets: 3, reps: '10-15' },
          { name: 'Dumbbell Rows', sets: 3, reps: '12 each arm' },
          { name: 'Shoulder Press', sets: 3, reps: '10' }
        ]
      },
      {
        date: '2024-01-16',
        title: 'Lower Body Power',
        focus: 'lower' as const,
        duration_min: 50,
        exercises: [
          { name: 'Squats', sets: 4, reps: '8-12' },
          { name: 'Deadlifts', sets: 3, reps: '6-8' },
          { name: 'Lunges', sets: 3, reps: '10 each leg' }
        ]
      },
      {
        date: '2024-01-17',
        title: 'Rest Day',
        focus: 'rest' as const,
        duration_min: 0,
        exercises: []
      }
    ],
    meals_day: {
      '2024-01-15': {
        target_kcal: 2000,
        totals: { kcal: 1950, p: 150, c: 200, f: 65 },
        meals: [
          {
            name: 'Protein Oatmeal Bowl',
            ingredients: [
              { item: 'Oats', qty: '1 cup', kcal: 150, p: 6, c: 27, f: 3 },
              { item: 'Protein Powder', qty: '1 scoop', kcal: 120, p: 24, c: 3, f: 1 }
            ],
            macros: { kcal: 270, p: 30, c: 30, f: 4 }
          }
        ]
      }
    },
    shopping_list: [
      { item: 'Chicken Breast', qty: '2 lbs' },
      { item: 'Brown Rice', qty: '1 bag' },
      { item: 'Broccoli', qty: '2 heads' },
      { item: 'Sweet Potatoes', qty: '4 medium' }
    ]
  };

  const handleSyncToCalendar = async () => {
    // TODO: Implement Google Calendar sync
    console.log('Syncing to calendar...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weekly Plan</h1>
          <p className="text-gray-600">Week {weeklyPlan.week_index} • {new Date().toLocaleDateString()}</p>
        </div>
        <Button onClick={handleSyncToCalendar} className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Sync to Calendar
        </Button>
      </div>

      <Tabs defaultValue="workouts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workouts" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Workouts
          </TabsTrigger>
          <TabsTrigger value="meals" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Meals
          </TabsTrigger>
          <TabsTrigger value="shopping" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Shopping List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-4">
          <div className="grid gap-4">
            {weeklyPlan.workouts.map((workout, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {workout.title}
                        <span className="text-sm font-normal text-gray-500">
                          ({workout.focus})
                        </span>
                      </CardTitle>
                      <CardDescription>
                        {new Date(workout.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })} • {workout.duration_min} minutes
                      </CardDescription>
                    </div>
                    {workout.focus !== 'rest' && (
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    )}
                  </div>
                </CardHeader>
                {workout.focus !== 'rest' && (
                  <CardContent>
                    <div className="space-y-2">
                      {workout.exercises.map((exercise, exIndex) => (
                        <div key={exIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">{exercise.name}</span>
                          <span className="text-sm text-gray-600">
                            {exercise.sets} sets × {exercise.reps}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="meals" className="space-y-4">
          <div className="grid gap-4">
            {Object.entries(weeklyPlan.meals_day).map(([date, dayMeals]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle>
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </CardTitle>
                  <CardDescription>
                    Target: {dayMeals.target_kcal} kcal • 
                    Total: {dayMeals.totals.kcal} kcal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dayMeals.meals.map((meal, mealIndex) => (
                      <div key={mealIndex} className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{meal.name}</h4>
                          <span className="text-sm text-gray-600">
                            {meal.macros.kcal} kcal
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          P: {meal.macros.p}g • C: {meal.macros.c}g • F: {meal.macros.f}g
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shopping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shopping List</CardTitle>
              <CardDescription>Everything you need for this week's meals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weeklyPlan.shopping_list.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <input type="checkbox" className="rounded" />
                    <span className="flex-1">{item.item}</span>
                    <span className="text-sm text-gray-600">{item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  Export List
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
