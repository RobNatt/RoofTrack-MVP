'use client';
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from 'next/navigation';
import LeadsSummary from '@/components/dashboard/LeadsSummary';

export default function DashboardPage() {
    const router = useRouter();
    return (
        <main className="dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-header align-center justify-center flex text-5xl bold m-6">
                    <h1 className="dashboard-title text-yellow-300 bg-indigo-900 p-4 rounded-3xl shadow-xl text-opacity-30 font-serif uppercase text-center mt-10">Dashboard</h1>
                </div>
                
                <div className="dashboard-content flex flex-row gap-4 flex-wrap justify-center p-8 bg-gray-200 rounded-3xl shadow-xl">
                    {/* LEADS CONTAINER - WITH SUMMARY */}
                    <div className="Lead-container">
                        <div className="leads-container rounded-3xl mt-2 p-4 bg-white shadow-xl px-5 py-6">
                            <div className="container-header text-2xl font-bold mb-4 text-indigo-900 text-opacity-30 font-serif uppercase text-center">Leads</div>
                            
                            {/* Summary Widget */}
                            <div className="mb-4">
                                <LeadsSummary />
                            </div>
                            
                            {/* Button */}
                            <div className="button-container text-center">
                                <Button variant="outline" onClick={() => router.push('/dashboard/leads')}>
                                    View Full Dashboard
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* PROSPECTS */}
                    <div className="Prospect-container">
                        <div className="prospects-container rounded-3xl mt-2 p-4 bg-white shadow-xl px-5 py-10">
                            <div className="container-header text-2xl font-bold mb-4 text-indigo-900 text-opacity-30 font-serif uppercase text-center mt-10">Prospects</div>
                            <div className="container-content">
                                <div className="button-container">
                                    <Button variant="outline">Coming Soon</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BUILDS */}
                    <div className="Build-container">
                        <div className="builds-container rounded-3xl mt-2 p-4 bg-white shadow-xl px-5 py-10">
                            <div className="container-header text-2xl font-bold mb-4 text-indigo-900 text-opacity-30 font-serif uppercase text-center mt-10">Builds</div>
                            <div className="container-content">
                                <div className="button-container">
                                    <Button variant="outline">Coming Soon</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* INVOICING */}
                    <div className="Invoice-container">
                        <div className="invoicing-container rounded-3xl mt-2 p-4 bg-white shadow-xl px-5 py-10">
                            <div className="container-header text-2xl font-bold mb-4 text-indigo-900 text-opacity-30 font-serif uppercase text-center mt-10">Invoicing</div>
                            <div className="container-content">
                                <div className="button-container">
                                    <Button variant="outline">Coming Soon</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}