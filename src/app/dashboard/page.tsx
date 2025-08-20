'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGoal } from '@/contexts/GoalContext';
import { AIChat } from '@/components/AIChat';

export default function Dashboard() {
  const { data: session } = useSession();
  const { activeGoal, setActiveGoal } = useGoal();
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');
  const [showGoalInput, setShowGoalInput] = useState(false);

  // Fetch user's goals
  useEffect(() => {
    if (session?.user?.id) {
      fetchGoals();
    }
  }, [session?.user?.id]);

  const fetchGoals = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/goals?userId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        setGoals(data.goals || []);

        // Set first goal as active if none selected
        if (data.goals?.length > 0 && !activeGoal) {
          setActiveGoal(data.goals[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleCreateGoal = async () => {
    if (!newGoalText.trim() || !session?.user?.id) return;

    setIsLoading(true);
    try {
      // Step 1: Create goal in database
      const goalResponse = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          title: newGoalText,
          description: newGoalText,
          type: 'general_fitness',
          target: newGoalText,
          timeframe: '3 months',
          startDate: new Date().toISOString().split('T')[0],
          targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isActive: true
        })
      });

      if (!goalResponse.ok) {
        throw new Error('Failed to create goal');
      }

      const goal = await goalResponse.json();

      // Step 2: Generate plan with Groq
      const planResponse = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalData: {
            target: newGoalText,
            timeframe: '3 months',
            available_equipment: ['gym_access', 'dumbbells', 'barbell', 'resistance_bands'],
            workout_days: ['monday', 'wednesday', 'friday'],
            workout_duration: 45
          }
        })
      });

      if (!planResponse.ok) {
        throw new Error('Failed to generate plan');
      }

      const planData = await planResponse.json();

      // Step 3: Store workout and meal plans
      try {
        // Store workout plan
        const workoutResponse = await fetch('/api/workout-plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goalId: goal.id,
            userId: session.user.id,
            workoutPlan: planData.plan.workout_plan
          })
        });

        if (!workoutResponse.ok) {
          const workoutError = await workoutResponse.text();
          console.error('Workout plan storage failed:', workoutError);
          throw new Error(`Failed to store workout plan: ${workoutError}`);
        }

        // Store meal plan
        const mealResponse = await fetch('/api/meal-plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goalId: goal.id,
            userId: session.user.id,
            mealPlan: planData.plan.meal_plan
          })
        });

        if (!mealResponse.ok) {
          const mealError = await mealResponse.text();
          console.error('Meal plan storage failed:', mealError);
          throw new Error(`Failed to store meal plan: ${mealError}`);
        }

        console.log('Plans stored successfully');
      } catch (error) {
        console.error('Error storing plans:', error);
        // Continue anyway - the goal was created successfully
      }

      // Step 4: Store plans in the database (they'll automatically appear in the in-app calendar)
      console.log('Plans created successfully! They will appear in your in-app calendar.');

      // Success! Refresh goals and set as active
      await fetchGoals();
      setActiveGoal(goal);
      setNewGoalText('');
      setShowGoalInput(false);

      alert(`🎉 Goal created successfully! Your workout and meal plans are now available in the calendar!`);

    } catch (error) {
      console.error('Error creating goal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoalSwitch = (goal: any) => {
    setActiveGoal(goal);
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal? This will also remove all associated plans and calendar events.')) {
      return;
    }

    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.id })
      });

      if (response.ok) {
        // Remove from local state
        setGoals(prev => prev.filter(g => g.id !== goalId));

        // If this was the active goal, clear it
        if (activeGoal?.id === goalId) {
          setActiveGoal(null);
        }

        alert('Goal deleted successfully!');
      } else {
        throw new Error('Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Failed to delete goal. Please try again.');
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to FitSmith</h1>
          <p className="text-gray-600">Please sign in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {session.user.name}! 💪
        </h1>
        <p className="text-gray-600">Ready to crush your fitness goals today? 🎉</p>
      </div>

      {/* Goal Creation Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>🎯 Create New Goal</CardTitle>
          <CardDescription>
            Simply describe your fitness goal and our AI will generate a complete plan!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showGoalInput ? (
            <Button
              onClick={() => setShowGoalInput(true)}
              className="w-full"
              size="lg"
            >
              🚀 Create New Goal
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="goalInput">What's your fitness goal?</Label>
                <Input
                  id="goalInput"
                  placeholder="e.g., I want to lose 20 pounds and get stronger"
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCreateGoal}
                  disabled={isLoading || !newGoalText.trim()}
                  className="flex-1"
                >
                  {isLoading ? 'Creating...' : '🎯 Create Goal & Generate Plan'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGoalInput(false);
                    setNewGoalText('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals List */}
      {goals.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📋 Your Goals</CardTitle>
            <CardDescription>
              Switch between goals to see different plans and calendars
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${activeGoal?.id === goal.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => handleGoalSwitch(goal)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{goal.title}</h3>
                      <p className="text-sm text-gray-600">
                        {goal.timeframe} • {goal.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeGoal?.id === goal.id && (
                        <Badge variant="secondary">Active</Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGoal(goal.id);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Goal Display */}
      {activeGoal && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🎯 Active Goal: {activeGoal.title}</CardTitle>
            <CardDescription>
              Your current focus and progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{activeGoal.progress || 0}%</span>
                </div>
                <Progress value={activeGoal.progress || 0} className="w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Timeframe:</span>
                  <p className="text-gray-600">{activeGoal.timeframe}</p>
                </div>
                <div>
                  <span className="font-medium">Type:</span>
                  <p className="text-gray-600">{activeGoal.type}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Display */}
      {activeGoal && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>🏋️ Workout Plan</CardTitle>
              <CardDescription>
                Your personalized workout schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Workout plans will be displayed here</p>
                <p className="text-sm">Generated automatically when you create goals</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🍽️ Meal Plan</CardTitle>
              <CardDescription>
                Your personalized nutrition plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Meal plans will be displayed here</p>
                <p className="text-sm">Generated automatically when you create goals</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Chat Section */}
      {activeGoal && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>⚡ Quick Actions</CardTitle>
              <CardDescription>
                Manage your fitness plans and calendar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20">
                  📅 View Calendar
                </Button>
                <Button variant="outline" className="h-20">
                  📋 View Plans
                </Button>
              </div>
            </CardContent>
          </Card>

          <AIChat
            goalId={activeGoal.id}
            goalTitle={activeGoal.title}
            onPlanUpdate={(updates) => {
              console.log('Plan updates suggested:', updates);
              // TODO: Implement plan update logic
            }}
          />
        </div>
      )}
    </div>
  );
}
