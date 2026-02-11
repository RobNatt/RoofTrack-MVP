'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();

        // Listen for auth state changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            fetchUser();
        } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setProfile(null);
        }
    });

    return () => {
        subscription.unsubscribe();
    };
}, []);

    const fetchUser = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            setUser(user);
            
            const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name, role')
                .eq('id', user.id)
                .single();
            
            setProfile(profileData);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        router.push('/');
    };

    const isActive = (path: string) => {
        return pathname === path;
    };

    // Hide header completely on login/signup pages
    if (pathname === '/login' || pathname === '/signup') {
        return null;
    }

    // Show loading state briefly
    if (loading) {
        return (
            <header className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <img 
                            src="/RoofTrack2.png" 
                            alt="RoofStack Logo" 
                            className="h-16 w-auto object-contain"
                        />
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <button
                        onClick={() => router.push(user ? '/dashboard' : '/')}
                        className="transition-transform hover:scale-105 border-0 bg-transparent p-0 focus:outline-none"
                    >
                        <img 
                            src="/RoofTrack2.png" 
                            alt="RoofStack Logo" 
                            className="h-16 w-auto object-contain"
                        />
                    </button>

                    {/* Conditional Navigation */}
                    {user ? (
                        /* Authenticated - Full Navigation */
                        <nav className="flex items-center gap-2">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    isActive('/dashboard')
                                        ? 'bg-white text-indigo-900 shadow-md'
                                        : 'text-white hover:bg-indigo-700'
                                }`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => router.push('/dashboard/leads')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    pathname?.startsWith('/dashboard/leads')
                                        ? 'bg-white text-indigo-900 shadow-md'
                                        : 'text-white hover:bg-indigo-700'
                                }`}
                            >
                                Leads
                            </button>
                            <button
                                onClick={() => router.push('/dashboard/territoryManagement')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    isActive('/dashboard/territoryManagement')
                                        ? 'bg-white text-indigo-900 shadow-md'
                                        : 'text-white hover:bg-indigo-700'
                                }`}
                            >
                                Territory
                            </button>

                            {/* User Info */}
                            <div className="ml-4 pl-4 border-l border-indigo-600">
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-white">
                                            {profile?.full_name || 'User'}
                                        </p>
                                        <p className="text-xs text-indigo-200 capitalize">
                                            {profile?.role || 'rep'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all hover:shadow-lg"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </nav>
                    ) : (
                        /* Public - Login Only */
                        <nav className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/login')}
                                className="px-6 py-2 text-white font-medium hover:text-yellow-200 transition-all"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => router.push('/signup')}
                                className="px-6 py-2 bg-yellow-400 text-indigo-900 font-bold rounded-lg hover:bg-yellow-300 transition-all hover:shadow-lg"
                            >
                                Get Started
                            </button>
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
}