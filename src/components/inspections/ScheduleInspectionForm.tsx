'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';

type ScheduleInspectionFormProps = {
  leadId: string;
  leadName: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function ScheduleInspectionForm({ 
  leadId, 
  leadName, 
  onSuccess, 
  onCancel 
}: ScheduleInspectionFormProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
        .from('inspections')
        .insert([{
          lead_id: leadId,
          company_id: profile?.company_id,
          user_id: user.id,
          scheduled_date: date,
          scheduled_time: time,
          notes,
          status: 'scheduled'
        }]);

      if (error) throw error;

      toast.success('Inspection scheduled successfully!');
      onSuccess();

    } catch (err: any) {
      toast.error('Failed to schedule inspection: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-bold mb-4">Schedule Inspection</h3>
      <p className="text-sm text-gray-600 mb-4">Lead: {leadName}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Time *</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Any special instructions..."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-900 text-white py-2 px-4 rounded hover:bg-indigo-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Scheduling...' : 'Schedule Inspection'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}