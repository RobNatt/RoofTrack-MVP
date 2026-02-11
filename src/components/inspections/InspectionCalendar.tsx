'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type CalendarDay = {
    date: Date;
    isCurrentMonth: boolean;
    inspections: any[];
};

export default function InspectionCalendar() {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [inspections, setInspections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        fetchInspections();
    }, [currentDate]);

    const fetchInspections = async () => {
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

            // Get first and last day of current month
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

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
                .gte('scheduled_date', firstDay.toISOString().split('T')[0])
                .lte('scheduled_date', lastDay.toISOString().split('T')[0])
                .order('scheduled_date', { ascending: true })
                .order('scheduled_time', { ascending: true });

            if (error) throw error;

            const formatted = inspectionsData?.map(insp => ({
                ...insp,
                lead_name: insp.leads?.full_name || 'Unknown',
                lead_address: insp.leads?.address || 'No address',
            })) || [];

            setInspections(formatted);
        } catch (err) {
            console.error('Error fetching inspections:', err);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (): CalendarDay[] => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        const startingDayOfWeek = firstDayOfMonth.getDay();

        const days: CalendarDay[] = [];

        // Previous month's days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, prevMonthLastDay - i);
            days.push({
                date,
                isCurrentMonth: false,
                inspections: getInspectionsForDate(date)
            });
        }

        // Current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            days.push({
                date,
                isCurrentMonth: true,
                inspections: getInspectionsForDate(date)
            });
        }

        // Next month's days to fill the grid
        const remainingDays = 42 - days.length; // 6 rows * 7 days
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(year, month + 1, day);
            days.push({
                date,
                isCurrentMonth: false,
                inspections: getInspectionsForDate(date)
            });
        }

        return days;
    };

    const getInspectionsForDate = (date: Date): any[] => {
        const dateStr = date.toISOString().split('T')[0];
        return inspections.filter(insp => insp.scheduled_date === dateStr);
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const today = new Date();
    const isToday = (date: Date) => {
        return date.toDateString() === today.toDateString();
    };

    const days = getDaysInMonth();

    if (loading) {
        return <p className="text-center py-8">Loading calendar...</p>;
    }

    return (
        <div>
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={previousMonth}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        ← Previous
                    </button>
                    <button
                        onClick={nextMonth}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Next →
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="border rounded-lg overflow-hidden">
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-indigo-900 text-white">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center font-semibold border-r border-indigo-800 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                    {days.map((day, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (day.inspections.length > 0) {
                                    setSelectedDate(day.date);
                                }
                            }}
                            className={`min-h-[100px] p-2 border-b border-r last:border-r-0 text-left transition-colors ${
                                !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                            } ${
                                isToday(day.date) ? 'bg-blue-50 font-bold' : ''
                            } ${
                                day.inspections.length > 0 ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-default'
                            }`}
                        >
                            <div className={`text-sm mb-1 ${isToday(day.date) ? 'text-blue-600' : ''}`}>
                                {day.date.getDate()}
                            </div>
                            
                            {/* Inspection Indicators */}
                            {day.inspections.length > 0 && (
                                <div className="space-y-1">
                                    {day.inspections.slice(0, 2).map((insp, i) => (
                                        <div
                                            key={i}
                                            className={`text-xs px-1 py-0.5 rounded truncate ${
                                                insp.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                insp.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {insp.scheduled_time.substring(0, 5)} {insp.lead_name}
                                        </div>
                                    ))}
                                    {day.inspections.length > 2 && (
                                        <div className="text-xs text-gray-500">
                                            +{day.inspections.length - 2} more
                                        </div>
                                    )}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Selected Date Detail */}
            {selectedDate && (
                <div className="mt-6 bg-white rounded-lg border p-4">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold">
                            Inspections on {selectedDate.toLocaleDateString('en-US', { 
                                weekday: 'long',
                                month: 'long', 
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </h3>
                        <button
                            onClick={() => setSelectedDate(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-2">
                        {getInspectionsForDate(selectedDate).map((insp) => (
                            <button
                                key={insp.id}
                                onClick={() => router.push(`/dashboard/leads/${insp.lead_id}`)}
                                className="w-full text-left border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{insp.lead_name}</p>
                                        <p className="text-sm text-gray-600">{insp.lead_address}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            🕐 {insp.scheduled_time.substring(0, 5)}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                                        insp.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                        insp.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {insp.status}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}