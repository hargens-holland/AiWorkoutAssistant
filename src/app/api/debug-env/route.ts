import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Check what environment variables are loaded
        const envVars = {
            NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
            GOOGLE_CLIENT_ID_LENGTH: process.env.GOOGLE_CLIENT_ID?.length || 0,
            GOOGLE_CLIENT_SECRET_LENGTH: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
            GOOGLE_CLIENT_ID_PREFIX: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...' || 'N/A',
            GOOGLE_CLIENT_SECRET_PREFIX: process.env.GOOGLE_CLIENT_SECRET?.substring(0, 10) + '...' || 'N/A',
        };

        return NextResponse.json({
            message: 'Environment variables check',
            envVars,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to check environment variables',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
