'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Goal } from '@/lib/types';

interface GoalSetupFormProps {
  onSubmit: (goal: Partial<Goal>) => void;
  onCancel?: () => void;
  initialData?: Partial<Goal>;
  isEditing?: boolean;
}

export function GoalSetupForm({ onSubmit, onCancel, initialData, isEditing = false }: GoalSetupFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'general_fitness' as Goal['type'],
    target: initialData?.target || '',
    timeframe: initialData?.timeframe || '',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    targetDate: initialData?.targetDate || '',
    currentWeight: initialData?.currentWeight || '',
    targetWeight: initialData?.targetWeight || '',
    currentBench: initialData?.currentBench || '',
    targetBench: initialData?.targetBench || '',
    currentMileTime: initialData?.currentMileTime || '',
    targetMileTime: initialData?.targetMileTime || '',
  });

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate target date based on timeframe
    const startDate = new Date(formData.startDate);
    let targetDate = new Date(startDate);
    
    if (formData.timeframe.includes('month')) {
      const months = parseInt(formData.timeframe.match(/\d+/)?.[0] || '1');
      targetDate.setMonth(targetDate.getMonth() + months);
    } else if (formData.timeframe.includes('week')) {
      const weeks = parseInt(formData.timeframe.match(/\d+/)?.[0] || '1');
      targetDate.setDate(targetDate.getDate() + (weeks * 7));
    } else if (formData.timeframe.includes('year')) {
      const years = parseInt(formData.timeframe.match(/\d+/)?.[0] || '1');
      targetDate.setFullYear(targetDate.getFullYear() + years);
    }

    const goalData: Partial<Goal> = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      target: formData.target,
      timeframe: formData.timeframe,
      startDate: formData.startDate,
      targetDate: targetDate.toISOString().split('T')[0],
      isActive: true,
      progress: 0,
      milestones: [],
    };

    // Add type-specific data
    if (formData.type === 'weight_loss' || formData.type === 'muscle_gain') {
      if (formData.currentWeight) goalData.currentWeight = parseFloat(formData.currentWeight);
      if (formData.targetWeight) goalData.targetWeight = parseFloat(formData.targetWeight);
    } else if (formData.type === 'strength') {
      if (formData.currentBench) goalData.currentBench = parseFloat(formData.currentBench);
      if (formData.targetBench) goalData.targetBench = parseFloat(formData.targetBench);
    } else if (formData.type === 'endurance') {
      goalData.currentMileTime = formData.currentMileTime;
      goalData.targetMileTime = formData.targetMileTime;
    }

    onSubmit(goalData);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Goal Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Lose 20 Pounds, Bench 225, Run 5K"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your goal in detail..."
        />
      </div>

      <div>
        <Label htmlFor="type">Goal Type *</Label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as Goal['type'] })}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="strength">Strength Training</option>
          <option value="endurance">Endurance/Cardio</option>
          <option value="flexibility">Flexibility</option>
          <option value="general_fitness">General Fitness</option>
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="target">Specific Target *</Label>
        <Input
          id="target"
          value={formData.target}
          onChange={(e) => setFormData({ ...formData, target: e.target.value })}
          placeholder={getTargetPlaceholder()}
          required
        />
      </div>

      <div>
        <Label htmlFor="timeframe">Timeframe *</Label>
        <select
          id="timeframe"
          value={formData.timeframe}
          onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select timeframe</option>
          <option value="2 weeks">2 weeks</option>
          <option value="1 month">1 month</option>
          <option value="2 months">2 months</option>
          <option value="3 months">3 months</option>
          <option value="6 months">6 months</option>
          <option value="1 year">1 year</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="targetDate">Target Date</Label>
          <Input
            id="targetDate"
            type="date"
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            disabled
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      {formData.type === 'weight_loss' || formData.type === 'muscle_gain' ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentWeight">Current Weight (lbs)</Label>
            <Input
              id="currentWeight"
              type="number"
              value={formData.currentWeight}
              onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
              placeholder="150"
            />
          </div>
          <div>
            <Label htmlFor="targetWeight">Target Weight (lbs)</Label>
            <Input
              id="targetWeight"
              type="number"
              value={formData.targetWeight}
              onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
              placeholder="130"
            />
          </div>
        </div>
      ) : formData.type === 'strength' ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentBench">Current Bench (lbs)</Label>
            <Input
              id="currentBench"
              type="number"
              value={formData.currentBench}
              onChange={(e) => setFormData({ ...formData, currentBench: e.target.value })}
              placeholder="135"
            />
          </div>
          <div>
            <Label htmlFor="targetBench">Target Bench (lbs)</Label>
            <Input
              id="targetBench"
              type="number"
              value={formData.targetBench}
              onChange={(e) => setFormData({ ...formData, targetBench: e.target.value })}
              placeholder="225"
            />
          </div>
        </div>
      ) : formData.type === 'endurance' ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentMileTime">Current Mile Time</Label>
            <Input
              id="currentMileTime"
              value={formData.currentMileTime}
              onChange={(e) => setFormData({ ...formData, currentMileTime: e.target.value })}
              placeholder="8:30"
            />
          </div>
          <div>
            <Label htmlFor="targetMileTime">Target Mile Time</Label>
            <Input
              id="targetMileTime"
              value={formData.targetMileTime}
              onChange={(e) => setFormData({ ...formData, targetMileTime: e.target.value })}
              placeholder="7:00"
            />
          </div>
        </div>
      ) : null}

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">🎯 Goal Summary</h4>
        <p className="text-sm text-blue-800">
          <strong>{formData.title}</strong><br />
          {formData.description && `${formData.description}<br />`}
          Target: {formData.target}<br />
          Timeframe: {formData.timeframe}<br />
          Start: {new Date(formData.startDate).toLocaleDateString()}<br />
          {formData.targetDate && `Target: ${new Date(formData.targetDate).toLocaleDateString()}`}
        </p>
      </div>
    </div>
  );

  const getTargetPlaceholder = () => {
    switch (formData.type) {
      case 'weight_loss': return 'e.g., lose 20 pounds';
      case 'muscle_gain': return 'e.g., gain 15 pounds of muscle';
      case 'strength': return 'e.g., bench 225, squat 315';
      case 'endurance': return 'e.g., run 5K under 25 minutes';
      case 'flexibility': return 'e.g., touch toes, split';
      default: return 'e.g., complete a triathlon';
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.title && formData.type;
      case 2: return formData.target && formData.timeframe && formData.startDate;
      case 3: return true;
      default: return false;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {isEditing ? 'Edit Goal' : 'Set Your Fitness Goal'}
        </CardTitle>
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i + 1 <= step ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button type="button" onClick={prevStep} variant="outline">
                ← Previous
              </Button>
            )}
            
            {step < totalSteps ? (
              <Button 
                type="button" 
                onClick={nextStep} 
                disabled={!canProceed()}
                className="ml-auto"
              >
                Next →
              </Button>
            ) : (
              <div className="flex gap-2 ml-auto">
                {onCancel && (
                  <Button type="button" onClick={onCancel} variant="outline">
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={!canProceed()}>
                  {isEditing ? 'Update Goal' : 'Create Goal'}
                </Button>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
