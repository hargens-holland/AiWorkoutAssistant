'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Goal } from '@/lib/types';

interface GoalContextType {
  activeGoal: Goal | null;
  setActiveGoal: (goal: Goal | null) => void;
  refreshActiveGoal: () => Promise<void>;
  isLoading: boolean;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export function GoalProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActiveGoal = async () => {
    if (!session?.user?.id) {
      console.log('🔄 GoalContext: No session user ID, skipping fetch');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔄 GoalContext: Fetching goals for user:', session.user.id);
      setIsLoading(true);
      const response = await fetch(`/api/goals?userId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('🔄 GoalContext: Received goals data:', data);
        console.log('🔄 GoalContext: Goals array:', data.goals);
        console.log('🔄 GoalContext: Goals array length:', data.goals?.length);

        if (data.goals && data.goals.length > 0) {
          console.log('🔄 GoalContext: First goal:', data.goals[0]);
          console.log('🔄 GoalContext: First goal is_active:', data.goals[0].is_active);
          console.log('🔄 GoalContext: First goal isActive:', data.goals[0].isActive);
        }

        const active = data.goals?.find((g: Goal) => g.is_active) || null;
        console.log('🔄 GoalContext: Found active goal:', active);
        setActiveGoal(active);
      } else {
        console.error('❌ GoalContext: Failed to fetch goals:', response.status);
      }
    } catch (error) {
      console.error('❌ GoalContext: Error fetching goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshActiveGoal = async () => {
    console.log('🔄 GoalContext: refreshActiveGoal called');
    await fetchActiveGoal();
    console.log('🔄 GoalContext: fetchActiveGoal completed');
  };

  useEffect(() => {
    console.log('🔄 GoalContext: useEffect triggered, session user ID:', session?.user?.id);
    fetchActiveGoal();
  }, [session?.user?.id]);

  const value: GoalContextType = {
    activeGoal,
    setActiveGoal,
    refreshActiveGoal,
    isLoading
  };

  return (
    <GoalContext.Provider value={value}>
      {children}
    </GoalContext.Provider>
  );
}

export function useGoal() {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoal must be used within a GoalProvider');
  }
  return context;
}
