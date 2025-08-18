import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: 'Start date and end date required' },
                { status: 400 }
            );
        }

        if (!accessToken) {
            return NextResponse.json(
                { error: 'Access token required' },
                { status: 401 }
            );
        }

        const calendarService = new GoogleCalendarService();
        calendarService.setCredentials(accessToken, refreshToken);

        try {
            const events = await calendarService.getEvents(startDate, endDate);

            return NextResponse.json({
                message: 'Events fetched successfully',
                events: events.map(event => ({
                    id: event.id,
                    summary: event.summary,
                    start: event.start,
                    end: event.end,
                    description: event.description,
                    colorId: event.colorId,
                    extendedProperties: event.extendedProperties
                }))
            });
        } catch (error: any) {
            // Check if it's an authentication error and we have a refresh token
            if (error.message?.includes('401') || error.message?.includes('authentication') || error.message?.includes('credentials')) {
                console.log('🔐 Authentication error detected, attempting automatic token refresh...');

                try {
                    // Try to refresh the token automatically
                    if (refreshToken) {
                        const refreshResponse = await fetch(`${request.nextUrl.origin}/api/calendar/refresh`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ refreshToken })
                        });

                        if (refreshResponse.ok) {
                            const refreshResult = await refreshResponse.json();
                            console.log('✅ Token refreshed automatically, retrying event fetch...');

                            // Retry the event fetch with the new token
                            const retryResponse = await fetch(`${request.nextUrl.origin}/api/calendar/events/fetch?startDate=${startDate}&endDate=${endDate}&accessToken=${refreshResult.access_token}&refreshToken=${refreshToken}`);

                            if (retryResponse.ok) {
                                const retryResult = await retryResponse.json();
                                return NextResponse.json({
                                    message: 'Events fetched successfully after token refresh',
                                    events: retryResult.events,
                                    tokenRefreshed: true
                                });
                            }
                        }
                    }
                } catch (refreshError) {
                    console.error('❌ Automatic token refresh failed:', refreshError);
                }
            }

            throw error;
        }

    } catch (error) {
        console.error('Error fetching calendar events:', error);

        let errorMessage = 'Failed to fetch calendar events';
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
