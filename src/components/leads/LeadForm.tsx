'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LeadStatus } from '@/types/Lead';
import { geocodeAddress } from '@/lib/geocoding';

type LeadFormProps = {
    onSuccess?: () => void;
};

export default function LeadForm({ onSuccess }: LeadFormProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState<LeadStatus>('not contacted');
    const [preferredContactMethod, setPreferredContactMethod] = useState<'email' | 'phone' | 'none'>('none');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [addressValid, setAddressValid] = useState<boolean | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        // 1. Geocode the address first
        const coordinates = await geocodeAddress(address);
        
        if (!coordinates) {
            alert('Could not find coordinates for this address. Please check the address and try again.');
            setLoading(false);
            return;
        }

        // 2. Create the lead with coordinates
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            alert('You must be logged in');
            return;
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', user.id)
            .single();

        const { error } = await supabase
            .from('leads')
            .insert([{
                company_id: profile?.company_id,
                user_id: user.id,
                full_name: fullName,
                email,
                phone_number: phoneNumber,
                address,
                status,
                latitude: coordinates.lat,      // ← ADD THIS
                longitude: coordinates.lng,     // ← ADD THIS
                preferred_contact_method: preferredContactMethod,
                notes,
            }]);

        if (error) throw error;

        alert('Lead created successfully!');
        
        // Reset form
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setAddress('');
        setStatus('not contacted');
        setPreferredContactMethod('none');
        setNotes('');

        onSuccess?.();

    } catch (err: any) {
        alert('Failed to create lead: ' + err.message);
    } finally {
        setLoading(false);
    }
};

const validateAddress = async () => {
    if (!address || address.length < 5) {
        setAddressValid(null);
        return;
    }

    const coords = await geocodeAddress(address);
    setAddressValid(coords !== null);
};
            
    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                />
            </div>

            <div>
    <label className="block text-sm font-medium mb-1">Address *</label>
    <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        onBlur={validateAddress}  // ← Validate when user leaves field
        className={`w-full p-3 border rounded-lg ${
            addressValid === false ? 'border-red-500' : 
            addressValid === true ? 'border-green-500' : 
            'border-gray-300'
        }`}
        required
        placeholder="123 Main St, City, State ZIP"
    />
    {addressValid === false && (
        <p className="text-red-500 text-sm mt-1">
            ⚠️ Could not validate this address. Please check and try again.
        </p>
    )}
    {addressValid === true && (
        <p className="text-green-500 text-sm mt-1">
            ✓ Address validated
        </p>
    )}
</div>

            <div>
                <label className="block text-sm font-medium mb-1">Initial Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LeadStatus)}
                    className="w-full p-3 border rounded-lg"
                >
                    <option value="not contacted">Not Contacted</option>
                    <option value="contacted">Contacted</option>
                    <option value="inspection">Inspection</option>
                    <option value="damages">Damages</option>
                    <option value="follow up">Follow Up</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Preferred Contact Method</label>
                <select
                    value={preferredContactMethod}
                    onChange={(e) => setPreferredContactMethod(e.target.value as 'email' | 'phone' | 'none')}
                    className="w-full p-3 border rounded-lg"
                >
                    <option value="none">None</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    rows={4}
                    placeholder="Any additional information about this lead..."
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-900 text-white py-3 px-4 rounded-lg hover:bg-indigo-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Creating Lead...' : 'Create Lead'}
            </button>
        </form>
    );
}