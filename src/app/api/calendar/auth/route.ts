import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
    try {
        const calendarService = new GoogleCalendarService();
        const authUrl = calendarService.getAuthUrl();

        return NextResponse.json({
            authUrl,
            message: 'Google Calendar authorization URL generated'
        });
    } catch (error) {
        console.error('Error generating auth URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate authorization URL' },
            { status: 500 }
        );
    }
}
