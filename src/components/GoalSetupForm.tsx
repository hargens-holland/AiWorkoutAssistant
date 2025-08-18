'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface GoalSetupFormProps {
  onSubmit: (goalData: any) => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export function GoalSetupForm({ onSubmit, onCancel, initialData, isEditing = false }: GoalSetupFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Goal Info
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'general_fitness',
    target: initialData?.target || '',
    timeframe: initialData?.timeframe || '',

    // Goal-Specific Metrics
    currentWeight: initialData?.current_weight || '',
    targetWeight: initialData?.target_weight || '',
    currentBench: initialData?.current_bench || '',
    targetBench: initialData?.target_bench || '',
    currentMileTime: initialData?.current_mile_time || '',
    targetMileTime: initialData?.target_mile_time || '',

    // Workout Preferences
    workoutDays: initialData?.workout_days || ['monday', 'wednesday', 'friday'],
    workoutDuration: initialData?.workout_duration || 60,
    workoutTime: initialData?.workout_time || 'morning',
    experienceLevel: initialData?.experience_level || 'intermediate',

    // Equipment & Facilities
    availableEquipment: initialData?.available_equipment || [],
    gymAccess: initialData?.gym_access || false,
    homeEquipment: initialData?.home_equipment || [],

    // Dietary Preferences
    dietaryRestrictions: initialData?.dietary_restrictions || [],
    allergies: initialData?.allergies || '',
    mealPrepTime: initialData?.meal_prep_time || 30,
    cookingSkill: initialData?.cooking_skill || 'intermediate',

    // Lifestyle & Constraints
    sleepSchedule: initialData?.sleep_schedule || 'normal',
    stressLevel: initialData?.stress_level || 'moderate',
    travelFrequency: initialData?.travel_frequency || 'rarely',

    // Additional Context
    previousInjuries: initialData?.previous_injuries || '',
    medicalConditions: initialData?.medical_conditions || '',
    motivationFactors: initialData?.motivation_factors || []
  });

  const goalTypes = [
    { value: 'weight_loss', label: 'Weight Loss', icon: '⚖️' },
    { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
    { value: 'strength', label: 'Strength', icon: '🏋️' },
    { value: 'endurance', label: 'Endurance', icon: '🏃' },
    { value: 'flexibility', label: 'Flexibility', icon: '🧘' },
    { value: 'general_fitness', label: 'General Fitness', icon: '🌟' }
  ];

  const workoutDays = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const equipmentOptions = [
    { value: 'dumbbells', label: 'Dumbbells' },
    { value: 'barbell', label: 'Barbell' },
    { value: 'kettlebell', label: 'Kettlebell' },
    { value: 'resistance_bands', label: 'Resistance Bands' },
    { value: 'pull_up_bar', label: 'Pull-up Bar' },
    { value: 'yoga_mat', label: 'Yoga Mat' },
    { value: 'cardio_machine', label: 'Cardio Machine' },
    { value: 'none', label: 'No Equipment' }
  ];

  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'keto', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'low_carb', label: 'Low Carb' },
    { value: 'gluten_free', label: 'Gluten Free' },
    { value: 'dairy_free', label: 'Dairy Free' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const calculateTargetDate = () => {
    if (!formData.timeframe) return '';
    const now = new Date();
    const timeframe = formData.timeframe.toLowerCase();

    if (timeframe.includes('week')) {
      const weeks = parseInt(timeframe.match(/\d+/)?.[0] || '1');
      now.setDate(now.getDate() + (weeks * 7));
    } else if (timeframe.includes('month')) {
      const months = parseInt(timeframe.match(/\d+/)?.[0] || '1');
      now.setMonth(now.getMonth() + months);
    } else if (timeframe.includes('year')) {
      const years = parseInt(timeframe.match(/\d+/)?.[0] || '1');
      now.setFullYear(now.getFullYear() + years);
    }

    return now.toISOString().split('T')[0];
  };

  const handleSubmit = () => {
    const targetDate = calculateTargetDate();
    const goalData = {
      ...formData,
      startDate: new Date().toISOString().split('T')[0],
      targetDate,
      isActive: true
    };
    onSubmit(goalData);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">🎯 Basic Goal Information</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Goal Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Lose 20 pounds, Bench 225, Run a 5K"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your goal in detail..."
          />
        </div>

        <div>
          <Label>Goal Type</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {goalTypes.map(type => (
              <div
                key={type.value}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${formData.type === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => handleInputChange('type', type.value)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="target">Specific Target</Label>
          <Input
            id="target"
            value={formData.target}
            onChange={(e) => handleInputChange('target', e.target.value)}
            placeholder="e.g., 20 pounds, 225 lbs, 5K in 25 minutes"
          />
        </div>

        <div>
          <Label htmlFor="timeframe">Timeframe</Label>
          <Input
            id="timeframe"
            value={formData.timeframe}
            onChange={(e) => handleInputChange('timeframe', e.target.value)}
            placeholder="e.g., 3 months, 6 weeks, 1 year"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">💪 Workout Preferences</h3>

      <div className="space-y-4">
        <div>
          <Label>Available Workout Days</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {workoutDays.map(day => (
              <div key={day.value} className="flex items-center space-x-2">
                <Checkbox
                  id={day.value}
                  checked={formData.workoutDays.includes(day.value)}
                  onCheckedChange={() => handleArrayToggle('workoutDays', day.value)}
                />
                <Label htmlFor={day.value} className="text-sm">{day.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="workoutDuration">Workout Duration (minutes)</Label>
            <Input
              id="workoutDuration"
              type="number"
              value={formData.workoutDuration}
              onChange={(e) => handleInputChange('workoutDuration', parseInt(e.target.value))}
              min="15"
              max="180"
            />
          </div>
          <div>
            <Label htmlFor="workoutTime">Preferred Workout Time</Label>
            <select
              id="workoutTime"
              value={formData.workoutTime}
              onChange={(e) => handleInputChange('workoutTime', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="morning">Morning (6AM-9AM)</option>
              <option value="midday">Midday (11AM-2PM)</option>
              <option value="afternoon">Afternoon (2PM-5PM)</option>
              <option value="evening">Evening (5PM-8PM)</option>
              <option value="night">Night (8PM-11PM)</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="experienceLevel">Experience Level</Label>
          <select
            id="experienceLevel"
            value={formData.experienceLevel}
            onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="beginner">Beginner (0-6 months)</option>
            <option value="intermediate">Intermediate (6 months - 2 years)</option>
            <option value="advanced">Advanced (2+ years)</option>
          </select>
        </div>

        <div>
          <Label>Available Equipment</Label>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {equipmentOptions.map(equipment => (
              <div
                key={equipment.value}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${formData.availableEquipment.includes(equipment.value)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => handleArrayToggle('availableEquipment', equipment.value)}
              >
                <div className="text-center">
                  <div className="text-sm font-medium">{equipment.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="gymAccess"
            checked={formData.gymAccess}
            onCheckedChange={(checked) => handleInputChange('gymAccess', checked)}
          />
          <Label htmlFor="gymAccess">I have access to a gym</Label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">🍽️ Dietary Preferences</h3>

      <div className="space-y-4">
        <div>
          <Label>Dietary Restrictions</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {dietaryOptions.map(diet => (
              <div
                key={diet.value}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${formData.dietaryRestrictions.includes(diet.value)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => handleArrayToggle('dietaryRestrictions', diet.value)}
              >
                <div className="text-center">
                  <div className="text-sm font-medium">{diet.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="allergies">Food Allergies/Intolerances</Label>
          <Input
            id="allergies"
            value={formData.allergies}
            onChange={(e) => handleInputChange('allergies', e.target.value)}
            placeholder="e.g., nuts, dairy, shellfish (leave blank if none)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mealPrepTime">Meal Prep Time (minutes/day)</Label>
            <Input
              id="mealPrepTime"
              type="number"
              value={formData.mealPrepTime}
              onChange={(e) => handleInputChange('mealPrepTime', parseInt(e.target.value))}
              min="15"
              max="120"
            />
          </div>
          <div>
            <Label htmlFor="cookingSkill">Cooking Skill Level</Label>
            <select
              id="cookingSkill"
              value={formData.cookingSkill}
              onChange={(e) => handleInputChange('cookingSkill', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">📋 Additional Context</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="previousInjuries">Previous Injuries</Label>
          <Input
            id="previousInjuries"
            value={formData.previousInjuries}
            onChange={(e) => handleInputChange('previousInjuries', e.target.value)}
            placeholder="e.g., knee surgery, back pain, shoulder injury (leave blank if none)"
          />
        </div>

        <div>
          <Label htmlFor="medicalConditions">Medical Conditions</Label>
          <Input
            id="medicalConditions"
            value={formData.medicalConditions}
            onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
            placeholder="e.g., diabetes, heart condition, asthma (leave blank if none)"
          />
        </div>

        <div>
          <Label>Motivation Factors</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { value: 'health', label: 'Health & Longevity' },
              { value: 'appearance', label: 'Physical Appearance' },
              { value: 'performance', label: 'Athletic Performance' },
              { value: 'confidence', label: 'Self-Confidence' },
              { value: 'energy', label: 'Energy & Vitality' },
              { value: 'stress_relief', label: 'Stress Relief' }
            ].map(factor => (
              <div
                key={factor.value}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${formData.motivationFactors.includes(factor.value)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => handleArrayToggle('motivationFactors', factor.value)}
              >
                <div className="text-center">
                  <div className="text-sm font-medium">{factor.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sleepSchedule">Sleep Schedule</Label>
            <select
              id="sleepSchedule"
              value={formData.sleepSchedule}
              onChange={(e) => handleInputChange('sleepSchedule', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="early_bird">Early Bird (9PM-5AM)</option>
              <option value="normal">Normal (10PM-6AM)</option>
              <option value="night_owl">Night Owl (12AM-8AM)</option>
              <option value="irregular">Irregular</option>
            </select>
          </div>
          <div>
            <Label htmlFor="stressLevel">Stress Level</Label>
            <select
              id="stressLevel"
              value={formData.stressLevel}
              onChange={(e) => handleInputChange('stressLevel', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="very_high">Very High</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">✅ Review & Submit</h3>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Goal Summary</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div><strong>Title:</strong> {formData.title}</div>
            <div><strong>Type:</strong> {goalTypes.find(t => t.value === formData.type)?.label}</div>
            <div><strong>Target:</strong> {formData.target}</div>
            <div><strong>Timeframe:</strong> {formData.timeframe}</div>
            <div><strong>Target Date:</strong> {calculateTargetDate()}</div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Workout Preferences</h4>
          <div className="space-y-2 text-sm text-green-800">
            <div><strong>Days:</strong> {formData.workoutDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}</div>
            <div><strong>Duration:</strong> {formData.workoutDuration} minutes</div>
            <div><strong>Time:</strong> {formData.workoutTime}</div>
            <div><strong>Level:</strong> {formData.experienceLevel}</div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">Dietary Preferences</h4>
          <div className="space-y-2 text-sm text-yellow-800">
            <div><strong>Restrictions:</strong> {formData.dietaryRestrictions.length > 0 ? formData.dietaryRestrictions.join(', ') : 'None'}</div>
            <div><strong>Allergies:</strong> {formData.allergies || 'None'}</div>
            <div><strong>Prep Time:</strong> {formData.mealPrepTime} minutes/day</div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Your AI agent will use this information to create personalized workout and meal plans!</p>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {isEditing ? 'Edit Goal' : 'Create New Goal'}
        </CardTitle>
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${stepNumber === step
                    ? 'bg-blue-600 text-white'
                    : stepNumber < step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {stepNumber < step ? '✓' : stepNumber}
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : onCancel()}
            >
              {step > 1 ? 'Previous' : 'Cancel'}
            </Button>

            <div className="flex gap-2">
              {step < 5 && (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!formData.title || !formData.type || !formData.target || !formData.timeframe)) ||
                    (step === 2 && formData.workoutDays.length === 0) ||
                    (step === 3 && formData.dietaryRestrictions.length === 0)
                  }
                >
                  Next
                </Button>
              )}

              {step === 5 && (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!formData.title || !formData.type || !formData.target || !formData.timeframe}
                >
                  {isEditing ? 'Update Goal' : 'Create Goal'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
