'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Inspection } from '@/types/Inspection';
import InspectionMiniCard from './InspectionMiniCard';

export default function InspectionList() {
  const router = useRouter();
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');

  useEffect(() => {
    fetchInspections();
  }, []);

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

      // Fetch inspections with lead data (join)
      const { data: inspectionsData, error } = await supabase
        .from('inspections')
        .select(`
          *,
          leads (
            full_name,
            address
          )
        `)
        .eq('company_id', profile?.company_id)
        .order('scheduled_date', { ascending: true })
        .order('scheduled_time', { ascending: true });

      if (error) throw error;

      // Flatten the joined data
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

  const filteredInspections = inspections.filter(insp => {
    if (filter === 'all') return true;
    return insp.status === filter;
  });

  // Separate upcoming vs past
  const today = new Date().toISOString().split('T')[0];
  const upcoming = filteredInspections.filter(insp => insp.scheduled_date >= today);
  const past = filteredInspections.filter(insp => insp.scheduled_date < today);

  if (loading) {
    return <p className="text-center py-8">Loading inspections...</p>;
  }

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${
            filter === 'all'
              ? 'bg-indigo-900 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({inspections.length})
        </button>
        <button
          onClick={() => setFilter('scheduled')}
          className={`px-4 py-2 rounded ${
            filter === 'scheduled'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Scheduled ({inspections.filter(i => i.status === 'scheduled').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded ${
            filter === 'completed'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completed ({inspections.filter(i => i.status === 'completed').length})
        </button>
      </div>

      {/* Upcoming Inspections */}
      {upcoming.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3">📅 Upcoming</h3>
          <div className="space-y-3">
            {upcoming.map((inspection) => (
              <InspectionMiniCard
                key={inspection.id}
                inspection={inspection}
                onClick={() => router.push(`/dashboard/leads/${inspection.lead_id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past Inspections */}
      {past.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-3">📋 Past</h3>
          <div className="space-y-3">
            {past.map((inspection) => (
              <InspectionMiniCard
                key={inspection.id}
                inspection={inspection}
                onClick={() => router.push(`/dashboard/leads/${inspection.lead_id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredInspections.length === 0 && (
        <p className="text-center py-8 text-gray-500">
          No {filter !== 'all' ? filter : ''} inspections found.
          Schedule one from a lead's detail page!
        </p>
      )}
    </div>
  );
}