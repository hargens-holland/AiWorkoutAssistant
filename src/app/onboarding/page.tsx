'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        height: '',
        weight: '',
        activityLevel: '',
        goal: '',
        equipment: '',
        dietaryRestrictions: '',
        timezone: 'America/New_York'
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        // TODO: Implement profile creation
        console.log('Submitting profile:', formData);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to FitSmith!</h1>
                <p className="text-gray-600">Let's get to know you better to create your personalized plan.</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / 4) * 100}%` }}
                ></div>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Tell us about yourself</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Activity & Goals */}
            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Activity Level & Goals</CardTitle>
                        <CardDescription>Help us understand your current fitness level and objectives</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="activityLevel">Activity Level</Label>
                            <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your activity level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                                    <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                                    <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                                    <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                                    <SelectItem value="very_active">Very Active (hard exercise daily)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="goal">Primary Goal</Label>
                            <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="What's your main fitness goal?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                                    <SelectItem value="build_muscle">Build Muscle</SelectItem>
                                    <SelectItem value="improve_fitness">Improve Fitness</SelectItem>
                                    <SelectItem value="maintain">Maintain Current Level</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Equipment & Diet */}
            {step === 3 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Equipment & Dietary Preferences</CardTitle>
                        <CardDescription>What equipment do you have access to?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="equipment">Available Equipment</Label>
                            <Textarea
                                id="equipment"
                                value={formData.equipment}
                                onChange={(e) => handleInputChange('equipment', e.target.value)}
                                placeholder="e.g., dumbbells, resistance bands, pull-up bar, gym access..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                            <Textarea
                                id="dietaryRestrictions"
                                value={formData.dietaryRestrictions}
                                onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                                placeholder="e.g., vegetarian, gluten-free, no dairy..."
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 4: Review & Submit */}
            {step === 4 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Review Your Information</CardTitle>
                        <CardDescription>Please review your details before we create your plan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Age:</strong> {formData.age}</p>
                            <p><strong>Height:</strong> {formData.height} cm</p>
                            <p><strong>Weight:</strong> {formData.weight} kg</p>
                            <p><strong>Activity Level:</strong> {formData.activityLevel}</p>
                            <p><strong>Goal:</strong> {formData.goal}</p>
                            <p><strong>Equipment:</strong> {formData.equipment}</p>
                            <p><strong>Dietary Restrictions:</strong> {formData.dietaryRestrictions}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                >
                    Previous
                </Button>

                {step < 4 ? (
                    <Button onClick={nextStep}>
                        Next
                    </Button>
                ) : (
                    <Button onClick={handleSubmit}>
                        Create My Plan
                    </Button>
                )}
            </div>
        </div>
    );
}
