import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { refreshToken } = body;

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'Refresh token required' },
                { status: 400 }
            );
        }

        // Create OAuth2Client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'http://localhost:3000/api/calendar/callback'
        );

        // Set the refresh token
        oauth2Client.setCredentials({
            refresh_token: refreshToken,
        });

        try {
            // Attempt to refresh the access token
            const { credentials } = await oauth2Client.refreshAccessToken();

            if (credentials.access_token) {
                return NextResponse.json({
                    message: 'Access token refreshed successfully',
                    access_token: credentials.access_token,
                    expiry_date: credentials.expiry_date,
                });
            } else {
                return NextResponse.json(
                    { error: 'No access token received from refresh' },
                    { status: 400 }
                );
            }
        } catch (refreshError) {
            console.error('Error refreshing access token:', refreshError);
            return NextResponse.json(
                { error: 'Failed to refresh access token. You may need to re-authorize.' },
                { status: 401 }
            );
        }

    } catch (error) {
        console.error('Error in token refresh endpoint:', error);
        return NextResponse.json(
            { error: 'Internal server error during token refresh' },
            { status: 500 }
        );
    }
}
