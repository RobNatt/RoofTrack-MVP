'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { LeadStatus, StatusColors } from '@/types/Lead';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type MapMarker = {
    id: string;
    position: { lat: number; lng: number };
    status: LeadStatus;
};

type TerritoryMapProps = {
    center?: { lat: number; lng: number };
    zoom?: number;
};

const leadTriggerStatuses: LeadStatus[] = ['inspection', 'damages', 'follow up'];

function getMarkerIcon(status: LeadStatus) {
    return {
        path: "M 0,0 C -2,-20 -10,-22 -10,-32 A 10,10 0 0,1 10,-32 C 10,-22 2,-20 0,0",
        fillColor: StatusColors[status],
        fillOpacity: 1,
        strokeColor: '#000000',
        strokeWeight: 1.5,
        scale: 0.8,
    };
}

export default function TerritoryMap({
    center = { lat: 41.2565, lng: -95.9345 },
    zoom = 12,
}: TerritoryMapProps) {
    const supabase = createClient();
    
    // State
    const [currentUser, setCurrentUser] = useState<{ userId: string; companyId: string } | null>(null);
    const [markers, setMarkers] = useState<MapMarker[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
    const [selectedLead, setSelectedLead] = useState<any>(null);  
    const [leadFormData, setLeadFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        notes: '',
        preferredContactMethod: 'none' as 'email' | 'phone' | 'none',
    });
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingMarkers, setLoadingMarkers] = useState(true);
    const router = useRouter();
    const mapRef = useRef<google.maps.Map | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBAgEjpI9L3Wu-NJyPv--kzsuPsGx5m7nY',
    });

    // Fetch current user on mount
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('company_id')
                        .eq('id', user.id)
                        .single();

                    setCurrentUser({ 
                        userId: user.id, 
                        companyId: profile?.company_id 
                    });
                }
            } catch (err) {
                console.error('Error fetching user:', err);
            } finally {
                setLoadingUser(false);
            }
        };
        getCurrentUser();
    }, []);

    // Fetch leads as markers when user is ready
    useEffect(() => {
        if (currentUser) {
            fetchLeadsAsMarkers();
        }
    }, [currentUser]);

    const fetchLeadsAsMarkers = async () => {
        if (!currentUser) return;

        try {
            const { data: leads, error } = await supabase
                .from('leads')
                .select('*')
                .eq('company_id', currentUser.companyId)
                .not('latitude', 'is', null)
                .not('longitude', 'is', null);

            if (error) throw error;

            const leadMarkers: MapMarker[] = (leads || []).map(lead => ({
                id: lead.id,
                position: {
                    lat: lead.latitude,
                    lng: lead.longitude,
                },
                status: lead.status,
            }));

            setMarkers(leadMarkers);
        } catch (err) {
            console.error('Error fetching leads:', err);
        } finally {
            setLoadingMarkers(false);
        }
    };

    const handleMarkerClick = async (marker: MapMarker) => {
    setSelectedMarker(marker);
    
    // If this is an existing marker (not a temp new one), fetch full lead data
    if (!marker.id.startsWith('temp-')) {
        try {
            const { data: leadData, error } = await supabase
                .from('leads')
                .select('*')
                .eq('id', marker.id)
                .single();
            
            if (error) throw error;
            
            // Store the full lead data
            setSelectedLead(leadData);
        } catch (err) {
            console.error('Error fetching lead for marker:', err);
        }
    }
};

    const onLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
        map.setCenter(center);
    }, [center]);

    const onUnmount = useCallback(() => {
        mapRef.current = null;
    }, []);

    const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        
        const newMarker: MapMarker = {
            id: `temp-${Date.now()}`, // Temporary ID until saved
            position: { 
                lat: e.latLng.lat(), 
                lng: e.latLng.lng() 
            },
            status: 'not contacted',
        };
        
        setSelectedMarker(newMarker);
    }, []);

    const handleCreateLead = async () => {
        if (!currentUser) {
            alert('You must be logged in to create a lead');
            return;
        }

        if (!selectedMarker) return;

        try {
            const { data, error } = await supabase
                .from('leads')
                .insert([{
                    company_id: currentUser.companyId,
                    user_id: currentUser.userId,
                    full_name: leadFormData.fullName,
                    email: leadFormData.email,
                    phone_number: leadFormData.phoneNumber,
                    address: leadFormData.address,
                    status: selectedMarker.status,
                    latitude: selectedMarker.position.lat,
                    longitude: selectedMarker.position.lng,
                    notes: leadFormData.notes,
                    preferred_contact_method: leadFormData.preferredContactMethod
                }])
                .select()
                .single();

            if (error) throw error;

            // Update marker with real ID from database
            const updatedMarker: MapMarker = {
                id: data.id,
                position: selectedMarker.position,
                status: selectedMarker.status,
            };

            // Add to markers array
            setMarkers([...markers, updatedMarker]);

            // Close popup and reset form
            setSelectedMarker(null);
            setLeadFormData({
                fullName: '',
                email: '',
                phoneNumber: '',
                address: '',
                notes: '',
                preferredContactMethod: 'none'
            });

            toast.success('Lead created successfully!');

            //If status is inspection, ask to schedule
        if (updatedMarker.status === 'inspection') {
            const shouldSchedule = confirm('Would you like to schedule an inspection now?');
            if (shouldSchedule) {
                // Navigate to the lead detail page to schedule
                router.push(`/dashboard/leads/${data.id}`);
            }
        }

        } catch (err: any) {
            console.error('Error creating lead:', err);
            toast.error('Failed to create lead: ' + err.message);
        }
    };

    const handleSavePin = async () => {
    if (!currentUser) {
        alert('You must be logged in to save a pin');
        return;
    }

    if (!selectedMarker) return;

    try {
        const { data, error } = await supabase
            .from('leads')
            .insert([{
                company_id: currentUser.companyId,
                user_id: currentUser.userId,
                full_name: 'Unknown', // Default for pins without forms
                email: '',
                phone_number: '',
                address: 'See map location',
                status: selectedMarker.status,
                latitude: selectedMarker.position.lat,
                longitude: selectedMarker.position.lng,
                notes: `Pin dropped with status: ${selectedMarker.status}`,
                preferred_contact_method: 'none'
            }])
            .select()
            .single();

        if (error) throw error;

        // Update marker with real ID from database
        const updatedMarker: MapMarker = {
            id: data.id,
            position: selectedMarker.position,
            status: selectedMarker.status,
        };

        // Add to markers array
        setMarkers([...markers, updatedMarker]);

        // Close popup
        setSelectedMarker(null);

        toast.success('Pin saved successfully!');

    } catch (err: any) {
        console.error('Error saving pin:', err);
        alert('Failed to save pin: ' + err.message);
    }
};

    // Show loading state
    if (!isLoaded || loadingUser || loadingMarkers) {
        return (
            <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Map...</p>
                </div>
            </div>
        );
    }

