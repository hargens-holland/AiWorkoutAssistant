'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface UserProfile {
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  dietary_prefs: any;
  equipment: string[];
}

interface Goal {
  id: string;
  title: string;
  goal_type: string;
  status: string;
  target_value: any;
  progress: any;
}

function DashboardContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userGoals, setUserGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;

    // Fetch user data
    fetchUserData();
  }, [session]);

  const fetchUserData = async () => {
    if (!session?.user?.email) return;

    try {
      setIsLoading(true);

      // Fetch user profile
      const profileResponse = await fetch(`/api/users/profile?userId=${session.user.email}`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserProfile(profileData.profile);
      }

      // Fetch user goals
      const goalsResponse = await fetch(`/api/goals?userId=${session.user.email}`);
      if (goalsResponse.ok) {
        const goalsData = await goalsResponse.json();
        setUserGoals(goalsData.goals);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loading Dashboard...</h1>
          <p className="text-gray-600">Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  // Show onboarding prompt if no profile
  if (!userProfile) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to FitSmith!</h1>
          <p className="text-gray-600">Let's set up your profile to get started.</p>
          <Button onClick={() => router.push('/onboarding')} className="mt-4">
            Complete Profile Setup
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session?.user?.name || session?.user?.email}!</h1>
          <p className="text-gray-600">Here's your fitness overview</p>
        </div>
        <Button onClick={() => router.push('/onboarding')}>
          Update Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Today's Workout</CardTitle>
            <CardDescription>Your scheduled workout</CardDescription>
          </CardHeader>
          <CardContent>
            {userGoals.length > 0 ? (
              <div>
                <p className="text-sm text-gray-600">Based on your goal:</p>
                <p className="font-semibold">{userGoals[0].title}</p>
                <Badge variant="secondary" className="mt-2">
                  {userGoals[0].goal_type.replace('_', ' ')}
                </Badge>
              </div>
            ) : (
              <p className="text-gray-500">No workouts scheduled</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Calories</CardTitle>
            <CardDescription>Target based on your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {userProfile.weight_kg * 15} kcal
            </p>
            <p className="text-sm text-gray-600">
              Based on {userProfile.weight_kg}kg weight
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Workout</CardTitle>
            <CardDescription>When to work out next</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">Tomorrow</p>
            <p className="text-sm text-gray-600">
              {userProfile.activity_level === 'moderate' ? '3-5 days/week' : 'Flexible schedule'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rest of your dashboard content */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Goals</CardTitle>
            <CardDescription>Active fitness goals</CardDescription>
          </CardHeader>
          <CardContent>
            {userGoals.length > 0 ? (
              <div className="space-y-4">
                {userGoals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{goal.title}</p>
                        <p className="text-sm text-gray-600">
                          {goal.goal_type.replace('_', ' ')}
                        </p>
                      </div>
                      <Badge variant={goal.status === 'active' ? 'default' : 'secondary'}>
                        {goal.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No goals set yet. Complete your profile setup to get started!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
