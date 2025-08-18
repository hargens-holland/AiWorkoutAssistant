'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function Navbar() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/auth/signin');
    };

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-gray-900">
                            FitSmith
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {session ? (
                            <>
                                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                                    Dashboard
                                </Link>
                                <Link href="/plan" className="text-gray-700 hover:text-gray-900">
                                    Plan
                                </Link>
                                <Link href="/calendar" className="text-gray-700 hover:text-gray-900">
                                    Calendar
                                </Link>
                                <Link href="/chat" className="text-gray-700 hover:text-gray-900">
                                    Chat
                                </Link>
                                <Link href="/settings" className="text-gray-700 hover:text-gray-900">
                                    Settings
                                </Link>
                                <Button onClick={handleSignOut} variant="outline">
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <Link href="/auth/signin">
                                <Button>Sign In</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
