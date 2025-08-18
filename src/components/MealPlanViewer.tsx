'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  cookTime: number;
  ingredients: string[];
  instructions: string[];
}

interface DailyMeal {
  day: number;
  meals: Meal[];
}

interface MealPlan {
  id: string;
  name: string;
  description: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: DailyMeal[];
}

interface MealPlanViewerProps {
  mealPlan: MealPlan | null;
  isLoading?: boolean;
}

export function MealPlanViewer({ mealPlan, isLoading = false }: MealPlanViewerProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [expandedMeals, setExpandedMeals] = useState<Set<string>>(new Set());

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading meal plan...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mealPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Meal Plan Yet</h3>
            <p className="text-gray-600 mb-6">
              Your AI agent will create a personalized meal plan based on your goal!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentDay = mealPlan.meals.find(m => m.day === selectedDay);
  const totalDays = Math.max(...mealPlan.meals.map(m => m.day));

  const toggleMealExpansion = (mealKey: string) => {
    const newExpanded = new Set(expandedMeals);
    if (newExpanded.has(mealKey)) {
      newExpanded.delete(mealKey);
    } else {
      newExpanded.add(mealKey);
    }
    setExpandedMeals(newExpanded);
  };

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800';
      case 'lunch': return 'bg-blue-100 text-blue-800';
      case 'dinner': return 'bg-purple-100 text-purple-800';
      case 'snack': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const calculateDailyTotals = (meals: Meal[]) => {
    return meals.reduce((totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fat: totals.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🍽️ {mealPlan.name}
        </CardTitle>
        <p className="text-gray-600">{mealPlan.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Daily Target: {mealPlan.dailyCalories} calories</span>
          <span>Protein: {mealPlan.macros.protein}g</span>
          <span>Carbs: {mealPlan.macros.carbs}g</span>
          <span>Fat: {mealPlan.macros.fat}g</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
            <Button
              key={day}
              variant={selectedDay === day ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDay(day)}
            >
              Day {day}
            </Button>
          ))}
        </div>

        {/* Current Day Display */}
        {currentDay && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Day {selectedDay} - {currentDay.meals.length} meals
            </h3>

            {/* Daily Nutrition Summary */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <h4 className="font-medium text-blue-900 mb-2">Daily Totals</h4>
                {(() => {
                  const totals = calculateDailyTotals(currentDay.meals);
                  return (
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-900">{totals.calories}</div>
                        <div className="text-xs text-blue-700">calories</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-900">{totals.protein}g</div>
                        <div className="text-xs text-blue-700">protein</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-900">{totals.carbs}g</div>
                        <div className="text-xs text-blue-700">carbs</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-900">{totals.fat}g</div>
                        <div className="text-xs text-blue-700">fat</div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              {currentDay.meals.map((meal, index) => (
                <Card key={index} className="border-l-4 border-green-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getMealTypeIcon(meal.type)}</span>
                        <div>
                          <h4 className="font-semibold">
                            {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}: {meal.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {meal.prepTime + meal.cookTime} min total
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getMealTypeColor(meal.type)}>
                          {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                        </Badge>
                        <Badge variant="outline">{meal.calories} cal</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleMealExpansion(`${selectedDay}-${meal.type}`)}
                        >
                          {expandedMeals.has(`${selectedDay}-${meal.type}`) ? 'Hide' : 'Show'} Details
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Meal Details (expandable) */}
                  {expandedMeals.has(`${selectedDay}-${meal.type}`) && (
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Nutrition Info */}
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div className="bg-gray-50 p-2 rounded">
                            <div className="text-sm font-medium text-gray-900">{meal.protein}g</div>
                            <div className="text-xs text-gray-600">Protein</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <div className="text-sm font-medium text-gray-900">{meal.carbs}g</div>
                            <div className="text-xs text-gray-600">Carbs</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <div className="text-sm font-medium text-gray-900">{meal.fat}g</div>
                            <div className="text-xs text-gray-600">Fat</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <div className="text-sm font-medium text-gray-900">{meal.prepTime + meal.cookTime}</div>
                            <div className="text-xs text-gray-600">Total Min</div>
                          </div>
                        </div>

                        {/* Ingredients */}
                        {meal.ingredients.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Ingredients:</h5>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                {meal.ingredients.map((ingredient, ingIndex) => (
                                  <li key={ingIndex} className="text-gray-700">{ingredient}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Instructions */}
                        {meal.instructions.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Instructions:</h5>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <ol className="list-decimal list-inside space-y-2 text-sm">
                                {meal.instructions.map((instruction, instIndex) => (
                                  <li key={instIndex} className="text-gray-700">{instruction}</li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
