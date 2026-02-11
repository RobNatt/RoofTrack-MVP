'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function TodayInspections() {
    const router = useRouter();
    const [inspections, setInspections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTodayInspections();
    }, []);

    const fetchTodayInspections = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('company_id')
                .eq('id', user.id)
                .single();

            const today = new Date().toISOString().split('T')[0];

            const { data: inspectionsData, error } = await supabase
                .from('inspections')
                .select(`
                    *,
                    leads (
                        full_name,
                        address,
                        id
                    )
                `)
                .eq('company_id', profile?.company_id)
                .eq('scheduled_date', today)
                .eq('status', 'scheduled')
                .order('scheduled_time', { ascending: true });

            if (error) throw error;

            const formatted = inspectionsData?.map(insp => ({
                ...insp,
                lead_name: insp.leads?.full_name || 'Unknown',
                lead_address: insp.leads?.address || 'No address',
            })) || [];

            setInspections(formatted);
        } catch (err) {
            console.error('Error fetching today inspections:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkComplete = async (inspectionId: string) => {
    try {
        const supabase = createClient();
        const { error } = await supabase
            .from('inspections')
            .update({ status: 'completed' })
            .eq('id', inspectionId);

        if (error) throw error;

        toast.success('Inspection marked as complete!');
        fetchTodayInspections(); // Refresh list

    } catch (err: any) {
        toast.error('Failed to update inspection: ' + err.message);
    }
};

    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">📅 Today's Inspections</h2>
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">📅 Today's Inspections</h2>
                <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'short', 
                        day: 'numeric' 
                    })}
                </span>
            </div>

            {inspections.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">✨ No inspections scheduled for today</p>
                    <button
                        onClick={() => router.push('/dashboard/leads')}
                        className="text-indigo-900 hover:text-indigo-700 font-semibold"
                    >
                        Schedule an inspection →
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {inspections.map((insp) => (
                        <div
                            key={insp.id}
                            className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex justify-between items-start gap-3">
                                <button
                                    onClick={() => router.push(`/dashboard/leads/${insp.lead_id}`)}
                                    className="flex-1 text-left"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold text-indigo-900">
                                            🕐 {formatTime(insp.scheduled_time)}
                                        </span>
                                    </div>
                                    <p className="font-semibold">{insp.lead_name}</p>
                                    <p className="text-sm text-gray-600">📍 {insp.lead_address}</p>
                                    {insp.notes && (
                                        <p className="text-xs text-gray-500 mt-1 italic">
                                            {insp.notes}
                                        </p>
                                    )}
                                </button>
                                
                                <button
                                    onClick={() => handleMarkComplete(insp.id)}
                                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors whitespace-nowrap"
                                >
                                    ✓ Complete
                                </button>
                            </div>
                        </div>
))}
                    
                    {inspections.length > 0 && (
                        <button
                            onClick={() => router.push('/dashboard/leads?tab=inspections')}
                            className="w-full text-center text-sm text-indigo-900 hover:text-indigo-700 font-semibold py-2"
                        >
                            View all inspections →
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}