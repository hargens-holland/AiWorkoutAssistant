import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            return NextResponse.json(
                { error: 'Authorization failed', details: error },
                { status: 400 }
            );
        }

        if (!code) {
            return NextResponse.json(
                { error: 'Authorization code not provided' },
                { status: 400 }
            );
        }

        const calendarService = new GoogleCalendarService();
        const tokens = await calendarService.getTokensFromCode(code);

        // TODO: Store tokens securely in database associated with user
        // For now, we'll return them (in production, encrypt and store in DB)

        // Redirect to the callback page that will handle cross-window communication
        const redirectUrl = new URL('/calendar/callback', request.url);
        redirectUrl.searchParams.set('auth', 'success');
        redirectUrl.searchParams.set('access_token', tokens.access_token);
        redirectUrl.searchParams.set('refresh_token', tokens.refresh_token || '');

        return NextResponse.redirect(redirectUrl);

    } catch (error) {
        console.error('Error in calendar callback:', error);

        // Redirect back to test page with error
        const redirectUrl = new URL('/calendar/test', request.url);
        redirectUrl.searchParams.set('auth', 'error');
        redirectUrl.searchParams.set('error', 'Authorization callback failed');

        return NextResponse.redirect(redirectUrl);
    }
}
