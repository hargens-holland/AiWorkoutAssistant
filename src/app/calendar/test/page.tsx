'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function TestCalendarContent() {
  const { data: session } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [eventResult, setEventResult] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [refreshToken, setRefreshToken] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if we're returning from OAuth and automatically capture tokens
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success' && !accessToken) {
      // We're returning from OAuth, automatically capture tokens from URL
      const accessTokenParam = urlParams.get('access_token');
      const refreshTokenParam = urlParams.get('refresh_token');

      if (accessTokenParam && refreshTokenParam) {
        // Automatically set both tokens from URL parameters
        setAccessToken(accessTokenParam);
        setRefreshToken(refreshTokenParam);

        // Store tokens in localStorage for the calendar page to use
        localStorage.setItem('google_access_token', accessTokenParam);
        localStorage.setItem('google_refresh_token', refreshTokenParam);

        setEventResult('✅ Tokens automatically captured from OAuth callback! You can now test creating events.');

        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setEventResult('⚠️ Tokens not found in URL. You may need to manually set them.');
      }
    } else if (urlParams.get('auth') === 'error') {
      const errorMsg = urlParams.get('error') || 'Authorization failed';
      setEventResult(`❌ OAuth Error: ${errorMsg}`);

      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [accessToken]);

  // Automatically capture tokens from the OAuth callback (fallback method)
  const automaticallyCaptureTokens = async () => {
    try {
      setEventResult('🔄 Attempting to capture tokens from OAuth callback...');

      // This is now a fallback method since we're using URL parameters
      setEventResult('⚠️ Automatic capture not needed - tokens should be captured from URL parameters.');
    } catch (error) {
      console.error('Error in automatic token capture:', error);
      setEventResult('⚠️ Automatic token capture failed. Please set tokens manually.');
    }
  };

  // Test Google Calendar connection
  const testCalendarConnection = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/calendar/auth');
      const data = await response.json();

      if (data.authUrl) {
        console.log('Generated OAuth URL:', data.authUrl);

        // Open Google Calendar authorization in new window
        const popup = window.open(data.authUrl, '_blank', 'width=500,height=600');

        if (!popup) {
          setEventResult('❌ Popup blocked! Please allow popups for this site and try again.');
          setIsConnecting(false);
          return;
        }

        // Listen for the redirect back
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setEventResult('✅ Authorization popup closed. You should be redirected back to this page with tokens automatically captured.');
          }
        }, 1000);

        setEventResult('✅ Authorization URL generated! Check the popup window to authorize Google Calendar access.');
      } else {
        setEventResult('❌ Failed to generate authorization URL');
      }
    } catch (error) {
      console.error('Error testing calendar connection:', error);
      setEventResult('❌ Error testing calendar connection');
    } finally {
      setIsConnecting(false);
    }
  };

  // Test creating a workout event
  const testCreateWorkoutEvent = async () => {
    if (!accessToken) {
      setEventResult('❌ No access token available. Please authorize Google Calendar first.');
      return;
    }

    setIsCreatingEvent(true);
    try {
      const testWorkout = {
        type: 'workout',
        eventData: {
          title: 'Test Workout',
          date: new Date().toISOString().split('T')[0], // Today
          startTime: '09:00',
          duration: 45,
          workoutType: 'strength',
          exercises: [
            { name: 'Push-ups', sets: 3, reps: '10-15' },
            { name: 'Squats', sets: 3, reps: '15' }
          ],
          focus: 'upper_body'
        },
        accessToken: accessToken,
        refreshToken: refreshToken
      };

      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testWorkout)
      });

      const result = await response.json();

      if (response.ok) {
        let message = `✅ Workout event created! Event ID: ${result.eventId}`;

        // Check if token was automatically refreshed
        if (result.tokenRefreshed) {
          message += '\n🔄 Access token was automatically refreshed in the background!';
          message += '\n✅ No user action required - everything worked seamlessly.';
        }

        setEventResult(message);
      } else {
        setEventResult(`❌ Failed to create workout event: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating workout event:', error);
      setEventResult('❌ Error creating workout event');
    } finally {
      setIsCreatingEvent(false);
    }
  };

  // Manual token input for testing
  const handleTokenInput = () => {
    const token = prompt('Enter your access token from the OAuth response:');
    if (token) {
      setAccessToken(token);
      localStorage.setItem('google_access_token', token);
      setEventResult('✅ Access token set! You can now test creating events.');
    }
  };

  // Set refresh token using refresh token
  const handleRefreshTokenInput = () => {
    const token = prompt('Enter your refresh token from the OAuth response:');
    if (token) {
      setRefreshToken(token);
      localStorage.setItem('google_refresh_token', token);
      setEventResult('✅ Refresh token set! This will help with automatic token refresh.');
    }
  };

  // Refresh access token using refresh token
  const handleRefreshToken = async () => {
    if (!refreshToken) {
      setEventResult('❌ No refresh token available. Please set your refresh token first.');
      return;
    }

    setIsRefreshing(true);
    try {
      const response = await fetch('/api/calendar/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      const result = await response.json();

      if (response.ok) {
        setAccessToken(result.access_token);
        // Update localStorage with new access token
        localStorage.setItem('google_access_token', result.access_token);
        setEventResult('✅ Access token refreshed successfully! You can now test creating events.');
      } else {
        setEventResult(`❌ Failed to refresh token: ${result.error}`);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      setEventResult('❌ Error refreshing token. You may need to re-authorize.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Check if token might be expired
  const isTokenExpired = accessToken && accessToken.length < 50; // Basic check for expired tokens

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Google Calendar Integration Test</h1>
        <p className="text-gray-600">Test the Google Calendar API integration</p>
      </div>

      <div className="grid gap-6">
        {/* Test Calendar Connection */}
        <Card>
          <CardHeader>
            <CardTitle>1. Test Google Calendar Connection</CardTitle>
            <CardDescription>
              Generate authorization URL and test OAuth flow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={testCalendarConnection}
                disabled={isConnecting}
                className="flex-1"
              >
                {isConnecting ? 'Testing Connection...' : 'Test Calendar Connection'}
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/debug-oauth');
                    const data = await response.json();
                    console.log('OAuth Debug Info:', data);
                    setEventResult('🔍 OAuth debug info logged to console. Check browser console for details.');
                  } catch (error) {
                    setEventResult('❌ Error getting OAuth debug info');
                  }
                }}
                variant="outline"
                size="sm"
              >
                🔍 Debug
              </Button>
            </div>

            {/* Status indicator */}
            {accessToken && refreshToken && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ <strong>Ready!</strong> Both tokens are set and ready for testing.
                </p>
              </div>
            )}

            <p className="text-sm text-gray-600">
              This will open a popup window for Google Calendar authorization.
              <br />
              <strong>🚀 Automatic:</strong> Tokens will be captured automatically after authorization.
              <br />
              <strong>🔍 Debug:</strong> Check browser console for the OAuth URL if popup doesn't work.
            </p>
          </CardContent>
        </Card>

        {/* Manual Token Input */}
        <Card>
          <CardHeader>
            <CardTitle>2. Token Management (Optional)</CardTitle>
            <CardDescription>
              Tokens are automatically captured after OAuth, but you can manually set them here if needed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  onClick={handleTokenInput}
                  variant="outline"
                  className="flex-1"
                >
                  Set Access Token
                </Button>
                <Button
                  onClick={handleRefreshTokenInput}
                  variant="outline"
                  className="flex-1"
                >
                  Set Refresh Token
                </Button>
              </div>

              {accessToken && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleRefreshToken}
                    disabled={isRefreshing || !refreshToken}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh Access Token'}
                  </Button>
                </div>
              )}
            </div>

            {accessToken && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Access Token: {accessToken.substring(0, 20)}...
                </p>
                {isTokenExpired && (
                  <p className="text-sm text-orange-600 mt-1">
                    ⚠️ Token may be expired. Try refreshing if events fail.
                  </p>
                )}
              </div>
            )}

            {refreshToken && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✅ Refresh Token: {refreshToken.substring(0, 20)}...
                </p>
              </div>
            )}

            <p className="text-sm text-gray-600">
              <strong>🚀 Automatic:</strong> Tokens are captured automatically after OAuth authorization.
              <br />
              <strong>Manual override:</strong> Use these buttons only if automatic capture fails or you need to update tokens.
            </p>
          </CardContent>
        </Card>

        {/* Test Event Creation */}
        <Card>
          <CardHeader>
            <CardTitle>4. Test Event Creation</CardTitle>
            <CardDescription>
              Test creating a workout event in Google Calendar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={testCreateWorkoutEvent}
              disabled={isCreatingEvent || !accessToken}
              variant="outline"
              className="w-full"
            >
              {isCreatingEvent ? 'Creating Event...' : 'Test Create Workout Event'}
            </Button>
            <p className="text-sm text-gray-600">
              This will create a real workout event in your Google Calendar.
            </p>
          </CardContent>
        </Card>

        {/* Results */}
        {eventResult && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{eventResult}</pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">Step 1: Test Connection</h4>
              <p className="text-sm text-gray-600">
                Click "Test Calendar Connection" to generate the OAuth URL and test the authorization flow.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Step 2: Authorize Access</h4>
              <p className="text-sm text-gray-600">
                In the popup window, sign in with your Google account and authorize FitSmith to access your calendar.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Step 3: Automatic Token Capture</h4>
              <p className="text-sm text-gray-600">
                🚀 <strong>Fully Automatic!</strong> After OAuth authorization, tokens are automatically captured and set. No copying or pasting required!
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Step 4: Test Event Creation</h4>
              <p className="text-sm text-gray-600">
                Click "Test Create Workout Event" to create a real event in your Google Calendar.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Step 5: Automatic Token Refresh</h4>
              <p className="text-sm text-gray-600">
                🚀 <strong>Fully Automatic!</strong> When access tokens expire, the app automatically refreshes them in the background. No user interaction required!
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Step 6: Expected Results</h4>
              <p className="text-sm text-gray-600">
                • Connection test should generate an authorization URL<br />
                • After OAuth, tokens are automatically captured and set<br />
                • Event creation should create a real workout event in your calendar<br />
                • 🎯 <strong>Everything is automatic</strong> - no manual token management!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function TestCalendarPage() {
  return (
    <ProtectedRoute>
      <TestCalendarContent />
    </ProtectedRoute>
  );
}
