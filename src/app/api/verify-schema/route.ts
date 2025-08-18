import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
    try {
        // Use Supabase-compatible approach to get schema info
        // First, let's try to query each table we expect to exist

        const expectedTables = [
            'users',
            'user_profile',
            'goals',
            'plans',
            'workouts',
            'meals',
            'logs'
        ];

        const schemaDetails: any = {};
        let existingTables: string[] = [];

        // Test each expected table by trying to query it
        for (const tableName of expectedTables) {
            try {
                // Try to get a single row from each table
                const { data, error } = await supabaseAdmin
                    .from(tableName)
                    .select('*')
                    .limit(1);

                if (error) {
                    // Table might not exist or have different structure
                    schemaDetails[tableName] = {
                        exists: false,
                        error: error.message
                    };
                } else {
                    // Table exists, let's get its structure
                    existingTables.push(tableName);

                    // Try to get column info by attempting to insert a test row
                    // (we'll rollback, this is just to see the structure)
                    const { data: testData, error: testError } = await supabaseAdmin
                        .from(tableName)
                        .select('*')
                        .limit(0); // This gives us column info without data

                    if (testError) {
                        schemaDetails[tableName] = {
                            exists: true,
                            error: testError.message
                        };
                    } else {
                        // Get table structure by looking at the response
                        schemaDetails[tableName] = {
                            exists: true,
                            status: 'accessible',
                            note: 'Table exists and is accessible'
                        };
                    }
                }
            } catch (err) {
                schemaDetails[tableName] = {
                    exists: false,
                    error: err instanceof Error ? err.message : 'Unknown error'
                };
            }
        }

        // Test specific features we added
        let hasStretchingSupport = false;
        let hasFlexibilityGoals = false;
        let hasFlexibilityMetrics = false;

        // Test workouts table for stretching support
        if (schemaDetails.workouts?.exists) {
            try {
                const { data, error } = await supabaseAdmin
                    .from('workouts')
                    .select('stretching_focus, focus')
                    .limit(1);

                if (!error) {
                    hasStretchingSupport = true;
                }
            } catch (err) {
                // Field might not exist
            }
        }

        // Test goals table for flexibility support
        if (schemaDetails.goals?.exists) {
            try {
                const { data, error } = await supabaseAdmin
                    .from('goals')
                    .select('goal_type')
                    .limit(1);

                if (!error) {
                    hasFlexibilityGoals = true;
                }
            } catch (err) {
                // Field might not exist
            }
        }

        // Test logs table for flexibility metrics
        if (schemaDetails.logs?.exists) {
            try {
                const { data, error } = await supabaseAdmin
                    .from('logs')
                    .select('flexibility_metrics')
                    .limit(1);

                if (!error) {
                    hasFlexibilityMetrics = true;
                }
            } catch (err) {
                // Field might not exist
            }
        }

        // Try to get actual table count
        let totalTables = 0;
        try {
            const { data: tableCount, error: countError } = await supabaseAdmin
                .rpc('get_table_count');

            if (!countError && tableCount) {
                totalTables = tableCount;
            }
        } catch (err) {
            // RPC might not exist, that's okay
        }

        return NextResponse.json({
            message: 'Schema verification complete!',
            summary: {
                expectedTables: expectedTables.length,
                existingTables: existingTables.length,
                existingTableNames: existingTables,
                hasStretchingSupport,
                hasFlexibilityGoals,
                hasFlexibilityMetrics
            },
            schemaDetails,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Schema verification failed',
                details: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
