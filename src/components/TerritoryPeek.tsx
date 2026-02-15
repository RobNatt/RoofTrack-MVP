'use client'

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

// Coordinate array to match hotspots to the pins on your image
const PIN_HOTSPOTS = [
    { top: '25%', left: '32%', color: 'bg-green-500' },
    { top: '48%', left: '52%', color: 'bg-red-500' },
    { top: '68%', left: '40%', color: 'bg-yellow-500' },
    { top: '28%', left: '78%', color: 'bg-green-500' },
];

const TerritoryPeek = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const uiRef = useRef<HTMLDivElement>(null);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!hasMounted || !containerRef.current || !cardRef.current || !uiRef.current) return;

        const container = containerRef.current;
        const card = cardRef.current;
        const uiElement = uiRef.current;

        const xTo = gsap.quickSetter(card, "rotateY", "deg");
        const yTo = gsap.quickSetter(card, "rotateX", "deg");
        const uiXTo = gsap.quickSetter(uiElement, "x", "px");
        const uiYTo = gsap.quickSetter(uiElement, "y", "px");

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8; 
            const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -8;
            const moveX = ((e.clientX - centerX) / (rect.width / 2)) * 15;
            const moveY = ((e.clientY - centerY) / (rect.height / 2)) * 15;

            xTo(rotateY);
            yTo(rotateX);
            uiXTo(moveX);
            uiYTo(moveY);

            gsap.to(".data-ping", {
    scale: 2,
    opacity: 0,
    duration: 0.6, // Adjust this to speed up/slow down
    repeat: -1,
    ease: "power2.out"
});
        };

        const handleMouseLeave = () => {
            gsap.to([card, uiElement], { 
                rotateX: 0, rotateY: 0, x: 0, y: 0, 
                duration: 1.2, ease: "power3.out" 
            });
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [hasMounted]);

    if (!hasMounted) return null;

    return (
        <section ref={containerRef} className="relative min-h-screen flex items-center justify-center bg-transparent py-24 overflow-hidden">
            <div style={{ perspective: "1500px" }} className="w-full max-w-6xl px-10">
                <div 
                    ref={cardRef}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative w-full aspect-[16/10] rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100 bg-white"
                >
                    {/* BASE MAP IMAGE */}
                    <img 
                        src="/territoryMapWithPins.png" 
                        alt="Territory Map" 
                        className="w-full h-full object-cover scale-105" 
                    />

                    {/* SUBTLE PIN GLOWS (Placed on the map plane) */}
                    {PIN_HOTSPOTS.map((pin, i) => (
                        <div 
                            key={i}
                            className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ top: pin.top, left: pin.left, transform: "translateZ(5px)" }}
                        >
                            <div className={`absolute inset-0 rounded-full ${pin.color} animate-ping opacity-30`} />
                            <div className={`w-full h-full rounded-full ${pin.color} opacity-40 blur-[2px]`} />
                        </div>
                    ))}

                    {/* SHRUNKEN FLOATING CARD (1/3 SIZE) */}
                    <div 
                        ref={uiRef}
                        style={{ transform: "translateZ(80px)" }} // The "Golden" Pop height
                        className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/50 w-52 pointer-events-none"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Leads: 40</span>
                        </div>
                        <h3 className="text-2xl font-black text-indigo-950">Active: 34</h3>
                        <p className="text-gray-500 font-medium text-[11px]">Today's Inspection: 10:30 AM - Sandy Cheeks</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TerritoryPeek;