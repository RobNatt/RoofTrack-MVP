'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') ?? '/dashboard';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = createClient();
            const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

            if (authError) throw authError;
            router.push(redirectTo);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred during login');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="p-6 bg-gray-100 rounded-2xl shadow-2xl">
                <h1 className="text-4xl font-bold mb-8">Login</h1>
                <form onSubmit={handleLogin} className="text-lg gap-4 space-y-4">
                    {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                    <div>
                        <label className="block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-3 border rounded-lg w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-3 border rounded-lg w-full"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="block mt-4 p-3 px-6 rounded-3xl shadow-xl border-blue-900 bg-indigo-900 text-yellow-300 font-bold border-2 hover:scale-105 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? 'Signing in…' : 'Login'}
                    </button>
                </form>
                <p className="mt-4 text-sm text-gray-600">
                    Don&apos;t have an account? <Link href="/signup" className="text-indigo-900 font-medium">Sign up</Link>
                </p>
            </div>
        </main>
    );
}
