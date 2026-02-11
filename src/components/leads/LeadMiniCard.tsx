'use client';
import { useRouter } from 'next/navigation';
import { StatusColors, LeadStatus } from '@/types/Lead';

type LeadMiniCardProps = {
    lead: {
        id: string;
        full_name: string;
        email: string;
        phone_number: string;
        address: string;
        status: LeadStatus;
        date_added: string;
        date_last_contacted?: string;
    };
    onClick: () => void;
    hasUpcomingInspection?: boolean;
};
    
    export default function LeadMiniCard({ lead, onClick, hasUpcomingInspection }: LeadMiniCardProps) {
    return (
        <div
            onClick={onClick}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{lead.full_name}</h3>
                        {/* NEW: Inspection Badge */}
                        {hasUpcomingInspection && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                                📅 Inspection Scheduled
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">📧 {lead.email}</p>
                    <p className="text-sm text-gray-600">📞 {lead.phone_number}</p>
                </div>
                <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: StatusColors[lead.status as LeadStatus] }}
                >
                    {lead.status}
                </span>
            </div>
            
            <p className="text-sm text-gray-500 mt-2">📍 {lead.address}</p>
        </div>
    );
}