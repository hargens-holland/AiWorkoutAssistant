'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function PlanContent() {
  // Mock weekly plan data
  const weeklyPlan = {
    week_index: 1,
    workouts: [
      {
        date: '2024-01-15',
        title: 'Upper Body Strength',
        focus: 'upper',
        duration_min: 45,
        exercises: [
          { name: 'Push-ups', sets: 3, reps: '10-15' },
          { name: 'Dumbbell Rows', sets: 3, reps: '12 each arm' },
          { name: 'Shoulder Press', sets: 3, reps: '10' }
        ]
      },
      {
        date: '2024-01-17',
        title: 'Lower Body & Cardio',
        focus: 'lower',
        duration_min: 50,
        exercises: [
          { name: 'Squats', sets: 3, reps: '15' },
          { name: 'Lunges', sets: 3, reps: '10 each leg' },
          { name: 'Jumping Jacks', sets: 3, reps: '30 seconds' }
        ]
      }
    ],
    meals_day: {
      '2024-01-15': {
        breakfast: { name: 'Oatmeal with Berries', calories: 300 },
        lunch: { name: 'Grilled Chicken Salad', calories: 450 },
        dinner: { name: 'Salmon with Vegetables', calories: 550 }
      }
    },
    shopping_list: [
      { item: 'Chicken Breast', qty: '1 lb' },
      { item: 'Salmon Fillets', qty: '4 pieces' },
      { item: 'Mixed Vegetables', qty: '2 bags' },
      { item: 'Oatmeal', qty: '1 container' }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Weekly Plan</h1>
          <p className="text-gray-600">Week {weeklyPlan.week_index} - Personalized fitness and nutrition</p>
        </div>
        <Button variant="outline">
          Sync to Calendar
        </Button>
      </div>

      <Tabs defaultValue="workouts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="meals">Meals</TabsTrigger>
          <TabsTrigger value="shopping">Shopping List</TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-4">
          <div className="grid gap-4">
            {weeklyPlan.workouts.map((workout, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{workout.title}</CardTitle>
                  <CardDescription>
                    {workout.date} • {workout.focus} focus • {workout.duration_min} min
                  </CardDescription>
                </CardHeader>
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
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="meals" className="space-y-4">
          <div className="grid gap-4">
            {Object.entries(weeklyPlan.meals_day).map(([date, meals]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle>Meals for {date}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(meals).map(([mealType, meal]) => (
                      <div key={mealType} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium capitalize">{mealType}</span>
                        <span className="text-sm text-gray-600">
                          {meal.name} • {meal.calories} cal
                        </span>
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
              <CardTitle>Weekly Shopping List</CardTitle>
              <CardDescription>Everything you need for your meal plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weeklyPlan.shopping_list.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{item.item}</span>
                    <span className="text-sm text-gray-600">{item.qty}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function PlanPage() {
  return (
    <ProtectedRoute>
      <PlanContent />
    </ProtectedRoute>
  );
}
