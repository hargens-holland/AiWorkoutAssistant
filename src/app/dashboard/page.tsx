'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { GoalManager } from '@/components/GoalManager';
import { FitnessChat } from '@/components/FitnessChat';
import { useGoal } from '@/contexts/GoalContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { activeGoal, refreshActiveGoal } = useGoal();
  const [showChat, setShowChat] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [createdGoal, setCreatedGoal] = useState<any>(null);

  const handleGoalChange = () => {
    refreshActiveGoal();
  };

  const handleChatComplete = (data: any) => {
    console.log('Extracted fitness data:', data);
    setExtractedData(data);
    setShowChat(false);
  };

  const handleChatCancel = () => {
    setShowChat(false);
    setExtractedData(null);
  };

  const handleStartOver = () => {
    setShowChat(true);
    setExtractedData(null);
    setCreatedGoal(null);
  };

  const handleCreateGoal = async () => {
    if (!extractedData || !session?.user?.id) return;

    setIsCreatingGoal(true);
    try {
      // Format the data for the goals API
      const goalData = {
        title: extractedData.target || 'Fitness Goal',
        description: extractedData.target || 'Personal fitness goal',
        type: extractedData.goal_type || extractedData.type || 'general_fitness',
        target: extractedData.target || 'Improve fitness',
        timeframe: extractedData.timeframe || '3 months',
        startDate: new Date().toISOString().split('T')[0],
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
        isActive: true,
        currentWeight: extractedData.current_weight || extractedData.currentWeight,
        targetWeight: extractedData.target_weight || extractedData.targetWeight,
        currentBench: extractedData.current_bench || extractedData.currentBench,
        targetBench: extractedData.target_bench || extractedData.targetBench,
        currentMileTime: extractedData.current_mile_time || extractedData.currentMileTime,
        targetMileTime: extractedData.target_mile_time || extractedData.targetMileTime,
        workoutDays: extractedData.workout_days || extractedData.workoutDays,
        workoutDuration: extractedData.workout_duration || extractedData.workoutDuration,
        workoutTime: extractedData.workout_time || extractedData.workoutTime,
        experienceLevel: extractedData.experience_level || extractedData.experienceLevel,
        availableEquipment: extractedData.available_equipment || extractedData.availableEquipment,
        gymAccess: (extractedData.available_equipment || extractedData.availableEquipment)?.includes('gym_access') || false,
        dietaryRestrictions: extractedData.dietary_restrictions || extractedData.dietaryRestrictions || [],
        allergies: '',
        mealPrepTime: 30,
        cookingSkill: 'intermediate',
        sleepSchedule: 'normal',
        stressLevel: 'moderate',
        travelFrequency: 'rarely',
        previousInjuries: '',
        medicalConditions: '',
        motivationFactors: ['health', 'appearance', 'performance']
      };

      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Goal created successfully:', result);
        setCreatedGoal(result.goal);

        // Refresh the active goal
        await refreshActiveGoal();

        // Clear the form after a short delay
        setTimeout(() => {
          setExtractedData(null);
          setCreatedGoal(null);
        }, 3000);
      } else {
        throw new Error('Failed to create goal');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Failed to create goal. Please try again.');
    } finally {
      setIsCreatingGoal(false);
    }
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
              Welcome back, {session.user.name || 'Fitness Warrior'}! 💪
            </h1>
            <p className="text-gray-600">
              Ready to crush your fitness goals today?
            </p>
          </div>

          {/* Active Goal Summary */}
          {activeGoal && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    🎯 Active Goal: {activeGoal.title}
                  </h2>
                  <p className="text-gray-700 mb-2">{activeGoal.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Type: {activeGoal.type}</span>
                    <span>Target: {activeGoal.target}</span>
                    <span>Progress: {activeGoal.progress}%</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Link href="/plans">
                    <Button variant="outline">
                      📋 View Plans
                    </Button>
                  </Link>
                  <Link href="/calendar">
                    <Button variant="outline">
                      📅 View Calendar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Chat Interface or Goal Creation */}
          {showChat ? (
            <div className="mb-8">
              <FitnessChat
                onComplete={handleChatComplete}
                onCancel={handleChatCancel}
              />
            </div>
          ) : extractedData ? (
            <div className="mb-8 space-y-6">
              {/* Success Message */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-green-900 mb-2">
                      Perfect! I've Got Your Goal Info
                    </h2>
                    <p className="text-green-700 mb-6">
                      Now let me create your goal and then our AI agent will generate your personalized plans!
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Extracted Data Display */}
              <Card>
                <CardHeader>
                  <CardTitle>📋 Your New Goal Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Goal Type:</span>
                        <Badge className="ml-2" variant="outline">
                          {extractedData?.type || 'Not specified'}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Target:</span>
                        <span className="ml-2 text-gray-600">
                          {extractedData?.target || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Timeframe:</span>
                        <span className="ml-2 text-gray-600">
                          {extractedData?.timeframe || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Experience Level:</span>
                        <Badge className="ml-2" variant="outline">
                          {extractedData?.experienceLevel || 'Not specified'}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Equipment:</span>
                        <div className="mt-1">
                          {extractedData?.availableEquipment?.map((item: string, index: number) => (
                            <Badge key={index} variant="secondary" className="mr-2 mb-1">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Workout Days:</span>
                        <div className="mt-1">
                          {extractedData?.workoutDays?.map((day: string, index: number) => (
                            <Badge key={index} variant="outline" className="mr-2 mb-1">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <span className="ml-2 text-gray-600">
                          {extractedData?.workoutDuration || 'Not specified'} minutes
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Goal Creation */}
              {!createdGoal && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900">🚀 Create Your Goal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 mb-4">
                      Ready to create this goal? Our AI agent will then generate your personalized workout and meal plans!
                    </p>

                    <div className="flex space-x-3">
                      <Button
                        onClick={handleCreateGoal}
                        disabled={isCreatingGoal}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isCreatingGoal ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating Goal...
                          </>
                        ) : (
                          '🎯 Create This Goal!'
                        )}
                      </Button>
                      <Button onClick={handleStartOver} variant="outline">
                        🔄 Start Over
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Success State */}
              {createdGoal && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-4xl mb-4">✅</div>
                      <h3 className="text-xl font-bold text-green-900 mb-2">
                        Goal Created Successfully!
                      </h3>
                      <p className="text-green-700 mb-4">
                        Our AI agent will now generate your personalized plans!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            /* Quick Actions */
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setShowChat(true)}
                  className="h-20 text-lg"
                  variant="default"
                >
                  🎯 Create New Goal
                </Button>
                <Link href="/plans">
                  <Button className="w-full h-20 text-lg" variant="outline">
                    📋 View Plans
                  </Button>
                </Link>
                <Link href="/calendar">
                  <Button className="w-full h-20 text-lg" variant="outline">
                    📅 View Calendar
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Goal Management */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Goal Management</h2>
            <GoalManager userId={session.user.id} onGoalChange={handleGoalChange} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
