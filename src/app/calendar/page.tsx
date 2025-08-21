'use client';

import { useSession } from 'next-auth/react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Calendar } from '@/components/Calendar';

function CalendarContent() {
    const { data: session } = useSession();

    if (!session?.user?.email) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading user session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
                <p className="text-gray-600">View and manage your daily fitness and meal plans</p>
            </div>

            <Calendar userId={session.user.id} />
        </div>
    );
}

export default function CalendarPage() {
    return (
        <ProtectedRoute>
            <CalendarContent />
        </ProtectedRoute>
    );
}
