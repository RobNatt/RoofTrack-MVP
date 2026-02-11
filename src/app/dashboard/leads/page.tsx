'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TerritoryMap from '@/components/territoryMap';
import LeadList from '@/components/leads/LeadList';
import LeadForm from '@/components/leads/LeadForm';
import { Button } from '@/components/ui/button';
import InspectionList from '@/components/inspections/InspectionList';
import InspectionCalendar from '@/components/inspections/InspectionCalendar';

export default function LeadsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('canvassing');
    
    const tabs = [
        { id: 'canvassing', label: 'Door Knocking' },
        { id: 'leads', label: 'Leads List' },
        { id: 'inspections', label: 'Inspections' },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto mt-8 p-4">
            {/* Main Tab Buttons */}
            <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 font-semibold rounded-t transition-all ${
                            activeTab === tab.id 
                                ? 'bg-indigo-900 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="border border-gray-200 p-6 bg-white rounded-b-lg">
                {activeTab === 'canvassing' && <CanvassingTab router={router} />}
                {activeTab === 'leads' && <LeadsTab />}
                {activeTab === 'inspections' && <InspectionsTab />}
            </div>
        </div>
    );
}

function CanvassingTab({ router }: { router: any }) {
    return (
        <div>
            <div className="mb-4">
                <Button 
                    variant="outline" 
                    onClick={() => router.push('/dashboard/territoryManagement')}
                    className="text-lg"
                >
                    🗺️ Open Full Territory Map
                </Button>
            </div>
            <p className="text-gray-600 mb-4">
                View your dropped pins below or open the full map for better visibility
            </p>
            <TerritoryMap />
        </div>
    );
}

function LeadsTab() {
    const [subTab, setSubTab] = useState('view');

    return (
        <div>
            {/* Sub-tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setSubTab('view')}
                    className={`px-4 py-2 rounded transition-all ${
                        subTab === 'view'
                            ? 'bg-indigo-900 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    📋 View Leads
                </button>
                <button
                    onClick={() => setSubTab('add')}
                    className={`px-4 py-2 rounded transition-all ${
                        subTab === 'add'
                            ? 'bg-indigo-900 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    ➕ Add New Lead
                </button>
            </div>

            {/* Sub-tab Content */}
            {subTab === 'view' && <LeadList />}
            {subTab === 'add' && <LeadForm onSuccess={() => setSubTab('view')} />}
        </div>
    );
}

function InspectionsTab() {
    const [view, setView] = useState<'calendar' | 'list'>('calendar');
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">📅 Inspections</h2>
                
                {/* View Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('calendar')}
                        className={`px-4 py-2 rounded ${
                            view === 'calendar'
                                ? 'bg-indigo-900 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        📅 Calendar
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 rounded ${
                            view === 'list'
                                ? 'bg-indigo-900 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        📋 List
                    </button>
                </div>
            </div>
            
            {view === 'calendar' ? <InspectionCalendar /> : <InspectionList />}
        </div>
    );
}