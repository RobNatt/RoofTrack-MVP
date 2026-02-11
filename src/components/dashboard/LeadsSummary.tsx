'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function LeadsSummary() {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalLeads: 0,
        activeLeads: 0,
        inspectionsToday: 0,
        inspectionsThisWeek: 0,
    });
    const [todayInspections, setTodayInspections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
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

            // Get total leads
            const { count: totalLeads } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', profile?.company_id);

            // Get active leads
            const { count: activeLeads } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', profile?.company_id)
                .not('status', 'in', '("closed - won","closed - lost","do not contact","not interested")');

            const today = new Date().toISOString().split('T')[0];

            // Get today's inspections
            const { data: inspectionsData } = await supabase
                .from('inspections')
                .select(`
                    *,
                    leads (
                        full_name,
                        id
                    )
                `)
                .eq('company_id', profile?.company_id)
                .eq('scheduled_date', today)
                .eq('status', 'scheduled')
                .order('scheduled_time', { ascending: true })
                .limit(3);

            const { count: inspectionsToday } = await supabase
                .from('inspections')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', profile?.company_id)
                .eq('scheduled_date', today)
                .eq('status', 'scheduled');

            // Get week start
            const dayOfWeek = new Date().getDay();
            const diff = new Date().getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            const monday = new Date(new Date().setDate(diff));
            monday.setHours(0, 0, 0, 0);
            const mondayStr = monday.toISOString().split('T')[0];

            const { count: inspectionsThisWeek } = await supabase
                .from('inspections')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', profile?.company_id)
                .gte('scheduled_date', mondayStr);

            setStats({
                totalLeads: totalLeads || 0,
                activeLeads: activeLeads || 0,
                inspectionsToday: inspectionsToday || 0,
                inspectionsThisWeek: inspectionsThisWeek || 0,
            });

            const formatted = inspectionsData?.map(insp => ({
                ...insp,
                lead_name: insp.leads?.full_name || 'Unknown',
            })) || [];

            setTodayInspections(formatted);

        } catch (err) {
            console.error('Error fetching data:', err);
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
            fetchData();

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
        return <div className="text-gray-500 text-center py-4">Loading...</div>;
    }

    return (
        <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                    <div className="text-xs text-indigo-600 font-semibold">Total Leads</div>
                    <div className="text-2xl font-bold text-indigo-900">{stats.totalLeads}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="text-xs text-green-600 font-semibold">Active</div>
                    <div className="text-2xl font-bold text-green-700">{stats.activeLeads}</div>
                </div>
            </div>

            {/* Inspections Today */}
            <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-gray-700">Today's Inspections</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                        {stats.inspectionsToday}
                    </span>
                </div>

                {todayInspections.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-2">No inspections today</p>
                ) : (
                    <div className="space-y-2">
                        {todayInspections.map((insp) => (
                            <div
                                key={insp.id}
                                className="flex justify-between items-center text-xs bg-gray-50 rounded p-2 border"
                            >
                                <button
                                    onClick={() => router.push(`/dashboard/leads/${insp.lead_id}`)}
                                    className="flex-1 text-left hover:text-indigo-900"
                                >
                                    <span className="font-semibold">{formatTime(insp.scheduled_time)}</span>
                                    {' - '}
                                    <span>{insp.lead_name}</span>
                                </button>
                                <button
                                    onClick={() => handleMarkComplete(insp.id)}
                                    className="ml-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                                >
                                    ✓
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-xs text-gray-500 mt-2">
                    {stats.inspectionsThisWeek} inspections this week
                </div>
            </div>
        </div>
    );
}