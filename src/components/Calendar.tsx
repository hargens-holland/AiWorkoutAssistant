'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
  description?: string;
  colorId?: string;
}

interface CalendarProps {
  userId: string;
}

export function Calendar({ userId }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [refreshToken, setRefreshToken] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Load tokens from localStorage or session
  useEffect(() => {
    // Try to get tokens from localStorage (from test page)
    const storedAccessToken = localStorage.getItem('google_access_token');
    const storedRefreshToken = localStorage.getItem('google_refresh_token');

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  // Handle OAuth callback when returning to calendar page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success' && !accessToken) {
      // We're returning from OAuth, automatically capture tokens from URL
      const accessTokenParam = urlParams.get('access_token');
      const refreshTokenParam = urlParams.get('refresh_token');

      if (accessTokenParam && refreshTokenParam) {
        // Set tokens and store in localStorage
        setAccessToken(accessTokenParam);
        setRefreshToken(refreshTokenParam);
        localStorage.setItem('google_access_token', accessTokenParam);
        localStorage.setItem('google_refresh_token', refreshTokenParam);

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);

        // Refresh events to show real Google Calendar data
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        fetchEvents(startOfMonth, endOfMonth);
      }
    }
  }, [accessToken, currentDate]);

  // Direct Google Calendar connection
  const connectGoogleCalendar = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/calendar/auth');
      const data = await response.json();

      if (data.authUrl) {
        console.log('Generated OAuth URL:', data.authUrl);

        // Open Google Calendar authorization in new window
        const popup = window.open(data.authUrl, '_blank', 'width=500,height=600');

        if (!popup) {
          alert('Popup blocked! Please allow popups for this site and try again.');
          setIsConnecting(false);
          return;
        }

        // Set up cross-window communication
        const messageHandler = (event: MessageEvent) => {
          if (event.data && event.data.type === 'GOOGLE_CALENDAR_CONNECTED') {
            const { accessToken, refreshToken } = event.data;

            // Set tokens and store in localStorage
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            localStorage.setItem('google_access_token', accessToken);
            localStorage.setItem('google_refresh_token', refreshToken);

            // Refresh events to show real Google Calendar data
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            fetchEvents(startOfMonth, endOfMonth);

            // Clean up
            window.removeEventListener('message', messageHandler);
            clearInterval(pollInterval);

            alert('✅ Google Calendar connected successfully! You can now see your real calendar events and add workouts.');
          } else if (event.data && event.data.type === 'GOOGLE_CALENDAR_ERROR') {
            // Handle OAuth errors
            alert('❌ Google Calendar connection failed: ' + event.data.error);

            // Clean up
            window.removeEventListener('message', messageHandler);
            clearInterval(pollInterval);
          }
        };

        // Listen for messages from popup
        window.addEventListener('message', messageHandler);

        // Also poll for URL changes as fallback
        const pollInterval = setInterval(() => {
          if (popup?.closed) {
            clearInterval(pollInterval);
            window.removeEventListener('message', messageHandler);

            // Check if we have tokens in URL params as fallback
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('auth') === 'success') {
              const accessTokenParam = urlParams.get('access_token');
              const refreshTokenParam = urlParams.get('refresh_token');

              if (accessTokenParam && refreshTokenParam) {
                // Set tokens and store in localStorage
                setAccessToken(accessTokenParam);
                setRefreshToken(refreshTokenParam);
                localStorage.setItem('google_access_token', accessTokenParam);
                localStorage.setItem('google_refresh_token', refreshTokenParam);

                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);

                // Refresh events to show real Google Calendar data
                const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                fetchEvents(startOfMonth, endOfMonth);

                alert('✅ Google Calendar connected successfully! You can now see your real calendar events and add workouts.');
              }
            }
          }
        }, 1000);

        alert('✅ Authorization popup opened! Please authorize Google Calendar access in the popup window.');
      } else {
        alert('❌ Failed to generate authorization URL');
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      alert('❌ Error connecting to Google Calendar');
    } finally {
      setIsConnecting(false);
    }
  };

  // Fetch events from Google Calendar
  const fetchEvents = async (startDate: Date, endDate: Date) => {
    if (!accessToken) {
      console.log('No access token available, using mock data');
      // Use mock data if no tokens available
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          summary: '💪 Morning Workout',
          start: { dateTime: new Date(startDate.getTime() + 9 * 60 * 60 * 1000).toISOString() },
          end: { dateTime: new Date(startDate.getTime() + 10 * 60 * 60 * 1000).toISOString() },
          description: 'Strength training - Upper body focus',
          colorId: '4'
        },
        {
          id: '2',
          summary: '🍽️ Lunch',
          start: { dateTime: new Date(startDate.getTime() + 12 * 60 * 60 * 1000).toISOString() },
          end: { dateTime: new Date(startDate.getTime() + 13 * 60 * 60 * 1000).toISOString() },
          description: 'Healthy meal plan - 600 calories',
          colorId: '2'
        }
      ];
      setEvents(mockEvents);
      return;
    }

    setIsLoading(true);
    try {
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      const response = await fetch(`/api/calendar/events/fetch?startDate=${startDateStr}&endDate=${endDateStr}&accessToken=${accessToken}&refreshToken=${refreshToken}`);

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);

        // If token was refreshed, update localStorage
        if (data.tokenRefreshed && data.newAccessToken) {
          localStorage.setItem('google_access_token', data.newAccessToken);
          setAccessToken(data.newAccessToken);
        }
      } else {
        console.error('Failed to fetch events:', response.statusText);
        // Fall back to mock data
        const mockEvents: CalendarEvent[] = [
          {
            id: '1',
            summary: '💪 Morning Workout',
            start: { dateTime: new Date(startDate.getTime() + 9 * 60 * 60 * 1000).toISOString() },
            end: { dateTime: new Date(startDate.getTime() + 10 * 60 * 60 * 1000).toISOString() },
            description: 'Strength training - Upper body focus',
            colorId: '4'
          }
        ];
        setEvents(mockEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fall back to mock data
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          summary: '💪 Morning Workout',
          start: { dateTime: new Date(startDate.getTime() + 9 * 60 * 60 * 1000).toISOString() },
          end: { dateTime: new Date(startDate.getTime() + 10 * 60 * 60 * 1000).toISOString() },
          description: 'Strength training - Upper body focus',
          colorId: '4'
        }
      ];
      setEvents(mockEvents);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    fetchEvents(startOfMonth, endOfMonth);
  }, [currentDate, accessToken]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddWorkout = async (workoutData: any) => {
    if (!accessToken) {
      alert('Please connect your Google Calendar first by clicking "Connect Google Calendar" above.');
      return;
    }

    try {
      // Generate default exercises based on workout type and focus
      const defaultExercises = generateDefaultExercises(workoutData.workoutType, workoutData.focus);
      
      const workoutEvent = {
        title: workoutData.title,
        date: workoutData.date,
        startTime: workoutData.startTime,
        duration: workoutData.duration,
        workoutType: workoutData.workoutType,
        exercises: defaultExercises,
        focus: workoutData.focus
      };

      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'workout',
          eventData: workoutEvent,
          accessToken: accessToken,
          refreshToken: refreshToken
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Refresh events to show the new workout
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        fetchEvents(startOfMonth, endOfMonth);
        
        setShowAddWorkout(false);
        alert(`Workout added successfully! Event ID: ${result.eventId}`);
      } else {
        const errorData = await response.json();
        alert(`Failed to add workout: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error adding workout:', error);
      alert('Error adding workout');
    }
  };

  // Generate default exercises based on workout type and focus
  const generateDefaultExercises = (workoutType: string, focus: string) => {
    const exercises: Array<{ name: string; sets: number; reps: string }> = [];
    
    if (workoutType === 'strength') {
      if (focus === 'full_body') {
        exercises.push(
          { name: 'Squats', sets: 3, reps: '10-12' },
          { name: 'Push-ups', sets: 3, reps: '8-12' },
          { name: 'Deadlifts', sets: 3, reps: '8-10' },
          { name: 'Pull-ups', sets: 3, reps: '5-8' },
          { name: 'Plank', sets: 3, reps: '30-60s' }
        );
      } else if (focus === 'upper_body') {
        exercises.push(
          { name: 'Push-ups', sets: 4, reps: '10-15' },
          { name: 'Pull-ups', sets: 4, reps: '6-10' },
          { name: 'Dips', sets: 3, reps: '8-12' },
          { name: 'Rows', sets: 3, reps: '10-12' },
          { name: 'Shoulder Press', sets: 3, reps: '8-10' }
        );
      } else if (focus === 'lower_body') {
        exercises.push(
          { name: 'Squats', sets: 4, reps: '12-15' },
          { name: 'Lunges', sets: 3, reps: '10 each leg' },
          { name: 'Deadlifts', sets: 3, reps: '8-10' },
          { name: 'Calf Raises', sets: 3, reps: '15-20' },
          { name: 'Glute Bridges', sets: 3, reps: '12-15' }
        );
      } else if (focus === 'core') {
        exercises.push(
          { name: 'Plank', sets: 3, reps: '45-60s' },
          { name: 'Crunches', sets: 3, reps: '15-20' },
          { name: 'Russian Twists', sets: 3, reps: '20 each side' },
          { name: 'Leg Raises', sets: 3, reps: '12-15' },
          { name: 'Mountain Climbers', sets: 3, reps: '30s' }
        );
      }
    } else if (workoutType === 'cardio') {
      exercises.push(
        { name: 'Running/Walking', sets: 1, reps: '20-30 minutes' },
        { name: 'Jumping Jacks', sets: 3, reps: '30 seconds' },
        { name: 'High Knees', sets: 3, reps: '30 seconds' },
        { name: 'Burpees', sets: 3, reps: '10-15' }
      );
    } else if (workoutType === 'flexibility') {
      exercises.push(
        { name: 'Hamstring Stretch', sets: 3, reps: '30 seconds each' },
        { name: 'Quad Stretch', sets: 3, reps: '30 seconds each' },
        { name: 'Chest Stretch', sets: 3, reps: '30 seconds each' },
        { name: 'Shoulder Stretch', sets: 3, reps: '30 seconds each' },
        { name: 'Cat-Cow Stretch', sets: 3, reps: '10 reps' }
      );
    } else if (workoutType === 'mixed') {
      exercises.push(
        { name: 'Warm-up', sets: 1, reps: '5 minutes' },
        { name: 'Strength Circuit', sets: 3, reps: '8-12 each' },
        { name: 'Cardio Burst', sets: 3, reps: '30 seconds' },
        { name: 'Cool-down', sets: 1, reps: '5 minutes' }
      );
    }
    
    return exercises;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <Button onClick={goToPreviousMonth} variant="outline">
            ← Previous
          </Button>
          <Button onClick={goToNextMonth} variant="outline">
            Next →
          </Button>
          <Button
            onClick={() => setShowAddWorkout(true)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!accessToken}
          >
            ➕ Add Workout
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      {!accessToken && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-800">
                🔗 <strong>Google Calendar not connected.</strong>
                <br />
                <span className="text-sm">Connect to see your real calendar events and add workouts directly.</span>
              </p>
            </div>
            <Button
              onClick={connectGoogleCalendar}
              disabled={isConnecting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isConnecting ? '🔄 Connecting...' : '🔗 Connect Google Calendar'}
            </Button>
          </div>
        </div>
      )}

      {/* Connection Success Message */}
      {accessToken && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-green-800">
              ✅ <strong>Google Calendar connected!</strong> You can now see your real events and add new workouts.
            </p>
            <Button
              onClick={() => {
                setAccessToken('');
                setRefreshToken('');
                localStorage.removeItem('google_access_token');
                localStorage.removeItem('google_refresh_token');
                setEvents([]);
              }}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              🔌 Disconnect
            </Button>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-semibold text-gray-700 bg-gray-50">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
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
                    className={`text-xs p-1 rounded truncate ${event.colorId === '4' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
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

