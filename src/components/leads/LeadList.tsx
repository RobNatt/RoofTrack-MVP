'use client';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import LeadMiniCard from './LeadMiniCard';

const LeadList = forwardRef((props, ref) => {
    const router = useRouter();
    const [leads, setLeads] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Expose refresh function to parent
    useImperativeHandle(ref, () => ({
        refresh: () => {
            fetchLeads();
        }
    }));

    // Fetch leads when component mounts
    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
    console.log('fetchLeads called');
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        console.log('User:', user);

        if (!user) {
            console.log('No user found');
            setLoading(false);
            return;
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', user.id)
            .single();
        console.log('Profile:', profile);

        // Fetch leads
        const { data: leadsData, error } = await supabase
            .from('leads')
            .select('*')
            .eq('company_id', profile?.company_id)
            .order('date_added', { ascending: false });

        console.log('Leads data:', leadsData);
        console.log('Error:', error);

        if (error) throw error;

        // Fetch upcoming inspections for these leads
        const today = new Date().toISOString().split('T')[0];
        const { data: inspectionsData } = await supabase
            .from('inspections')
            .select('lead_id')
            .eq('company_id', profile?.company_id)
            .eq('status', 'scheduled')
            .gte('scheduled_date', today);

        // Create a Set of lead IDs that have upcoming inspections
        const leadsWithInspections = new Set(
            inspectionsData?.map(insp => insp.lead_id) || []
        );

        // Add hasUpcomingInspection property to each lead
        const leadsWithInspectionFlag = leadsData?.map(lead => ({
            ...lead,
            hasUpcomingInspection: leadsWithInspections.has(lead.id)
        })) || [];

        setLeads(leadsWithInspectionFlag);
    } catch (err) {
        console.error('Error fetching leads:', err);
    } finally {
        setLoading(false);
    }
};

    const filteredLeads = leads.filter(lead => {
        const search = searchQuery.toLowerCase();
        return (
            lead.full_name.toLowerCase().includes(search) ||
            lead.email.toLowerCase().includes(search) ||
            lead.address.toLowerCase().includes(search) ||
            lead.status.toLowerCase().includes(search)
        );
    });

    if (loading) {
        return <p className="text-center py-8">Loading leads...</p>;
    }

    return (
        <div>
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by name, email, address, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4"
            />

            {/* Leads List */}
            {filteredLeads.length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                    {searchQuery ? 'No leads match your search' : 'No leads yet. Drop some pins on the map!'}
                </p>
            ) : (
                <div className="max-h-[500px] overflow-y-auto space-y-3">
                    {filteredLeads.map((lead) => (
                        <LeadMiniCard
                            key={lead.id}
                            lead={lead}
                            onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                            hasUpcomingInspection={lead.hasUpcomingInspection} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export default LeadList;