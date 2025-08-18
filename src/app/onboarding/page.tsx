'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function OnboardingContent() {
    const router = useRouter();
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        height: '',
        weight: '',
        activityLevel: '',
        goal: '',
        goalDetails: {
            targetValue: '',
            timeframe: '',
            specificTarget: ''
        },
        equipment: '',
        dietaryRestrictions: '',
        timezone: 'America/New_York'
    });

    useEffect(() => {
        if (!session?.user?.email) return;

        // Check if user already has a profile
        checkExistingProfile();
    }, [session]);

    const checkExistingProfile = async () => {
        if (!session?.user?.email) return;

        try {
            const response = await fetch(`/api/users/profile?userId=${session.user.email}`);
            if (response.ok) {
                const data = await response.json();
                if (data.profile) {
                    // User already has a profile, redirect to dashboard
                    router.push('/dashboard');
                }
            }
        } catch (error) {
            console.error('Error checking profile:', error);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGoalDetailsChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            goalDetails: { ...prev.goalDetails, [field]: value }
        }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        if (!session?.user?.email) {
            alert('Please sign in to continue');
            return;
        }

        setIsSubmitting(true);
        try {
            // Create user profile
            const profileResponse = await fetch('/api/users/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: session.user.email,
                    sex: 'other', // We'll add this field later
                    dob: new Date(Date.now() - parseInt(formData.age) * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    height_cm: parseInt(formData.height),
                    weight_kg: parseInt(formData.weight),
                    activity_level: formData.activityLevel,
                    dietary_prefs: { restrictions: formData.dietaryRestrictions.split(',').map(s => s.trim()) },
                    equipment: formData.equipment.split(',').map(s => s.trim()),
                    timezone: formData.timezone
                })
            });

            if (!profileResponse.ok) {
                throw new Error('Failed to create profile');
            }

            // Determine goal type based on form data
            const goalType = determineGoalType(formData.goal);

            // Create goal
            const goalResponse = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: session.user.email,
                    goal_type: goalType,
                    title: `${formData.goal} Goal`,
                    description: `Goal to ${formData.goal}`,
                    target_value: createTargetValue(goalType, formData),
                    timeframe: createTimeframe(formData.goalDetails.timeframe),
                    constraints: {
                        equipment: formData.equipment.split(',').map(s => s.trim()),
                        dietary_restrictions: formData.dietaryRestrictions.split(',').map(s => s.trim()),
                        time_constraints: 'flexible'
                    }
                })
            });

            if (!goalResponse.ok) {
                throw new Error('Failed to create goal');
            }

            console.log('Profile and goal created successfully!');

            // Redirect to dashboard
            router.push('/dashboard');

        } catch (error) {
            console.error('Error creating profile:', error);
            alert('Failed to create profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const determineGoalType = (goal: string): string => {
        const goalLower = goal.toLowerCase();
        if (goalLower.includes('lose') || goalLower.includes('weight')) return 'lose_weight_specific';
        if (goalLower.includes('build') || goalLower.includes('muscle')) return 'build_muscle_specific';
        if (goalLower.includes('strength')) return 'strength_specific';
        if (goalLower.includes('endurance') || goalLower.includes('cardio')) return 'endurance_specific';
        if (goalLower.includes('flexibility') || goalLower.includes('stretch')) return 'flexibility_specific';
        return 'general_improvement';
    };

    const createTargetValue = (goalType: string, formData: any) => {
        const currentWeight = parseFloat(formData.weight);

        switch (goalType) {
            case 'lose_weight_specific':
                return {
                    current_weight: currentWeight,
                    target_weight: currentWeight * 0.9, // 10% weight loss
                    measurement_unit: 'kg',
                    timeframe_weeks: 12
                };
            case 'build_muscle_specific':
                return {
                    current_weight: currentWeight,
                    target_weight: currentWeight * 1.05, // 5% weight gain
                    measurement_unit: 'kg',
                    timeframe_weeks: 16
                };
            default:
                return {
                    description: formData.goal,
                    measurement_unit: 'general',
                    timeframe_weeks: 12
                };
        }
    };

    const createTimeframe = (timeframe: string) => {
        const startDate = new Date();
        let endDate = new Date();

        switch (timeframe) {
            case '1_month':
                endDate.setMonth(endDate.getMonth() + 1);
                break;
            case '3_months':
                endDate.setMonth(endDate.getMonth() + 3);
                break;
            case '6_months':
                endDate.setMonth(endDate.getMonth() + 6);
                break;
            default:
                endDate.setMonth(endDate.getMonth() + 3);
        }

        return {
            start_date: startDate.toISOString().split('T')[0],
            target_date: endDate.toISOString().split('T')[0],
            weeks_duration: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
        };
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to FitSmith, {session?.user?.name || session?.user?.email}!</h1>
                <p className="text-gray-600">Let's get to know you better to create your personalized plan.</p>
            </div>

            {/* Step indicator */}
            <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4].map((stepNumber) => (
                    <div
                        key={stepNumber}
                        className={`w-3 h-3 rounded-full ${stepNumber <= step ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Step {step} of 4</CardTitle>
                    <CardDescription>
                        {step === 1 && 'Basic Information'}
                        {step === 2 && 'Fitness Goals'}
                        {step === 3 && 'Equipment & Preferences'}
                        {step === 4 && 'Review & Submit'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {step === 1 && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => handleInputChange('age', e.target.value)}
                                        placeholder="25"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="height">Height (cm)</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        value={formData.height}
                                        onChange={(e) => handleInputChange('height', e.target.value)}
                                        placeholder="175"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="weight">Weight (kg)</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) => handleInputChange('weight', e.target.value)}
                                        placeholder="70"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="activityLevel">Activity Level</Label>
                                <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select activity level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                                        <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                                        <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                                        <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                                        <SelectItem value="very_active">Very Active (hard exercise daily)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div>
                                <Label htmlFor="goal">Primary Goal</Label>
                                <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your primary goal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lose_weight">Lose Weight</SelectItem>
                                        <SelectItem value="build_muscle">Build Muscle</SelectItem>
                                        <SelectItem value="improve_strength">Improve Strength</SelectItem>
                                        <SelectItem value="increase_endurance">Increase Endurance</SelectItem>
                                        <SelectItem value="improve_flexibility">Improve Flexibility</SelectItem>
                                        <SelectItem value="maintain_fitness">Maintain Fitness</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="specificTarget">Specific Target (Optional)</Label>
                                <Input
                                    id="specificTarget"
                                    value={formData.goalDetails.specificTarget}
                                    onChange={(e) => handleGoalDetailsChange('specificTarget', e.target.value)}
                                    placeholder="e.g., Lose 10kg, Do 100 pushups"
                                />
                            </div>
                            <div>
                                <Label htmlFor="timeframe">Timeframe</Label>
                                <Select value={formData.goalDetails.timeframe} onValueChange={(value) => handleGoalDetailsChange('timeframe', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select timeframe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1_month">1 Month</SelectItem>
                                        <SelectItem value="3_months">3 Months</SelectItem>
                                        <SelectItem value="6_months">6 Months</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div>
                                <Label htmlFor="equipment">Available Equipment (comma-separated)</Label>
                                <Input
                                    id="equipment"
                                    value={formData.equipment}
                                    onChange={(e) => handleInputChange('equipment', e.target.value)}
                                    placeholder="dumbbells, resistance bands, yoga mat"
                                />
                            </div>
                            <div>
                                <Label htmlFor="dietaryRestrictions">Dietary Restrictions (comma-separated)</Label>
                                <Input
                                    id="dietaryRestrictions"
                                    value={formData.dietaryRestrictions}
                                    onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                                    placeholder="vegetarian, gluten-free, dairy-free"
                                />
                            </div>
                            <div>
                                <Label htmlFor="timezone">Timezone</Label>
                                <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                                        <SelectItem value="UTC">UTC</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {step === 4 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold">Review Your Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p><strong>Name:</strong> {formData.name}</p>
                                    <p><strong>Age:</strong> {formData.age}</p>
                                    <p><strong>Height:</strong> {formData.height} cm</p>
                                    <p><strong>Weight:</strong> {formData.weight} kg</p>
                                </div>
                                <div>
                                    <p><strong>Activity Level:</strong> {formData.activityLevel}</p>
                                    <p><strong>Primary Goal:</strong> {formData.goal}</p>
                                    <p><strong>Equipment:</strong> {formData.equipment}</p>
                                    <p><strong>Timezone:</strong> {formData.timezone}</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
                            </Button>
                        </div>
                    )}

                    {/* Navigation buttons */}
                    {step < 4 && (
                        <div className="flex justify-between pt-4">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                disabled={step === 1}
                            >
                                Previous
                            </Button>
                            <Button onClick={nextStep}>
                                Next
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function OnboardingPage() {
    return (
        <ProtectedRoute>
            <OnboardingContent />
        </ProtectedRoute>
    );
}
