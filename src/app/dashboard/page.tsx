'use client';

import { useSession } from 'next-auth/react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { GoalManager } from '@/components/GoalManager';
import { useGoal } from '@/contexts/GoalContext';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { activeGoal, refreshActiveGoal } = useGoal();

  // Debug logging
  console.log('🔍 Dashboard: Current activeGoal:', activeGoal);
  console.log('🔍 Dashboard: Session user ID:', session?.user?.id);

  if (!session?.user?.id) {
    return null;
  }

  const handleGoalChange = async () => {
    console.log('🔄 Dashboard: Goal changed, refreshing...');
    try {
      // Refresh the active goal from the context
      await refreshActiveGoal();
      console.log('✅ Dashboard: Goal refresh complete');
    } catch (error) {
      console.error('❌ Dashboard: Error refreshing goal:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {session.user.name || session.user.email}!
            </h1>
            <p className="text-gray-600">
              Manage your fitness goals and track your progress
            </p>
          </div>

          {/* Active Goal Summary */}
          {activeGoal && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                🎯 Your Active Goal: {activeGoal.title}
              </h2>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Target:</span>
                  <p className="text-blue-700">{activeGoal.target}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Timeframe:</span>
                  <p className="text-blue-700">{activeGoal.timeframe}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Progress:</span>
                  <p className="text-blue-700">{activeGoal.progress || 0}%</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  📊 View Progress
                </button>
                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                  🏋️ View Workout Plan
                </button>
                <button className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700">
                  🍽️ View Meal Plan
                </button>
              </div>
            </div>
          )}

          {/* Goal Management */}
          <GoalManager
            userId={session.user.id}
            onGoalChange={handleGoalChange}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
