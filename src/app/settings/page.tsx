'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function SettingsContent() {
    const [profileData, setProfileData] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        height: '175',
        weight: '70',
        activityLevel: 'moderate'
    });

    const [notifications, setNotifications] = useState({
        workoutReminders: true,
        mealReminders: true,
        progressUpdates: false,
        weeklyReports: true
    });

    const handleProfileUpdate = () => {
        console.log('Profile updated:', profileData);
        // TODO: Implement profile update API call
    };

    const handleNotificationToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleDataExport = () => {
        console.log('Exporting data...');
        // TODO: Implement data export
    };

    const handleAccountDeletion = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            console.log('Account deletion requested...');
            // TODO: Implement account deletion
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your account preferences and settings</p>
            </div>

            {/* Profile Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={profileData.name}
                                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input
                                id="height"
                                type="number"
                                value={profileData.height}
                                onChange={(e) => setProfileData(prev => ({ ...prev, height: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                value={profileData.weight}
                                onChange={(e) => setProfileData(prev => ({ ...prev, weight: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="activityLevel">Activity Level</Label>
                        <Select
                            value={profileData.activityLevel}
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, activityLevel: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sedentary">Sedentary</SelectItem>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="very_active">Very Active</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleProfileUpdate}>Update Profile</Button>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        {Object.entries(notifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <Label htmlFor={key} className="capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </Label>
                                <input
                                    id={key}
                                    type="checkbox"
                                    checked={value}
                                    onChange={() => handleNotificationToggle(key as keyof typeof notifications)}
                                    className="rounded"
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Export your data or manage your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleDataExport}>
                            Export My Data
                        </Button>
                        <Button variant="destructive" onClick={handleAccountDeletion}>
                            Delete Account
                        </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                        Export your data as a JSON file containing your profile, goals, and progress data.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <ProtectedRoute>
            <SettingsContent />
        </ProtectedRoute>
    );
}