return (
        <div className="w-full flex justify-center items-center relative">
            {/* Navigation Header */}
            <GoogleMap
                mapContainerStyle={{ width: '95%', height: '70vh' }}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleMapClick}
            >
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={marker.position}
                        icon={getMarkerIcon(marker.status)}
                        onClick={() => handleMarkerClick(marker)}
                    />
                ))}
            </GoogleMap>

            {/* Lead Form Popup */}
           {selectedMarker && (
    <div className="absolute top-8 right-48 z-50 bg-white rounded-lg shadow-xl p-6 w-96 max-h-[80vh] overflow-y-auto">
        <button
            onClick={() => {
                setSelectedMarker(null);
                setSelectedLead(null);  // Also clear lead data
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
            ✕
        </button>

        {/* NEW PIN - Show create form */}
        {selectedMarker.id.startsWith('temp-') ? (
            <>
                <h3 className="text-lg font-bold mb-4">Create New Lead</h3>
                
                {/* Status Dropdown */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Status</label>
                    <select
                        value={selectedMarker.status}
                        onChange={(e) => {
                            const newStatus = e.target.value as LeadStatus;
                            setSelectedMarker({ ...selectedMarker, status: newStatus });
                        }}
                        className="w-full p-2 border rounded"
                    >
                        {LeadStatus.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Your existing conditional form or save button */}
                {leadTriggerStatuses.includes(selectedMarker.status) ? (
                    <div className="border-t pt-4 space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name *</label>
                            <input
                                type="text"
                                value={leadFormData.fullName}
                                onChange={(e) => setLeadFormData({ ...leadFormData, fullName: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email *</label>
                            <input
                                type="email"
                                value={leadFormData.email}
                                onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                value={leadFormData.phoneNumber}
                                onChange={(e) => setLeadFormData({ ...leadFormData, phoneNumber: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Address *</label>
                            <input
                                type="text"
                                value={leadFormData.address}
                                onChange={(e) => setLeadFormData({ ...leadFormData, address: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Preferred Contact Method</label>
                            <select
                                value={leadFormData.preferredContactMethod}
                                onChange={(e) => setLeadFormData({ ...leadFormData, preferredContactMethod: e.target.value as 'email' | 'phone' | 'none' })}
                                className="w-full p-2 border rounded"
                            >
                                <option value="none">None</option>
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Notes</label>
                            <textarea
                                value={leadFormData.notes}
                                onChange={(e) => setLeadFormData({ ...leadFormData, notes: e.target.value })}
                                className="w-full p-2 border rounded"
                                rows={3}
                            />
                        </div>

                        <button
                            onClick={handleCreateLead}
                            className="w-full bg-indigo-900 text-white py-2 px-4 rounded hover:bg-indigo-800 transition-colors mt-4"
                        >
                            Create Lead
                        </button>
                    </div>
                ) : (
                    <div className="border-t pt-4">
                        <p className="text-sm text-gray-600 mb-3">
                            This status doesn't require detailed lead information.
                        </p>
                        <button
                            onClick={handleSavePin}
                            className="w-full bg-indigo-900 text-white py-2 px-4 rounded hover:bg-indigo-800 transition-colors"
                        >
                            Save Pin
                        </button>
                    </div>
                )}
            </>
        ) : (
            /* EXISTING PIN - Show lead summary */
            selectedLead ? (
                <>
                    <h3 className="text-lg font-bold mb-4">Lead Details</h3>
                    
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-500">Name</label>
                            <p className="font-semibold">{selectedLead.full_name}</p>
                        </div>
                        
                        <div>
                            <label className="text-xs text-gray-500">Status</label>
                            <span
                                className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mt-1"
                                style={{ backgroundColor: StatusColors[selectedLead.status as LeadStatus] }}
                            >
                                {selectedLead.status}
                            </span>
                        </div>
                        
                        {selectedLead.email && (
                            <div>
                                <label className="text-xs text-gray-500">Email</label>
                                <p className="text-sm">{selectedLead.email}</p>
                            </div>
                        )}
                        
                        {selectedLead.phone_number && (
                            <div>
                                <label className="text-xs text-gray-500">Phone</label>
                                <p className="text-sm">{selectedLead.phone_number}</p>
                            </div>
                        )}
                        
                        {selectedLead.address && (
                            <div>
                                <label className="text-xs text-gray-500">Address</label>
                                <p className="text-sm">{selectedLead.address}</p>
                            </div>
                        )}
                    </div>
                    
                    <button
                        onClick={() => router.push(`/dashboard/leads/${selectedLead.id}`)}
                        className="w-full mt-4 bg-indigo-900 text-white py-2 px-4 rounded hover:bg-indigo-800 transition-colors"
                    >
                        View Full Details →
                    </button>
                </>
            ) : (
                <p className="text-center py-4">Loading lead...</p>
            )
        )}
    </div>
)}    
        </div>
    );
}