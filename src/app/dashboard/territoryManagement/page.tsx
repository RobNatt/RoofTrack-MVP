'use client';
import TerritoryMap from '@/components/territoryMap';
import { useRouter } from 'next/navigation';

export default function TerritoryManagementPage() {
    const router = useRouter();
    
    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-4xl font-bold text-indigo-900 mb-6">Territory Management</h1>
            <div className="mb-4 flex justify-between items-center">
            <button
                onClick={() => router.push('/dashboard/leads')}
                className="text-indigo-900 hover:text-indigo-700 font-semibold flex items-center gap-2"
            >
                ← Back to Leads Dashboard
            </button>
            </div>
            <TerritoryMap />
        </main>
    );
}