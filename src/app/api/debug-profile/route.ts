import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || 'hollandhargens@gmail.com';

        // Test 1: Basic Supabase connection
        let connectionTest = 'unknown';
        try {
            const { data, error } = await supabaseAdmin.auth.admin.listUsers();
            connectionTest = error ? `failed: ${error.message}` : 'successful';
        } catch (err) {
            connectionTest = `exception: ${err instanceof Error ? err.message : 'Unknown error'}`;
        }

        // Test 2: Check if user_profile table exists and is accessible
        let tableTest = 'unknown';
        let tableStructure = null;
        try {
            const { data, error } = await supabaseAdmin
                .from('user_profile')
                .select('*')
                .limit(0); // This gives us column info without data

            if (error) {
                tableTest = `failed: ${error.message}`;
            } else {
                tableTest = 'successful';
                // Try to get table structure
                try {
                    const { data: structureData, error: structureError } = await supabaseAdmin
                        .from('user_profile')
                        .select('*')
                        .limit(1);

                    if (structureError) {
                        tableStructure = `Error getting structure: ${structureError.message}`;
                    } else {
                        tableStructure = 'Table structure accessible';
                    }
                } catch (err) {
                    tableStructure = `Exception getting structure: ${err instanceof Error ? err.message : 'Unknown error'}`;
                }
            }
        } catch (err) {
            tableTest = `exception: ${err instanceof Error ? err.message : 'Unknown error'}`;
        }

        // Test 3: Try to query with the specific userId
        let queryTest = 'unknown';
        let queryResult = null;
        try {
            const { data, error } = await supabaseAdmin
                .from('user_profile')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) {
                queryTest = `failed: ${error.message}`;
                queryResult = { error: error.message, code: error.code };
            } else {
                queryTest = 'successful';
                queryResult = data;
            }
        } catch (err) {
            queryTest = `exception: ${err instanceof Error ? err.message : 'Unknown error'}`;
        }

        return NextResponse.json({
            message: 'Profile API Debug Information',
            tests: {
                connectionTest,
                tableTest,
                queryTest
            },
            details: {
                userId,
                tableStructure,
                queryResult
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return NextResponse.json({
            error: 'Debug endpoint failed',
            details: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
