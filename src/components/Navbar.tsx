'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dumbbell, Calendar, MessageSquare, Settings, User } from 'lucide-react';

export function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <Dumbbell className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">FitSmith</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                            Dashboard
                        </Link>
                        <Link href="/plan" className="text-gray-600 hover:text-gray-900">
                            Plan
                        </Link>
                        <Link href="/chat" className="text-gray-600 hover:text-gray-900">
                            Chat
                        </Link>
                        <Link href="/settings" className="text-gray-600 hover:text-gray-900">
                            Settings
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {session ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700">
                                    {session.user?.name}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => signOut()}
                                >
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={() => signIn('google')}>
                                Sign In
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
