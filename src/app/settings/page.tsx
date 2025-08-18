'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, User, Shield, Download, Trash2 } from 'lucide-react';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        timezone: 'America/New_York',
        calendarSync: true,
        emailNotifications: true,
        pushNotifications: false
    });

    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        height: '175',
        weight: '70',
        activityLevel: 'moderate'
    });

    const handleProfileUpdate = async () => {
        // TODO: Implement profile update API call
        console.log('Updating profile:', profile);
    };

    const handleCalendarSync = async () => {
        // TODO: Implement Google Calendar OAuth
        console.log('Connecting to Google Calendar...');
    };

    const handleExportData = async () => {
        // TODO: Implement data export
        console.log('Exporting user data...');
    };

    const handleDeleteAccount = async () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // TODO: Implement account deletion
            console.log('Deleting account...');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your account and preferences</p>
            </div>

            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Profile Information
                    </CardTitle>
                    <CardDescription>Update your personal information and fitness profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={profile.name}
                                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input
                                id="height"
                                type="number"
                                value={profile.height}
                                onChange={(e) => setProfile(prev => ({ ...prev, height: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                value={profile.weight}
                                onChange={(e) => setProfile(prev => ({ ...prev, weight: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="activityLevel">Activity Level</Label>
                        <Select
                            value={profile.activityLevel}
                            onValueChange={(value) => setProfile(prev => ({ ...prev, activityLevel: value }))}
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

            {/* Calendar & Sync Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        Calendar & Sync
                    </CardTitle>
                    <CardDescription>Manage your Google Calendar integration and timezone</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="timezone">Timezone</Label>
                            <p className="text-sm text-gray-600">Used for scheduling workouts and meals</p>
                        </div>
                        <Select
                            value={settings.timezone}
                            onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                                <SelectItem value="America/Chicago">Central Time</SelectItem>
                                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                                <SelectItem value="Europe/London">London</SelectItem>
                                <SelectItem value="Europe/Paris">Paris</SelectItem>
                                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Google Calendar Sync</Label>
                            <p className="text-sm text-gray-600">Automatically sync workouts and meals to your calendar</p>
                        </div>
                        <Switch
                            checked={settings.calendarSync}
                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, calendarSync: checked }))}
                        />
                    </div>

                    {settings.calendarSync && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-blue-900">Calendar Connected</p>
                                    <p className="text-sm text-blue-700">john.doe@gmail.com</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleCalendarSync}>
                                    Reconnect
                                </Button>
                            </div>
                        </div>
                    )}

                    {!settings.calendarSync && (
                        <Button onClick={handleCalendarSync} className="w-full">
                            Connect Google Calendar
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-purple-600" />
                        Notifications
                    </CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-gray-600">Weekly progress reports and plan updates</p>
                        </div>
                        <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-gray-600">Workout reminders and daily check-ins</p>
                        </div>
                        <Switch
                            checked={settings.pushNotifications}
                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Export your data or delete your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Export Data</Label>
                            <p className="text-sm text-gray-600">Download all your fitness data and plans</p>
                        </div>
                        <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Delete Account</Label>
                            <p className="text-sm text-gray-600">Permanently remove your account and all data</p>
                        </div>
                        <Button variant="destructive" onClick={handleDeleteAccount} className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
