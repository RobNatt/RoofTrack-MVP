'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LeadStatus, StatusColors } from '@/types/Lead';
import ScheduleInspectionForm from '@/components/inspections/ScheduleInspectionForm';
import toast from 'react-hot-toast';

export default function LeadDetailPage() {
    const router = useRouter();
    const params = useParams();
    const leadId = params.id as string;
    
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);  
    const [editedLead, setEditedLead] = useState<any>(null);  
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [inspections, setInspections] = useState<any[]>([]);
    const [selectedInspection, setSelectedInspection] = useState<any>(null);

    const fetchInspections = async () => {
        try {
            const supabase = createClient();
            const { data: inspectionsData, error } = await supabase
                .from('inspections')
                .select('*')
                .eq('lead_id', leadId)
                .order('scheduled_date', { ascending: true })
                .order('scheduled_time', { ascending: true });
            if (error) throw error;
            setInspections(inspectionsData || []);
        } catch (err) {
            console.error('Error fetching inspections:', err);
        }
    };

    const fetchLead = async () => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('id', leadId)
                .single();

            if (error) throw error;
            setLead(data);
            setEditedLead(data);
        } catch (err) {
            console.error('Error fetching lead:', err);
            router.push('/dashboard/leads');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
    if (!editedLead) return;

    try {
        const supabase = createClient();
        
        // Check if status changed to "inspection"
        const statusChangedToInspection = 
            lead.status !== 'inspection' && 
            editedLead.status === 'inspection';

        const { error } = await supabase
            .from('leads')
            .update({
                full_name: editedLead.full_name,
                email: editedLead.email,
                phone_number: editedLead.phone_number,
                address: editedLead.address,
                status: editedLead.status,
                preferred_contact_method: editedLead.preferred_contact_method,
                notes: editedLead.notes,
            })
            .eq('id', leadId);

        if (error) throw error;

        setLead(editedLead);
        setIsEditing(false);
        toast.success('Lead updated successfully!');

        // If status changed to inspection, prompt to schedule
        if (statusChangedToInspection) {
            const shouldSchedule = confirm('Would you like to schedule an inspection for this lead?');
            if (shouldSchedule) {
                setShowScheduleForm(true);
            }
        }

    } catch (err: any) {
        console.error('Error updating lead:', err);
        toast.error('Failed to update lead: ' + err.message);
    }
};

    const handleCancel = () => {
        setEditedLead(lead);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this lead? This cannot be undone.')) {
            return;
        }

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('leads')
                .delete()
                .eq('id', leadId);

            if (error) throw error;

            toast.success('Lead deleted successfully');
            router.push('/dashboard/leads');

        } catch (err: any) {
            console.error('Error deleting lead:', err);
            toast.error('Failed to delete lead: ' + err.message);
        }
    };

    const handleUpdateInspection = async () => {
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('inspections')
                .update({
                    scheduled_date: selectedInspection.scheduled_date,
                    scheduled_time: selectedInspection.scheduled_time,
                    status: selectedInspection.status,
                    notes: selectedInspection.notes,
                })
                .eq('id', selectedInspection.id);

            if (error) throw error;

           toast.success('Inspection updated successfully!'); 
            setSelectedInspection(null);
            fetchInspections();

        } catch (err: any) {
            toast.error('Failed to update inspection: ' + err.message);
        }
    };

    const handleDeleteInspection = async () => {
        if (!confirm('Are you sure you want to delete this inspection?')) {
            return;
        }

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('inspections')
                .delete()
                .eq('id', selectedInspection.id);

            if (error) throw error;

            toast.success('Inspection deleted successfully!');
            setSelectedInspection(null);
            fetchInspections();

        } catch (err: any) {
            toast.error('Failed to delete inspection: ' + err.message);
        }
    };

    useEffect(() => {
        fetchLead();
        fetchInspections();
    }, [leadId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading lead...</p>
            </div>
        );
    }

    if (!lead) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            {/* Navigation */}
            <div className="mb-6 flex gap-4">
                <button
                    onClick={() => router.push('/dashboard/leads')}
                    className="text-indigo-900 hover:text-indigo-700 font-semibold"
                >
                    ← Back to Leads
                </button>

                {lead.latitude && lead.longitude && (
                    <button
                        onClick={() => router.push('/dashboard/territoryManagement')}
                        className="text-indigo-900 hover:text-indigo-700 font-semibold"
                    >
                        📍 View on Map
                    </button>
                )}
            </div>

            {/* Lead Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold">{lead.full_name}</h1>
                    <span
                        className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                        style={{ backgroundColor: StatusColors[lead.status as LeadStatus] }}
                    >
                        {lead.status}
                    </span>
                </div>

                {/* Lead Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedLead.full_name}
                                onChange={(e) => setEditedLead({ ...editedLead, full_name: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        ) : (
                            <p className="text-lg">{lead.full_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                        {isEditing ? (
                            <input
                                type="email"
                                value={editedLead.email}
                                onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        ) : (
                            <p className="text-lg">{lead.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Phone</label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={editedLead.phone_number}
                                onChange={(e) => setEditedLead({ ...editedLead, phone_number: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        ) : (
                            <p className="text-lg">{lead.phone_number}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Address</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedLead.address}
                                onChange={(e) => setEditedLead({ ...editedLead, address: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        ) : (
                            <p className="text-lg">{lead.address}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Status</label>
                        {isEditing ? (
                            <select
                                value={editedLead.status}
                                onChange={(e) => setEditedLead({ ...editedLead, status: e.target.value })}
                                className="w-full p-2 border rounded"
                            >
                                {LeadStatus.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        ) : (
                            <span
                                className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white"
                                style={{ backgroundColor: StatusColors[lead.status as LeadStatus] }}
                            >
                                {lead.status}
                            </span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Preferred Contact</label>
                        {isEditing ? (
                            <select
                                value={editedLead.preferred_contact_method}
                                onChange={(e) => setEditedLead({ ...editedLead, preferred_contact_method: e.target.value })}
                                className="w-full p-2 border rounded"
                            >
                                <option value="none">None</option>
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                            </select>
                        ) : (
                            <p className="text-lg capitalize">{lead.preferred_contact_method}</p>
                        )}
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Notes</label>
                        {isEditing ? (
                            <textarea
                                value={editedLead.notes || ''}
                                onChange={(e) => setEditedLead({ ...editedLead, notes: e.target.value })}
                                className="w-full p-2 border rounded"
                                rows={4}
                            />
                        ) : (
                            <p className="text-gray-700 whitespace-pre-wrap">{lead.notes || 'No notes'}</p>
                        )}
                    </div>
                </div>

                {/* Coordinates */}
                {lead.latitude && lead.longitude && (
                    <div className="mt-6 pt-6 border-t">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Location</label>
                        <p className="text-sm text-gray-500">
                            📍 {lead.latitude.toFixed(6)}, {lead.longitude.toFixed(6)}
                        </p>
                    </div>
                )}

                {/* Scheduled Inspections */}
                {inspections.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                        <label className="block text-sm font-semibold text-gray-600 mb-3">Scheduled Inspections</label>
                        <div className="space-y-2">
                            {inspections.map((inspection) => {
                                const statusColors = {
                                    scheduled: 'bg-blue-100 text-blue-800',
                                    completed: 'bg-green-100 text-green-800',
                                    canceled: 'bg-gray-100 text-gray-800',
                                };
                                
                                const formatDate = (dateStr: string) => {
                                    return new Date(dateStr).toLocaleDateString('en-US', { 
                                        weekday: 'short', 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric'
                                    });
                                };

                                const formatTime = (timeStr: string) => {
                                    const [hours, minutes] = timeStr.split(':');
                                    const hour = parseInt(hours);
                                    const ampm = hour >= 12 ? 'PM' : 'AM';
                                    const displayHour = hour % 12 || 12;
                                    return `${displayHour}:${minutes} ${ampm}`;
                                };

                                return (
                                    <button
                                        key={inspection.id}
                                        onClick={() => setSelectedInspection(inspection)}
                                        className="w-full border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold">
                                                    📅 {formatDate(inspection.scheduled_date)} at {formatTime(inspection.scheduled_time)}
                                                </p>
                                                {inspection.notes && (
                                                    <p className="text-sm text-gray-600 mt-1">{inspection.notes}</p>
                                                )}
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${statusColors[inspection.status as keyof typeof statusColors]}`}>
                                                {inspection.status}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-colors"
                            >
                                Edit Lead
                            </button>
                            {!showScheduleForm && (
                                <button
                                    onClick={() => setShowScheduleForm(true)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    📅 Schedule Inspection
                                </button>
                            )}
                        </>
                    )}
                    <button
                        onClick={handleDelete}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-auto"
                    >
                        Delete Lead
                    </button>
                </div>
            </div>

            {/* Schedule Inspection Form */}
            {showScheduleForm && (
                <div className="mt-6">
                    <ScheduleInspectionForm
                        leadId={leadId}
                        leadName={lead.full_name}
                        onSuccess={() => {
                            setShowScheduleForm(false);
                            fetchInspections();
                            toast.success('Inspection scheduled!');
                        }}
                        onCancel={() => setShowScheduleForm(false)}
                    />
                </div>
            )}

            {/* Edit Inspection Modal */}
            {selectedInspection && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold">Edit Inspection</h3>
                            <button
                                onClick={() => setSelectedInspection(null)}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateInspection();
                        }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Date *</label>
                                <input
                                    type="date"
                                    value={selectedInspection.scheduled_date}
                                    onChange={(e) => setSelectedInspection({
                                        ...selectedInspection,
                                        scheduled_date: e.target.value
                                    })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Time *</label>
                                <input
                                    type="time"
                                    value={selectedInspection.scheduled_time}
                                    onChange={(e) => setSelectedInspection({
                                        ...selectedInspection,
                                        scheduled_time: e.target.value
                                    })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    value={selectedInspection.status}
                                    onChange={(e) => setSelectedInspection({
                                        ...selectedInspection,
                                        status: e.target.value
                                    })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="scheduled">Scheduled</option>
                                    <option value="completed">Completed</option>
                                    <option value="canceled">Canceled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Notes</label>
                                <textarea
                                    value={selectedInspection.notes || ''}
                                    onChange={(e) => setSelectedInspection({
                                        ...selectedInspection,
                                        notes: e.target.value
                                    })}
                                    className="w-full p-2 border rounded"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-900 text-white py-2 px-4 rounded hover:bg-indigo-800 transition-colors"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteInspection}
                                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
