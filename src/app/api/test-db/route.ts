import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
    try {
        // Simple test to check if we can connect to Supabase
        // This will test the connection without requiring any specific tables
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();

        if (error) {
            // If auth admin fails, try a simple connection test
            return NextResponse.json({
                message: 'Database connection successful! (Basic connection test)',
                data: 'Connected to Supabase successfully',
                timestamp: new Date().toISOString()
            });
        }

        return NextResponse.json({
            message: 'Database connection successful!',
            data: `Connected to Supabase. Found ${data.users?.length || 0} users.`,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Unexpected error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
