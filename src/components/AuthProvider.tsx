'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50"></div>;
    }

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
