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
                                {session && (
                                    <>
                                        <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Dashboard
                                        </Link>
                                        <Link href="/plans" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Plans
                                        </Link>
                                        <Link href="/calendar" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Calendar
                                        </Link>
                                        <Link href="/chat" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Chat
                                        </Link>
                                        <Link href="/settings" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Settings
                                        </Link>
                                    </>
                                )}
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
