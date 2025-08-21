'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoal } from '@/contexts/GoalContext';

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
  description?: string;
  colorId?: string;
}

interface StoredPlan {
  id: string;
  goal_id: string;
  user_id: string;
  plan_data: any;
  created_at: string;
  updated_at: string;
}

interface CalendarProps {
  userId: string;
}

export function Calendar({ userId }: CalendarProps) {
  const { activeGoal } = useGoal();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [storedPlans, setStoredPlans] = useState<{
    workoutPlans: StoredPlan[];
    mealPlans: StoredPlan[];
  }>({ workoutPlans: [], mealPlans: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [showAddWorkout, setShowAddWorkout] = useState(false);



  // Fetch stored workout and meal plans
  useEffect(() => {
    if (activeGoal?.id) {
      fetchStoredPlans();
    }
  }, [userId, activeGoal?.id]);

  const fetchStoredPlans = async () => {
    if (!activeGoal?.id) {
      console.log('No active goal, skipping plan fetch');
      return;
    }

    try {
      console.log('Fetching plans for userId:', userId, 'goalId:', activeGoal.id);

      // Fetch workout plans
      const workoutResponse = await fetch(`/api/workout-plans?userId=${userId}&goalId=${activeGoal.id}`);
      if (!workoutResponse.ok) {
        const errorText = await workoutResponse.text();
        console.error('Workout plans API error:', workoutResponse.status, errorText);
      }
      const workoutData = workoutResponse.ok ? await workoutResponse.json() : { workoutPlans: [] };
      const workoutPlans = workoutData.workoutPlans || [];

      // Fetch meal plans
      const mealResponse = await fetch(`/api/meal-plans?userId=${userId}&goalId=${activeGoal.id}`);
      if (!mealResponse.ok) {
        const errorText = await mealResponse.text();
        console.error('Meal plans API error:', mealResponse.status, errorText);
      }
      const mealData = mealResponse.ok ? await mealResponse.json() : { mealPlans: [] };
      const mealPlans = mealData.mealPlans || [];

      console.log('Fetched workout plans:', workoutPlans.length);
      console.log('Fetched meal plans:', mealPlans.length);

      setStoredPlans({ workoutPlans, mealPlans });

      // Convert plans to calendar events
      const planEvents = convertPlansToEvents(workoutPlans, mealPlans);
      console.log('Converted to calendar events:', planEvents.length);
      setEvents(planEvents);
    } catch (error) {
      console.error('Error fetching stored plans:', error);
    }
  };

  const convertPlansToEvents = (workoutPlans: StoredPlan[], mealPlans: StoredPlan[]): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // Convert workout plans to events
    workoutPlans.forEach(plan => {
      if (plan.plan_data?.weekly_schedule) {
        plan.plan_data.weekly_schedule.forEach((workout: any) => {
          const nextOccurrence = getNextDayOccurrence(workout.day, 9); // 9 AM workouts
          const endTime = new Date(nextOccurrence.getTime() + 45 * 60 * 1000); // 45 min duration

          events.push({
            id: `workout-${plan.id}-${workout.day}`,
            summary: `🏋️ ${workout.workout_type}`,
            start: { dateTime: nextOccurrence.toISOString() },
            end: { dateTime: endTime.toISOString() },
            description: formatWorkoutDescription(workout),
            colorId: '1' // Blue for workouts
          });
        });
      }
    });

    // Convert meal plans to events
    mealPlans.forEach(plan => {
      if (plan.plan_data?.weekly_meals) {
        plan.plan_data.weekly_meals.forEach((dayMeals: any) => {
          dayMeals.meals.forEach((meal: any) => {
            let startHour = 8; // Default breakfast time
            if (meal.meal === 'lunch') startHour = 12;
            else if (meal.meal === 'dinner') startHour = 18;
            else if (meal.meal === 'snack') startHour = 15;

            const startTime = getNextDayOccurrence(dayMeals.day, startHour);
            const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 min meal

            events.push({
              id: `meal-${plan.id}-${dayMeals.day}-${meal.meal}`,
              summary: `🍽️ ${meal.name}`,
              start: { dateTime: startTime.toISOString() },
              end: { dateTime: endTime.toISOString() },
              description: formatMealDescription(meal),
              colorId: '2' // Green for meals
            });
          });
        });
      }
    });

    return events;
  };

  const getNextDayOccurrence = (dayName: string, startHour: number = 9) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDay = days.indexOf(dayName.toLowerCase());
    const today = new Date();
    const currentDay = today.getDay();

    let daysUntilTarget = targetDay - currentDay;
    if (daysUntilTarget <= 0) daysUntilTarget += 7; // Next week

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    targetDate.setHours(startHour, 0, 0, 0);

    return targetDate;
  };

  const formatWorkoutDescription = (workout: any) => {
    const exercises = workout.exercises?.map((ex: any) =>
      `• ${ex.name}: ${ex.sets}x${ex.reps} @ ${ex.weight}\n  ${ex.notes || ''}`
    ).join('\n\n') || 'No exercises specified';

    const stretching = workout.stretching?.map((stretch: string) => `• ${stretch}`).join('\n') || 'No stretching specified';

    return `🏋️ ${workout.workout_type.toUpperCase()}\n\n💪 EXERCISES:\n${exercises}\n\n🧘 STRETCHING:\n${stretching}`;
  };

  const formatMealDescription = (meal: any) => {
    const ingredients = meal.ingredients?.map((ing: any) => `• ${ing.name}: ${ing.amount}`).join('\n') || 'No ingredients specified';
    const nutrition = meal.nutrition ? `\n\n📊 NUTRITION:\n• Calories: ${meal.nutrition.calories}\n• Protein: ${meal.nutrition.protein}g\n• Carbs: ${meal.nutrition.carbs}g\n• Fat: ${meal.nutrition.fat}g` : '';

    return `🍽️ ${meal.name.toUpperCase()}\n\n🥗 INGREDIENTS:\n${ingredients}${nutrition}`;
  };





  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddWorkout = (workoutData: any) => {
    // Handle adding workout to calendar
    console.log('Adding workout:', workoutData);
    setShowAddWorkout(false);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Show message if no active goal
  if (!activeGoal) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg mb-4">
          📅 No active fitness goal selected
        </div>
        <p className="text-gray-400">
          Please create or select an active fitness goal to view your workout and meal plans in the calendar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={() => fetchStoredPlans()}
            variant="outline"
            disabled={isLoading}
          >
            🔄 Refresh Plans
          </Button>
          <Button onClick={goToPreviousMonth} variant="outline">
            ← Previous
          </Button>
          <Button onClick={goToNextMonth} variant="outline">
            Next →
          </Button>
          <Button
            onClick={() => setShowAddWorkout(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            ➕ Add Workout
          </Button>
        </div>
      </div>



      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-semibold text-gray-700 bg-gray-50">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day: Date | null, index: number) => {
          if (!day) {
            return <div key={index} className="p-2 bg-gray-50" />;
          }

          const dayEvents = getEventsForDate(day);
          const isToday = day.toDateString() === new Date().toDateString();
          const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`p-2 min-h-[100px] border cursor-pointer transition-colors ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="text-sm font-medium text-gray-900 mb-1">
                {day.getDate()}
              </div>

              {/* Event previews */}
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate ${event.colorId === '1' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}
                    title={event.summary}
                  >
                    {event.summary}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading events...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{event.summary}</h4>
                      <p className="text-sm text-gray-600">
                        {formatTime(event.start.dateTime)} - {formatTime(event.end.dateTime)}
                      </p>
                      {event.description && (
                        <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                      )}
                    </div>
                    <Checkbox
                      id={`event-${event.id}`}
                      className="ml-4"
                    />
                    <label htmlFor={`event-${event.id}`} className="text-sm text-gray-600 ml-2">
                      Complete
                    </label>
                  </div>
                ))}

                {getEventsForDate(selectedDate).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No events scheduled for this day</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Workout Modal */}
      {showAddWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add Workout to Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <AddWorkoutForm
                onSubmit={handleAddWorkout}
                onCancel={() => setShowAddWorkout(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Add Workout Form Component
function AddWorkoutForm({ onSubmit, onCancel }: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    duration: 45,
    workoutType: 'strength',
    focus: 'full_body'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Workout Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Morning Workout"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="15"
            max="180"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Workout Type</label>
          <select
            value={formData.workoutType}
            onChange={(e) => setFormData({ ...formData, workoutType: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Focus Area</label>
        <select
          value={formData.focus}
          onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="full_body">Full Body</option>
          <option value="upper_body">Upper Body</option>
          <option value="lower_body">Lower Body</option>
          <option value="core">Core</option>
        </select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          Add Workout
        </Button>
        <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}