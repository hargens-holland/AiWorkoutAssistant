import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { goalId, userId, name, description, dailyCalories, macros, meals } = body;

        if (!goalId || !userId || !name || !dailyCalories || !macros || !meals) {
            return NextResponse.json(
                { error: 'Missing required fields: goalId, userId, name, dailyCalories, macros, meals' },
                { status: 400 }
            );
        }

        // Create the meal plan
        const { data: mealPlan, error: planError } = await supabase
            .from('meal_plans')
            .insert([{
                goal_id: goalId,
                user_id: userId,
                name,
                description: description || '',
                daily_calories: dailyCalories,
                protein_grams: macros.protein,
                carbs_grams: macros.carbs,
                fat_grams: macros.fat,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (planError) {
            console.error('Error creating meal plan:', planError);
            return NextResponse.json(
                { error: 'Failed to create meal plan' },
                { status: 500 }
            );
        }

        // Create daily meals
        for (const dailyMeal of meals) {
            const { data: dailyData, error: dailyError } = await supabase
                .from('daily_meals')
                .insert([{
                    meal_plan_id: mealPlan.id,
                    day: dailyMeal.day,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (dailyError) {
                console.error('Error creating daily meal:', dailyError);
                continue;
            }

            // Create meals for this day
            for (const meal of dailyMeal.meals) {
                const { data: mealData, error: mealError } = await supabase
                    .from('meals')
                    .insert([{
                        daily_meal_id: dailyData.id,
                        type: meal.type,
                        name: meal.name,
                        calories: meal.calories,
                        protein: meal.protein,
                        carbs: meal.carbs,
                        fat: meal.fat,
                        prep_time: meal.prepTime,
                        cook_time: meal.cookTime,
                        created_at: new Date().toISOString()
                    }])
                    .select()
                    .single();

                if (mealError) {
                    console.error('Error creating meal:', mealError);
                    continue;
                }

                // Create ingredients
                if (meal.ingredients && meal.ingredients.length > 0) {
                    const ingredientData = meal.ingredients.map((ingredient: string) => ({
                        meal_id: mealData.id,
                        ingredient,
                        created_at: new Date().toISOString()
                    }));

                    const { error: ingredientError } = await supabase
                        .from('meal_ingredients')
                        .insert(ingredientData);

                    if (ingredientError) {
                        console.error('Error creating ingredients:', ingredientError);
                    }
                }

                // Create instructions
                if (meal.instructions && meal.instructions.length > 0) {
                    const instructionData = meal.instructions.map((instruction: string, index: number) => ({
                        meal_id: mealData.id,
                        instruction,
                        step_order: index + 1,
                        created_at: new Date().toISOString()
                    }));

                    const { error: instructionError } = await supabase
                        .from('meal_instructions')
                        .insert(instructionData);

                    if (instructionError) {
                        console.error('Error creating instructions:', instructionError);
                    }
                }
            }
        }

        return NextResponse.json({
            message: 'Meal plan created successfully',
            mealPlan: {
                ...mealPlan,
                meals
            }
        });

    } catch (error) {
        console.error('Error in meal plans POST:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const goalId = searchParams.get('goalId');
        const userId = searchParams.get('userId');

        if (!goalId || !userId) {
            return NextResponse.json(
                { error: 'Goal ID and User ID are required' },
                { status: 400 }
            );
        }

        // Get the meal plan
        const { data: mealPlan, error: planError } = await supabase
            .from('meal_plans')
            .select('*')
            .eq('goal_id', goalId)
            .eq('user_id', userId)
            .single();

        if (planError) {
            return NextResponse.json(
                { error: 'Meal plan not found' },
                { status: 404 }
            );
        }

        // Get daily meals
        const { data: dailyMeals, error: dailyError } = await supabase
            .from('daily_meals')
            .select('*')
            .eq('meal_plan_id', mealPlan.id)
            .order('day');

        if (dailyError) {
            return NextResponse.json(
                { error: 'Failed to fetch daily meals' },
                { status: 500 }
            );
        }

        // Get meals, ingredients, and instructions for each day
        const planWithMeals = {
            ...mealPlan,
            meals: await Promise.all(
                dailyMeals.map(async (daily) => {
                    const { data: meals, error: mealError } = await supabase
                        .from('meals')
                        .select('*')
                        .eq('daily_meal_id', daily.id)
                        .order('created_at');

                    if (mealError) return { ...daily, meals: [] };

                    const mealsWithDetails = await Promise.all(
                        meals.map(async (meal) => {
                            // Get ingredients
                            const { data: ingredients, error: ingredientError } = await supabase
                                .from('meal_ingredients')
                                .select('ingredient')
                                .eq('meal_id', meal.id)
                                .order('created_at');

                            // Get instructions
                            const { data: instructions, error: instructionError } = await supabase
                                .from('meal_instructions')
                                .select('instruction')
                                .eq('meal_id', meal.id)
                                .order('step_order');

                            return {
                                type: meal.type,
                                name: meal.name,
                                calories: meal.calories,
                                protein: meal.protein,
                                carbs: meal.carbs,
                                fat: meal.fat,
                                prepTime: meal.prep_time,
                                cookTime: meal.cook_time,
                                ingredients: ingredients?.map(i => i.ingredient) || [],
                                instructions: instructions?.map(i => i.instruction) || []
                            };
                        })
                    );

                    return {
                        day: daily.day,
                        meals: mealsWithDetails
                    };
                })
            )
        };

        return NextResponse.json({ mealPlan: planWithMeals });

    } catch (error) {
        console.error('Error in meal plans GET:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
