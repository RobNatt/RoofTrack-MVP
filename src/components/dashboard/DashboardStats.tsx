'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardStats() {
    const [stats, setStats] = useState({
        totalLeads: 0,
        inspectionsThisWeek: 0,
        completedThisWeek: 0,
        activeLeads: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
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

            // Get active leads (not closed-won, closed-lost, etc.)
            const { count: activeLeads } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', profile?.company_id)
                .not('status', 'in', '("closed - won","closed - lost","do not contact","not interested")');

            // Get week start (Monday)
            const today = new Date();
            const dayOfWeek = today.getDay();
            const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            const monday = new Date(today.setDate(diff));
            monday.setHours(0, 0, 0, 0);
            const mondayStr = monday.toISOString().split('T')[0];

            // Get inspections this week
            const { count: inspectionsThisWeek } = await supabase
                .from('inspections')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', profile?.company_id)
                .gte('scheduled_date', mondayStr);

            // Get completed inspections this week
            const { count: completedThisWeek } = await supabase
                .from('inspections')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', profile?.company_id)
                .eq('status', 'completed')
                .gte('scheduled_date', mondayStr);

            setStats({
                totalLeads: totalLeads || 0,
                inspectionsThisWeek: inspectionsThisWeek || 0,
                completedThisWeek: completedThisWeek || 0,
                activeLeads: activeLeads || 0,
            });

        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Total Leads */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-900">
                <div className="text-sm text-gray-600 mb-1">Total Leads</div>
                <div className="text-3xl font-bold text-indigo-900">{stats.totalLeads}</div>
                <div className="text-xs text-gray-500 mt-2">All time</div>
            </div>

            {/* Active Leads */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
                <div className="text-sm text-gray-600 mb-1">Active Leads</div>
                <div className="text-3xl font-bold text-green-600">{stats.activeLeads}</div>
                <div className="text-xs text-gray-500 mt-2">In pipeline</div>
            </div>

            {/* Inspections This Week */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
                <div className="text-sm text-gray-600 mb-1">Inspections</div>
                <div className="text-3xl font-bold text-blue-600">{stats.inspectionsThisWeek}</div>
                <div className="text-xs text-gray-500 mt-2">This week</div>
            </div>

            {/* Completed This Week */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600">
                <div className="text-sm text-gray-600 mb-1">Completed</div>
                <div className="text-3xl font-bold text-purple-600">{stats.completedThisWeek}</div>
                <div className="text-xs text-gray-500 mt-2">This week</div>
            </div>
        </div>
    );
}