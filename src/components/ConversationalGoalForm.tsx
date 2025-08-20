'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GoalData {
  goal_type: string;
  target: string;
  timeframe: string;
  available_equipment: string[];
  workout_days: string[];
  workout_duration: number;
}

interface ConversationalGoalFormProps {
  onComplete: (data: GoalData) => void;
  onCancel: () => void;
}



const TIMEFRAMES = [
  { value: '1 month', label: '1 Month' },
  { value: '3 months', label: '3 Months' },
  { value: '6 months', label: '6 Months' },
  { value: '1 year', label: '1 Year' },
  { value: 'custom', label: 'Custom' }
];

const EQUIPMENT_OPTIONS = [
  { value: 'gym_access', label: 'Gym Access', icon: '🏋️' },
  { value: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
  { value: 'barbell', label: 'Barbell', icon: '🏋️' },
  { value: 'resistance_bands', label: 'Resistance Bands', icon: '🎯' },
  { value: 'bodyweight', label: 'Bodyweight Only', icon: '👤' },
  { value: 'cardio_machine', label: 'Cardio Machine', icon: '🚴' }
];

const WORKOUT_DAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];

export function ConversationalGoalForm({ onComplete, onCancel }: ConversationalGoalFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [goalData, setGoalData] = useState<Partial<GoalData>>({});
  const [customTimeframe, setCustomTimeframe] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  const steps = [
    {
      id: 'goal',
      title: 'What\'s your main fitness goal?',
      description: 'Be specific about what you want to achieve (e.g., "Lose 20 pounds", "Bench 225", "Run a 5k")',
      component: (
        <div className="space-y-4">
          <textarea
            placeholder="Describe your fitness goal in detail..."
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg h-32 resize-none"
            style={{ minHeight: '120px' }}
          />
          <p className="text-sm text-gray-500">
            💡 Be specific! Include numbers, measurements, or clear targets when possible.
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Examples:</strong> "Lose 20 pounds", "Bench 225 pounds", "Run a 5k in under 25 minutes", "Get flexible enough to touch my toes"
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'timeframe',
      title: 'How long do you want to take to reach this goal?',
      description: 'Choose a realistic timeframe',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {TIMEFRAMES.map((timeframe) => (
              <Button
                key={timeframe.value}
                variant={goalData.timeframe === timeframe.value ? 'default' : 'outline'}
                className="h-16"
                onClick={() => {
                  setGoalData(prev => ({ ...prev, timeframe: timeframe.value }));
                  if (timeframe.value === 'custom') {
                    setCustomTimeframe('');
                  }
                }}
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
          {goalData.timeframe === 'custom' && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="e.g., 2 months, 18 weeks..."
                value={customTimeframe}
                onChange={(e) => setCustomTimeframe(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          )}
        </div>
      )
    },
    {
      id: 'equipment',
      title: 'What equipment do you have access to?',
      description: 'Select all that apply',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {EQUIPMENT_OPTIONS.map((equipment) => (
              <Button
                key={equipment.value}
                variant={goalData.available_equipment?.includes(equipment.value) ? 'default' : 'outline'}
                className="h-16 flex items-center justify-center space-x-2"
                onClick={() => {
                  const current = goalData.available_equipment || [];
                  const updated = current.includes(equipment.value)
                    ? current.filter(e => e !== equipment.value)
                    : [...current, equipment.value];
                  setGoalData(prev => ({ ...prev, available_equipment: updated }));
                }}
              >
                <span>{equipment.icon}</span>
                <span>{equipment.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'schedule',
      title: 'How many days per week can you work out?',
      description: 'I\'ll suggest optimal days based on your goal',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[3, 4, 5, 6].map((days) => (
              <Button
                key={days}
                variant={goalData.workout_days?.length === days ? 'default' : 'outline'}
                className="h-16"
                onClick={() => {
                  // Suggest optimal days based on goal type
                  let suggestedDays: string[] = [];
                  if (days === 3) suggestedDays = ['monday', 'wednesday', 'friday'];
                  else if (days === 4) suggestedDays = ['monday', 'tuesday', 'thursday', 'friday'];
                  else if (days === 5) suggestedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                  else if (days === 6) suggestedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

                  setGoalData(prev => ({
                    ...prev,
                    workout_days: suggestedDays,
                    workout_duration: 45 // Default duration
                  }));
                }}
              >
                {days} Days
              </Button>
            ))}
          </div>
          {goalData.workout_days && goalData.workout_days.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Suggested workout days:</p>
              <div className="flex flex-wrap gap-2">
                {goalData.workout_days.map((day) => (
                  <Badge key={day} variant="secondary" className="capitalize">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Prepare final data
    const finalData: GoalData = {
      goal_type: 'custom', // Since we're using free-form input
      target: customGoal || 'Improve fitness',
      timeframe: goalData.timeframe === 'custom' ? customTimeframe : (goalData.timeframe || '3 months'),
      available_equipment: goalData.available_equipment || ['bodyweight'],
      workout_days: goalData.workout_days || ['monday', 'wednesday', 'friday'],
      workout_duration: goalData.workout_duration || 45
    };

    onComplete(finalData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return customGoal.trim().length > 0;
      case 1: return goalData.timeframe && (goalData.timeframe !== 'custom' || customTimeframe.trim());
      case 2: return goalData.available_equipment && goalData.available_equipment.length > 0;
      case 3: return goalData.workout_days && goalData.workout_days.length > 0;
      default: return false;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🎯 Create Your Fitness Goal</span>
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Current Step */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{currentStepData.title}</h3>
          <p className="text-gray-600">{currentStepData.description}</p>
          {currentStepData.component}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            ← Previous
          </Button>

          {isLastStep ? (
            <Button
              onClick={handleComplete}
              disabled={!canProceed()}
              className="bg-green-600 hover:bg-green-700"
            >
              🎯 Create Goal
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next →
            </Button>
          )}
        </div>

        {/* Cancel Button */}
        <div className="text-center">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
