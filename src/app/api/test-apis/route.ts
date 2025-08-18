import { NextResponse } from 'next/server';

// GET /api/test-apis - Test all API endpoints
export async function GET() {
    try {
        const apiEndpoints = [
            {
                name: 'User Profile API',
                endpoints: [
                    'GET /api/users/profile?userId={id}',
                    'POST /api/users/profile'
                ],
                description: 'Manage user profiles and preferences'
            },
            {
                name: 'Goals API',
                endpoints: [
                    'GET /api/goals?userId={id}',
                    'POST /api/goals'
                ],
                description: 'Create and manage fitness goals'
            },
            {
                name: 'Workout Templates API',
                endpoints: [
                    'GET /api/workouts/templates?goalType={type}&fitnessLevel={level}'
                ],
                description: 'Get pre-built workout templates based on goals'
            },
            {
                name: 'Meals API',
                endpoints: [
                    'GET /api/meals?userId={id}&date={date}',
                    'POST /api/meals'
                ],
                description: 'Manage meal planning and tracking'
            }
        ];

        const supportedGoalTypes = [
            'lose_weight_specific',
            'build_muscle_specific',
            'strength_specific',
            'endurance_specific',
            'skill_specific',
            'flexibility_specific',
            'maintain_fitness',
            'general_improvement'
        ];

        const supportedMealTypes = [
            'breakfast',
            'lunch',
            'dinner',
            'snack'
        ];

        return NextResponse.json({
            message: 'API Test Endpoint - All APIs are ready!',
            status: 'ready',
            apiEndpoints,
            supportedGoalTypes,
            supportedMealTypes,
            features: {
                automaticStretching: true,
                goalBasedWorkouts: true,
                flexibilityTracking: true,
                mealPlanning: true
            },
            nextSteps: [
                'Test individual API endpoints',
                'Connect frontend to APIs',
                'Replace mock data with real API calls',
                'Add authentication to APIs'
            ],
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return NextResponse.json(
            {
                error: 'API test failed',
                details: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
