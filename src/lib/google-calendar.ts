import { google } from 'googleapis';

export interface CalendarEvent {
    id?: string;
    summary: string;
    description: string;
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    colorId?: string;
    reminders?: {
        useDefault: boolean;
        overrides?: Array<{
            method: 'email' | 'popup';
            minutes: number;
        }>;
    };
    extendedProperties?: {
        private?: {
            workoutType?: string;
            mealType?: string;
            duration?: string;
            exercises?: string;
            calories?: string;
            focus?: string;
        };
    };
}

export interface WorkoutEvent {
    title: string;
    date: string;
    startTime: string;
    duration: number; // in minutes
    workoutType: string;
    exercises?: Array<{
        name: string;
        sets: number;
        reps: string;
    }>;
    focus: string;
}

export interface MealEvent {
    title: string;
    date: string;
    startTime: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    calories: number;
    macros?: {
        protein: number;
        carbs: number;
        fat: number;
    };
    ingredients?: string[];
    instructions?: string[];
}

export class GoogleCalendarService {
    private oauth2Client: any; // Changed from OAuth2Client to any as per new import
    private calendar: any;
    private refreshToken: string | undefined;
    private accessToken: string | undefined;

    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'http://localhost:3000/api/calendar/callback' // Fixed redirect URI
        );
    }

    // Set credentials from stored tokens
    setCredentials(accessToken: string, refreshToken?: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;

        this.oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        // Initialize the calendar API
        this.calendar = google.calendar({
            version: 'v3',
            auth: this.oauth2Client
        });

        console.log('Calendar API initialized:', !!this.calendar);
    }

    // Refresh access token automatically (private method)
    private async refreshAccessToken(): Promise<string> {
        if (!this.refreshToken) {
            throw new Error('No refresh token available for automatic refresh');
        }

        try {
            console.log('🔄 Automatically refreshing expired access token...');

            // Create a new OAuth2Client for refresh
            const refreshClient = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                'http://localhost:3000/api/calendar/callback'
            );

            refreshClient.setCredentials({
                refresh_token: this.refreshToken,
            });

            const { credentials } = await refreshClient.refreshAccessToken();

            if (credentials.access_token) {
                // Update our stored token
                this.accessToken = credentials.access_token;

                // Update the main OAuth2Client
                this.oauth2Client.setCredentials({
                    access_token: credentials.access_token,
                    refresh_token: this.refreshToken,
                });

                console.log('✅ Access token automatically refreshed successfully');
                return credentials.access_token;
            } else {
                throw new Error('No access token received from automatic refresh');
            }
        } catch (error) {
            console.error('❌ Error in automatic token refresh:', error);
            throw new Error('Automatic token refresh failed');
        }
    }

    // Create a workout event with automatic token refresh
    async createWorkoutEvent(workout: WorkoutEvent): Promise<string> {
        if (!this.calendar) {
            throw new Error('Calendar not initialized. Please set credentials first.');
        }

        const startDateTime = new Date(`${workout.date}T${workout.startTime}`);
        const endDateTime = new Date(startDateTime.getTime() + workout.duration * 60000);

        const event: CalendarEvent = {
            summary: `💪 ${workout.title}`,
            description: this.formatWorkoutDescription(workout),
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            colorId: '4', // Blue color for workouts
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'popup', minutes: 15 },
                    { method: 'email', minutes: 30 },
                ],
            },
            extendedProperties: {
                private: {
                    workoutType: workout.workoutType,
                    duration: `${workout.duration} minutes`,
                    exercises: workout.exercises ? JSON.stringify(workout.exercises) : undefined,
                    focus: workout.focus,
                },
            },
        };

        console.log('Creating workout event:', event);

        try {
            const response = await this.calendar.events.insert({
                calendarId: 'primary',
                resource: event,
            });

            console.log('Workout event created successfully:', response.data);
            return response.data.id;
        } catch (error: any) {
            // Check if it's an authentication error (401) and we have a refresh token
            if (error.code === 401 && this.refreshToken) {
                console.log('🔐 Authentication failed, attempting automatic token refresh...');
                try {
                    // Automatically refresh the token
                    await this.refreshAccessToken();

                    // Retry the request with the new token
                    console.log('🔄 Retrying event creation with refreshed token...');
                    const retryResponse = await this.calendar.events.insert({
                        calendarId: 'primary',
                        resource: event,
                    });

                    console.log('✅ Workout event created successfully after automatic token refresh:', retryResponse.data);
                    return retryResponse.data.id;
                } catch (refreshError) {
                    console.error('❌ Automatic token refresh failed:', refreshError);
                    throw new Error('Event creation failed after automatic token refresh attempt');
                }
            }

            console.error('Error creating workout event:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            throw new Error(`Failed to create workout event in Google Calendar: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Create a meal event
    async createMealEvent(meal: MealEvent): Promise<string> {
        if (!this.calendar) {
            throw new Error('Calendar not initialized. Please set credentials first.');
        }

        const startDateTime = new Date(`${meal.date}T${meal.startTime}`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60000); // 1 hour duration

        const event: CalendarEvent = {
            summary: `🍽️ ${meal.title}`,
            description: this.formatMealDescription(meal),
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            colorId: '3', // Blue color for meals
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'popup', minutes: 15 },
                ],
            },
            extendedProperties: {
                private: {
                    mealType: meal.mealType,
                    calories: meal.calories.toString(),
                },
            },
        };

        try {
            const response = await this.calendar.events.insert({
                calendarId: 'primary',
                resource: event,
            });

            return response.data.id;
        } catch (error) {
            console.error('Error creating meal event:', error);
            throw new Error('Failed to create meal event in Google Calendar');
        }
    }

    // Update an existing event
    async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<void> {
        if (!this.calendar) {
            throw new Error('Calendar not initialized. Please set credentials first.');
        }

        try {
            await this.calendar.events.update({
                calendarId: 'primary',
                eventId: eventId,
                resource: updates,
            });
        } catch (error) {
            console.error('Error updating event:', error);
            throw new Error('Failed to update event in Google Calendar');
        }
    }

    // Delete an event
    async deleteEvent(eventId: string): Promise<void> {
        if (!this.calendar) {
            throw new Error('Calendar not initialized. Please set credentials first.');
        }

        try {
            await this.calendar.events.delete({
                calendarId: 'primary',
                eventId: eventId,
            });
        } catch (error) {
            console.error('Error deleting event:', error);
            throw new Error('Failed to delete event from Google Calendar');
        }
    }

    // Get events for a specific date range
    async getEvents(startDate: string, endDate: string): Promise<any[]> {
        if (!this.calendar) {
            throw new Error('Calendar not initialized. Please set credentials first.');
        }

        try {
            const response = await this.calendar.events.list({
                calendarId: 'primary',
                timeMin: new Date(startDate).toISOString(),
                timeMax: new Date(endDate).toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
            });

            return response.data.items || [];
        } catch (error) {
            console.error('Error fetching events:', error);
            throw new Error('Failed to fetch events from Google Calendar');
        }
    }

    // Get authorization URL for OAuth flow
    getAuthUrl(): string {
        const scopes = [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
        ];

        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent',
        });
    }

    // Exchange authorization code for tokens
    async getTokensFromCode(code: string): Promise<{
        access_token: string;
        refresh_token?: string;
        expiry_date?: number;
    }> {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            return {
                access_token: tokens.access_token || '',
                refresh_token: tokens.refresh_token,
                expiry_date: tokens.expiry_date,
            };
        } catch (error) {
            console.error('Error getting tokens:', error);
            throw new Error('Failed to get access tokens');
        }
    }

    // Private helper methods
    private formatWorkoutDescription(workout: WorkoutEvent): string {
        const exerciseList = workout.exercises
            ? workout.exercises
                .map(ex => `• ${ex.name}: ${ex.sets} sets × ${ex.reps}`)
                .join('\n')
            : 'No exercises specified.';

        return `Workout Type: ${workout.workoutType}
Focus: ${workout.focus}
Duration: ${workout.duration} minutes

Exercises:
${exerciseList}

Generated by FitSmith AI`;
    }

    private formatMealDescription(meal: MealEvent): string {
        let description = `Meal Type: ${meal.mealType}
Calories: ${meal.calories}`;

        if (meal.macros) {
            description += `\nMacros: P${meal.macros.protein}g | C${meal.macros.carbs}g | F${meal.macros.fat}g`;
        }

        if (meal.ingredients && meal.ingredients.length > 0) {
            description += `\n\nKey Ingredients:\n${meal.ingredients.map(ing => `• ${ing}`).join('\n')}`;
        }

        if (meal.instructions && meal.instructions.length > 0) {
            description += `\n\nInstructions:\n${meal.instructions.map((inst, index) => `${index + 1}. ${inst}`).join('\n')}`;
        }

        description += '\n\nGenerated by FitSmith AI';
        return description;
    }
}
