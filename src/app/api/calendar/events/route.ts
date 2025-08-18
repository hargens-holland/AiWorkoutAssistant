import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService, WorkoutEvent, MealEvent } from '@/lib/google-calendar';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, eventData, accessToken, refreshToken } = body;

        console.log('Creating calendar event:', { type, eventData, hasAccessToken: !!accessToken });

        if (!accessToken) {
            return NextResponse.json(
                { error: 'Access token required' },
                { status: 401 }
            );
        }

        console.log('Initializing GoogleCalendarService...');
        const calendarService = new GoogleCalendarService();

        console.log('Setting credentials...');
        calendarService.setCredentials(accessToken, refreshToken);

        console.log('Credentials set, creating event...');

        let eventId: string;

        if (type === 'workout') {
            const workoutEvent: WorkoutEvent = eventData;
            console.log('Creating workout event:', workoutEvent);
            eventId = await calendarService.createWorkoutEvent(workoutEvent);
        } else if (type === 'meal') {
            const mealEvent: MealEvent = eventData;
            console.log('Creating meal event:', mealEvent);
            eventId = await calendarService.createMealEvent(mealEvent);
        } else {
            return NextResponse.json(
                { error: 'Invalid event type. Must be "workout" or "meal"' },
                { status: 400 }
            );
        }

        console.log('Event created successfully:', eventId);

        return NextResponse.json({
            message: `${type} event created successfully`,
            eventId,
            type
        });

    } catch (error: any) {
        console.error('Error creating calendar event:', error);

        // Get the request body for potential retry
        let requestBody;
        try {
            requestBody = await request.json();
        } catch (parseError) {
            console.log('Could not parse request body for retry');
        }

        // Check if it's an authentication error and we have a refresh token
        if (error.message?.includes('401') || error.message?.includes('authentication') || error.message?.includes('credentials')) {
            console.log('🔐 Authentication error detected, attempting automatic token refresh...');

            try {
                // Try to refresh the token automatically
                if (requestBody?.refreshToken) {
                    const refreshResponse = await fetch(`${request.nextUrl.origin}/api/calendar/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken: requestBody.refreshToken })
                    });

                    if (refreshResponse.ok) {
                        const refreshResult = await refreshResponse.json();
                        console.log('✅ Token refreshed automatically, retrying event creation...');

                        // Retry the event creation with the new token
                        const retryResponse = await fetch(`${request.nextUrl.origin}/api/calendar/events`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...requestBody,
                                accessToken: refreshResult.access_token
                            })
                        });

                        if (retryResponse.ok) {
                            const retryResult = await retryResponse.json();
                            return NextResponse.json({
                                message: `${requestBody.type} event created successfully after token refresh`,
                                eventId: retryResult.eventId,
                                type: requestBody.type,
                                tokenRefreshed: true
                            });
                        }
                    }
                }
            } catch (refreshError) {
                console.error('❌ Automatic token refresh failed:', refreshError);
            }
        }

        // Return more detailed error information
        let errorMessage = 'Failed to create calendar event';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            {
                error: errorMessage,
                details: error instanceof Error ? error.stack : String(error)
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { eventId, updates, accessToken, refreshToken } = body;

        if (!accessToken || !eventId) {
            return NextResponse.json(
                { error: 'Access token and event ID required' },
                { status: 400 }
            );
        }

        const calendarService = new GoogleCalendarService();
        calendarService.setCredentials(accessToken, refreshToken);

        await calendarService.updateEvent(eventId, updates);

        return NextResponse.json({
            message: 'Event updated successfully',
            eventId
        });

    } catch (error) {
        console.error('Error updating calendar event:', error);
        return NextResponse.json(
            { error: 'Failed to update calendar event' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId');
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');

        if (!accessToken || !eventId) {
            return NextResponse.json(
                { error: 'Access token and event ID required' },
                { status: 400 }
            );
        }

        const calendarService = new GoogleCalendarService();
        calendarService.setCredentials(accessToken, refreshToken || undefined);

        await calendarService.deleteEvent(eventId);

        return NextResponse.json({
            message: 'Event deleted successfully',
            eventId
        });

    } catch (error) {
        console.error('Error deleting calendar event:', error);
        return NextResponse.json(
            { error: 'Failed to delete calendar event' },
            { status: 500 }
        );
    }
}
