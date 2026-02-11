'use client';
import type { Inspection } from '@/types/Inspection';

type InspectionMiniCardProps = {
  inspection: Inspection & {
    lead_name: string;
    lead_address: string;
  };
  onClick: () => void;
};

export default function InspectionMiniCard({ inspection, onClick }: InspectionMiniCardProps) {
  const statusColors = {
    scheduled: '#3b82f6',  // blue
    completed: '#10b981',  // green
    canceled: '#6b7280',   // gray
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
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
    <div
      onClick={onClick}
      className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg">{inspection.lead_name}</h3>
          <p className="text-sm text-gray-600">📍 {inspection.lead_address}</p>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold text-white capitalize"
          style={{ backgroundColor: statusColors[inspection.status] }}
        >
          {inspection.status}
        </span>
      </div>

      <div className="flex gap-4 text-sm text-gray-700 mt-3">
        <div>
          <span className="font-semibold">📅 {formatDate(inspection.scheduled_date)}</span>
        </div>
        <div>
          <span className="font-semibold">🕐 {formatTime(inspection.scheduled_time)}</span>
        </div>
      </div>

      {inspection.notes && (
        <p className="text-sm text-gray-600 mt-2 italic">
          Note: {inspection.notes}
        </p>
      )}
    </div>
  );
}