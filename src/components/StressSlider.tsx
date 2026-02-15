'use client'

import React, { useState, useRef } from 'react';

const StressSlider = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : (e as React.MouseEvent).clientX - rect.left;
    
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(position);
  };

  return (
    <section className="relative w-full min-h-screen bg-transparent flex flex-col items-center justify-center overflow-hidden py-20">
      <div className="text-center mb-12 px-6">
        <h2 className="text-5xl font-black text-indigo-950 mb-4 tracking-tight">
          Wipe Away the <span className="text-red-500">Chaos</span>
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-lg font-medium">
          Drag to see how RoofTrack replaces messy paper trails with a unified digital command center.
        </p>
      </div>

      <div 
        ref={containerRef}
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        className="relative w-full max-w-6xl aspect-[16/10] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] cursor-col-resize select-none bg-slate-50 border border-gray-100"
      >
        {/* AFTER: THE ROOFTRACK DASHBOARD COMPOSITION */}
        <div className="absolute inset-0 bg-[#f8fafc] p-8 flex items-center justify-center">
          <div className="relative w-full h-full max-w-5xl">
            
            {/* 1. THE MAP (Main Anchor) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] z-0 shadow-2xl rounded-xl overflow-hidden border border-gray-200">
               <img src="/DoorKnockCard.png" alt="Map" className="w-full h-auto" />
            </div>

           {/* 2. LEADS CARD (Floating Top Left) */}
            <div className="absolute top-4 left-4 w-[28%] z-20 shadow-2xl rounded-3xl overflow-hidden animate-float-fast">
                <img src="/leadsDashboardCard.png" alt="Leads" className="w-full h-auto" />
            </div>

            {/* 3. CALENDAR CARD (Floating Right) */}
            <div className="absolute top-12 right-0 w-[35%] z-10 shadow-2xl rounded-xl overflow-hidden animate-float-slow">
                <img src="/inspectionsCalendarCard.png" alt="Inspections" className="w-full h-auto" />
            </div>

          </div>
        </div>

        {/* BEFORE: THE CHAOS (Top Layer) */}
        <div 
          className="absolute inset-0 z-30"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img 
            src="/messyDesk.png" 
            alt="Chaos" 
            className="w-full h-full object-cover grayscale-[0.3] contrast-[1.1]"
          />
          {/* Subtle "Dirty" Overlay */}
          <div className="absolute inset-0 bg-amber-900/5 mix-blend-multiply" />
        </div>

        {/* THE SLIDER HANDLE */}
        <div 
          className="absolute top-0 bottom-0 z-40 w-1 bg-white shadow-[0_0_30px_rgba(0,0,0,0.3)] flex items-center justify-center"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-[6px] border-indigo-600">
             <div className="flex gap-1">
                <div className="w-1 h-4 bg-indigo-100 rounded-full" />
                <div className="w-1 h-4 bg-indigo-600 rounded-full" />
                <div className="w-1 h-4 bg-indigo-100 rounded-full" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StressSlider;