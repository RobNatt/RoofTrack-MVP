'use client'

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { Particles } from "@/components/ui/particles";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import TerritoryPeek from "@/components/TerritoryPeek";
import StressSlider from "@/components/StressSlider";
import DataEngine from "@/components/DataEngine";
import DashboardDeepDive from "@/components/DashboardDeepDive";
import LiveMetrics from "@/components/LiveMetric";
import FinalCTA from "@/components/FinalCTA";

// Dynamically import HeroSpotlight to avoid SSR issues
const HeroSpotlight = dynamic(() => import("@/components/HeroSpotlight"), {
    ssr: false,
    loading: () => <div className="h-[300vh] bg-black" />
});

export default function Home() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative w-full bg-gray-50">
            {/* Fixed Particles Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Particles
                    className="h-full w-full"
                    quantity={200} 
                    ease={80}
                    color="#4c00af"
                    refresh={false}
                />
            </div>

            {/* Scrollable Content */}
            <div className="relative z-10">
                <HeroSpotlight /> 
            </div>
            <div>
                 <section className="relative min-h-screen flex flex-row items-center justify-center text-center px-4 bg-transparent">
                    <div className="max-w-xl">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Welcome to <span className="text-yellow-400">RoofTrack</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-800 mb-8">
                            Territory management and lead tracking designed specifically for roofing sales teams
                        </p>
                        <Button 
                            onClick={() => router.push('/signup')}
                            className="mt-4 bg-yellow-400 text-indigo-900 font-bold hover:bg-yellow-300 hover:scale-105 transition-all text-lg px-8 py-6"
                        >
                            Get Started Free
                        </Button>
                    </div>
                    <div>
                        <TerritoryPeek />
                    </div>
                    
                </section>
            </div>
            <div>
                <DashboardDeepDive />
            </div>
            <div>
                <StressSlider />
            </div>
            <div>
                <DataEngine />
            </div>
            <div>
                <LiveMetrics />
            </div>
            <div>
                <FinalCTA />
            </div>
        </div>
    );
}