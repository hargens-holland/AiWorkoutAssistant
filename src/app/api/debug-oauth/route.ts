import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
    try {
        const calendarService = new GoogleCalendarService();
        const authUrl = calendarService.getAuthUrl();
        
        // Check environment variables
        const envCheck = {
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing',
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
            GOOGLE_CALENDAR_REDIRECT_URI: process.env.GOOGLE_CALENDAR_REDIRECT_URI || 'Not set',
            NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
        };

        return NextResponse.json({
            message: 'OAuth configuration debug info',
            authUrl,
            envCheck,
            redirectUri: 'http://localhost:3000/api/calendar/callback',
            currentOrigin: request.nextUrl.origin,
        });
    } catch (error) {
        console.error('Error in OAuth debug:', error);
        return NextResponse.json(
            { error: 'Failed to debug OAuth configuration', details: String(error) },
            { status: 500 }
        );
    }
}
