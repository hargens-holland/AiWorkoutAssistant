'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoalSetupForm } from './GoalSetupForm';
import { Goal } from '@/lib/types';
import { useGoal } from '@/contexts/GoalContext';

interface GoalManagerProps {
  userId: string;
  onGoalChange: () => void;
}

export function GoalManager({ userId, onGoalChange }: GoalManagerProps) {
  const { activeGoal, setActiveGoal, refreshActiveGoal } = useGoal();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, [userId]);

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/goals?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setGoals(data.goals || []);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoal = async (goalData: Partial<Goal>) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...goalData,
          userId,
          isActive: goals.length === 0 // First goal becomes active
        })
      });

      if (response.ok) {
        const newGoal = await response.json();
        setGoals([...goals, newGoal]);

        if (goals.length === 0) {
          setActiveGoal(newGoal);
        }

        // Refresh the context
        await refreshActiveGoal();

        setShowCreateForm(false);
        onGoalChange();
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleUpdateGoal = async (goalData: Partial<Goal>) => {
    if (!editingGoal) return;

    try {
      const response = await fetch(`/api/goals/${editingGoal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData)
      });

      if (response.ok) {
        const updatedGoal = await response.json();
        setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));

        if (updatedGoal.isActive) {
          setActiveGoal(updatedGoal);
          await refreshActiveGoal();
          onGoalChange();
        }

        setEditingGoal(null);
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleActivateGoal = async (goalId: string) => {
    try {
      console.log('🔄 Activating goal:', goalId);

      // Deactivate all goals first
      const deactivatePromises = goals.map(goal =>
        fetch(`/api/goals/${goal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: false })
        })
      );

      await Promise.all(deactivatePromises);
      console.log('✅ All goals deactivated');

      // Activate the selected goal
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: true })
      });

      if (response.ok) {
        const updatedGoal = await response.json();
        console.log('✅ Goal activated:', updatedGoal.title);

        // Update local state immediately
        const updatedGoals = goals.map(g => ({
          ...g,
          isActive: g.id === goalId
        }));
        setGoals(updatedGoals);

        // Update context without triggering navigation
        setActiveGoal(updatedGoal);
        console.log('🔄 GoalManager: Updated local activeGoal state');

        // Don't refresh context immediately - it will overwrite our state
        // await refreshActiveGoal();
        console.log('🔄 GoalManager: Skipped refreshActiveGoal to prevent race condition');

        // Notify parent (but don't navigate)
        onGoalChange();
        console.log('🔄 GoalManager: Called onGoalChange');

        console.log(`🎯 "${updatedGoal.title}" is now your active goal!`);

        // Debug: Check context state
        console.log('🔍 GoalManager: Current context activeGoal:', updatedGoal);
      }
    } catch (error) {
      console.error('❌ Error activating goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedGoals = goals.filter(g => g.id !== goalId);
        setGoals(updatedGoals);

        if (activeGoal?.id === goalId) {
          const newActiveGoal = updatedGoals.find(g => g.isActive) || null;
          setActiveGoal(newActiveGoal);
          await refreshActiveGoal();
          onGoalChange();
        }
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const calculateProgress = (goal: Goal) => {
    if (goal.type === 'weight_loss' && goal.currentWeight && goal.targetWeight) {
      const total = Math.abs(goal.currentWeight - goal.targetWeight);
      const current = Math.abs(goal.currentWeight - goal.targetWeight);
      return Math.min(100, Math.max(0, ((total - current) / total) * 100));
    }
    return goal.progress || 0;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading goals...</p>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="space-y-4">
        <Button onClick={() => setShowCreateForm(false)} variant="outline">
          ← Back to Goals
        </Button>
        <GoalSetupForm onSubmit={handleCreateGoal} />
      </div>
    );
  }

  if (editingGoal) {
    return (
      <div className="space-y-4">
        <Button onClick={() => setEditingGoal(null)} variant="outline">
          ← Back to Goals
        </Button>
        <GoalSetupForm
          onSubmit={handleUpdateGoal}
          initialData={editingGoal}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Fitness Goals</h2>
        <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
          ➕ Create New Goal
        </Button>
      </div>

      {/* Active Goal */}
      {activeGoal && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Active Goal: {activeGoal.title}
              <span className="text-sm font-normal text-green-600 bg-green-100 px-2 py-1 rounded">
                ACTIVE
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-700">{activeGoal.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Target:</span> {activeGoal.target}
                </div>
                <div>
                  <span className="font-medium">Timeframe:</span> {activeGoal.timeframe}
                </div>
                <div>
                  <span className="font-medium">Start Date:</span> {new Date(activeGoal.startDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Target Date:</span> {new Date(activeGoal.targetDate).toLocaleDateString()}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(calculateProgress(activeGoal))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress(activeGoal)}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => setEditingGoal(activeGoal)}
                  variant="outline"
                  size="sm"
                >
                  ✏️ Edit Goal
                </Button>
                <Button
                  onClick={() => handleDeleteGoal(activeGoal.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  🗑️ Delete Goal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Goals */}
      {goals.filter(g => !g.isActive).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Other Goals</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {goals.filter(g => !g.isActive).map(goal => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">{goal.description}</p>
                    <div className="text-sm text-gray-600">
                      <div><strong>Target:</strong> {goal.target}</div>
                      <div><strong>Timeframe:</strong> {goal.timeframe}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleActivateGoal(goal.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        🎯 Activate
                      </Button>
                      <Button
                        onClick={() => setEditingGoal(goal)}
                        variant="outline"
                        size="sm"
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteGoal(goal.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Goals Message */}
      {goals.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Goals Set Yet</h3>
            <p className="text-gray-600 mb-6">
              Set your first fitness goal to get started with personalized workout and meal plans!
            </p>
            <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
