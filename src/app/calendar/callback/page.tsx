'use client';

import { useEffect, useState } from 'react';

export default function CalendarCallbackPage() {
  const [status, setStatus] = useState('Processing OAuth callback...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const auth = urlParams.get('auth');
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');

        if (auth === 'success' && accessToken && refreshToken) {
          setStatus('✅ OAuth successful! Sending tokens to main window...');

          // Send tokens to parent window
          if (window.opener) {
            window.opener.postMessage({
              type: 'GOOGLE_CALENDAR_CONNECTED',
              accessToken,
              refreshToken
            }, window.location.origin);

            // Close this popup after a short delay
            setTimeout(() => {
              window.close();
            }, 1500);
          } else {
            // If no opener, redirect to main calendar page
            window.location.href = '/calendar?auth=success&access_token=' + accessToken + '&refresh_token=' + refreshToken;
          }
        } else if (urlParams.get('error')) {
          setStatus('❌ OAuth failed: ' + urlParams.get('error'));
          
          if (window.opener) {
            window.opener.postMessage({
              type: 'GOOGLE_CALENDAR_ERROR',
              error: urlParams.get('error')
            }, window.location.origin);
            
            setTimeout(() => {
              window.close();
            }, 2000);
          }
        } else {
          setStatus('❌ Invalid callback parameters');
        }
      } catch (error) {
        console.error('Error handling callback:', error);
        setStatus('❌ Error processing callback');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Google Calendar Connection
        </h1>
        <p className="text-gray-600">{status}</p>
        
        {status.includes('✅') && (
          <p className="text-sm text-green-600 mt-2">
            This window will close automatically...
          </p>
        )}
        
        {status.includes('❌') && (
          <div className="mt-4">
            <button
              onClick={() => window.close()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
