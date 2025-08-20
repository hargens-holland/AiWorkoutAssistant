'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GoalSetupForm } from './GoalSetupForm';

interface Goal {
  id: string;
  title: string;
  description: string;
  type: string;
  target: string;
  timeframe: string;
  start_date: string;
  target_date: string;
  is_active: boolean;
  progress: number;
  created_at: string;
  updated_at: string;
}

interface GoalManagerProps {
  userId: string;
  onGoalChange: () => void;
}

export function GoalManager({ userId, onGoalChange }: GoalManagerProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [userId]);

  const fetchGoals = async () => {
    try {
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

  const setActiveGoal = async (goalId: string) => {
    try {
      // First, deactivate all goals
      for (const goal of goals) {
        if (goal.id !== goalId) {
          await fetch(`/api/goals/${goal.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...goal, isActive: false }),
          });
        }
      }

      // Then activate the selected goal
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...goals.find(g => g.id === goalId), isActive: true }),
      });

      if (response.ok) {
        console.log('✅ Goal activated:', goalId);
        await fetchGoals(); // Refresh the goals list
        onGoalChange(); // Notify parent component
      }
    } catch (error) {
      console.error('Error setting active goal:', error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('✅ Goal deleted:', goalId);
        await fetchGoals(); // Refresh the goals list
        onGoalChange(); // Notify parent component
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowEditForm(true);
  };

  const handleEditComplete = async () => {
    setShowEditForm(false);
    setEditingGoal(null);
    await fetchGoals();
    onGoalChange();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading goals...</div>
        </CardContent>
      </Card>
    );
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <p className="mb-4">No goals created yet.</p>
            <p className="text-sm">Use the "Create New Goal" button above to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <Card key={goal.id} className={goal.is_active ? 'ring-2 ring-blue-500' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-lg">{goal.title}</CardTitle>
                {goal.is_active && (
                  <Badge variant="default" className="bg-green-600">
                    Active
                  </Badge>
                  )}
                <Badge variant="outline">{goal.type}</Badge>
              </div>
              <div className="flex space-x-2">
                {!goal.is_active && (
                  <Button
                    onClick={() => setActiveGoal(goal.id)}
                    size="sm"
                    variant="outline"
                  >
                    Activate
                  </Button>
                )}
                <Button
                  onClick={() => handleEditGoal(goal)}
                  size="sm"
                  variant="outline"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deleteGoal(goal.id)}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-3">{goal.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <span className="font-medium text-gray-700">Target:</span>
                <p className="text-gray-600">{goal.target}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Timeframe:</span>
                <p className="text-gray-600">{goal.timeframe}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Start Date:</span>
                <p className="text-gray-600">{new Date(goal.start_date).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Target Date:</span>
                <p className="text-gray-600">{new Date(goal.target_date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{goal.progress || 0}%</span>
              </div>
              <Progress value={goal.progress || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Edit Goal Form Modal */}
      {showEditForm && editingGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Goal: {editingGoal.title}</h2>
            <GoalSetupForm
              onSubmit={handleEditComplete}
              onCancel={() => setShowEditForm(false)}
              initialData={editingGoal}
              isEditing={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
