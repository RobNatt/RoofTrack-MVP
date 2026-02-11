'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        companyName: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const supabase = createClient();
        try {
            // 1. Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('No user returned');

            // 2. Create or get company
            let companyId;
            const { data: existingCompany } = await supabase
                .from('companies')
                .select('id')
                .eq('name', formData.companyName)
                .single();

            if (existingCompany) {
                companyId = existingCompany.id;
            } else {
                const { data: newCompany, error: companyError } = await supabase
                    .from('companies')
                    .insert([{ name: formData.companyName }])
                    .select()
                    .single();

                if (companyError) throw companyError;
                companyId = newCompany.id;
            }

            // 3. Create profile
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                    id: authData.user.id,
                    company_id: companyId,
                    full_name: formData.fullName,
                    role: 'rep'
                }]);

            if (profileError) throw profileError;

            // 4. Success! Redirect to dashboard
            router.push('/dashboard');
            router.refresh();

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred during signup');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="p-6 bg-gray-100 rounded-2xl shadow-2xl">
                <h1 className="text-4xl font-bold mb-8">Signup Page</h1>
                <form onSubmit={handleSignup} className="text-lg gap-4 space-y-4">
                    {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                    <div>
                        <label className="block">Full Name</label>
                        <input type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="p-3 border rounded-lg"/>
                    </div>
                    <div>
                        <label className="block">Phone Number</label>
                        <input type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="p-3 border rounded-lg"/>
                    </div>
                    <div>
                        <label className="block">Company Name</label>
                        <input type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="p-3 border rounded-lg"/>
                    </div>
                    <div>
                        <label className="block">Email</label>
                        <input type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="p-3 border rounded-lg"/>
                    </div>
                    <div>
                        <label className="block">Password</label>
                        <input type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="p-3 border rounded-lg"/>
                    </div>
                    <button type="submit" disabled={loading} className="block mt-4 p-3 px-6 rounded-3xl shadow-xl border-blue-900 bg-indigo-900 text-yellow-300 font-bold border-2 hover:scale-105 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none">Register</button>
                </form>
                <p className="mt-4 text-sm text-gray-600">
                    Already have an account? <Link href="/login" className="text-indigo-900 font-medium">Login</Link>
                </p>
            </div>
        </main>
    );
}