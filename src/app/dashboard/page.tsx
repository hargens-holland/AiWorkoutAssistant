'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Target, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock data - replace with real data from API
  const todayWorkout = {
    title: "Upper Body Strength",
    focus: "upper",
    duration: 45,
    exercises: [
      { name: "Push-ups", sets: 3, reps: "10-15" },
      { name: "Dumbbell Rows", sets: 3, reps: "12 each arm" },
      { name: "Shoulder Press", sets: 3, reps: "10" }
    ]
  };

  const todayMeals = {
    target_kcal: 2000,
    current_kcal: 0,
    meals: ["Breakfast", "Lunch", "Dinner", "Snacks"]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Button asChild>
          <Link href="/plan">View Full Plan</Link>
        </Button>
      </div>

      {/* Today's Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Workout</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayWorkout.title}</div>
            <p className="text-xs text-muted-foreground">
              {todayWorkout.duration} min • {todayWorkout.focus} focus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayMeals.current_kcal}</div>
            <p className="text-xs text-muted-foreground">
              of {todayMeals.target_kcal} target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Workout</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tomorrow</div>
            <p className="text-xs text-muted-foreground">
              Lower Body • 50 min
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Today's Workout */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Workout</CardTitle>
                <CardDescription>{todayWorkout.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayWorkout.exercises.map((exercise, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{exercise.name}</span>
                      <span className="text-sm text-gray-600">
                        {exercise.sets} sets × {exercise.reps}
                      </span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/plan">View Full Workout</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Today's Meals */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Meals</CardTitle>
                <CardDescription>Nutrition Plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayMeals.meals.map((meal, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{meal}</span>
                      <span className="text-sm text-gray-600">Plan ready</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href="/plan">View Meal Details</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
              <CardDescription>Your plan for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-sm">{day}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {index % 3 === 0 ? 'Upper' : index % 3 === 1 ? 'Lower' : 'Rest'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>Monitor your fitness journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Weight Goal</span>
                  <span className="text-sm text-gray-600">70kg → 65kg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Workout Consistency</span>
                  <span className="text-sm text-gray-600">4/7 days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '57%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <Link href="/chat">Modify Plan</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/plan">View Full Plan</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/settings">Settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
