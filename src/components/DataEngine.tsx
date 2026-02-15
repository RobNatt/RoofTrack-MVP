import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const DataEngine = () => {
  const [isClient, setIsClient] = useState(false);
  const engineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useLayoutEffect(() => {
    if (!isClient) return;

    const ctx = gsap.context(() => {
      // 1. Entrance Animation
      gsap.from(".node-wrapper", { 
        scale: 0, 
        opacity: 0, 
        duration: 1, 
        stagger: 0.1, 
        ease: "back.out(1.7)" 
      });

      // 2. Subtle Floating Idle State
      gsap.to(".node-wrapper", { 
        y: "-15px", 
        duration: 2.5, 
        repeat: -1, 
        yoyo: true, 
        ease: "sine.inOut", 
        stagger: { each: 0.3, from: "random" } 
      });

      // 3. Mouse Follow Parallax Logic
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const xRotation = (clientY / window.innerHeight - 0.5) * 20;
        const yRotation = (clientX / window.innerWidth - 0.5) * -20;
        
        gsap.to(engineRef.current, { 
          rotateX: xRotation, 
          rotateY: yRotation, 
          duration: 0.5, 
          ease: "power2.out" 
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, [isClient]);

  const Node = ({ label, value, color, position }: { label: string, value: string, color: string, position: string }) => (
    <div className={`absolute ${position} node-wrapper flex flex-col items-center z-20`}>
      <div className="relative mb-3">
        <div className="absolute inset-0 rounded-full blur-md opacity-40 animate-[ping_0.8s_linear_infinite]" style={{ backgroundColor: color }} />
        <div className="relative w-10 h-10 rounded-full border-2 flex items-center justify-center bg-slate-950 shadow-xl" style={{ borderColor: color }}>
             <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        </div>
      </div>
      <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">{label}</span>
      <span className="text-lg font-black text-white">{value}</span>
    </div>
  );

  if (!isClient) return <div className="h-[700px] w-full bg-[#020617]" />;

  return (
    <div ref={containerRef} className="w-full h-[700px] flex items-center justify-center bg-[#020617] perspective-1000 overflow-hidden">
      <div ref={engineRef} className="relative w-[600px] h-[600px] preserve-3d">
        
        {/* DATA STREAM SVG */}
        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 600 600">
          {[
            "M300,300 L300,80",   // Storm Data
            "M300,300 L480,180",  // Schedule
            "M300,300 L550,380",  // Leads
            "M300,300 L420,530",  // Revenue
            "M300,300 L180,530",  // Estimates
            "M300,300 L50,380",   // Satellite
          ].map((path, i) => (
            <React.Fragment key={i}>
              <path d={path} stroke="rgba(59,130,246,0.1)" strokeWidth="1" fill="none" />
              <path 
                d={path} 
                stroke="#3b82f6" 
                strokeWidth="2" 
                fill="none" 
                strokeDasharray="20, 180" 
                className="animate-[dataStream_0.8s_linear_infinite]" 
              />
            </React.Fragment>
          ))}
        </svg>

        {/* CENTRAL CORE */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative w-36 h-36 rounded-full flex items-center justify-center bg-blue-600/10 border border-blue-400/30 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
            <div className="absolute inset-0 rounded-full border border-blue-400/20 animate-[spin_8s_linear_infinite]" />
            <img src="/RoofTrack2.png" alt="RT Logo" className="w-3/4 h-3/4 object-contain" />
          </div>
          <h2 className="text-center mt-4 font-black tracking-tighter text-white text-lg uppercase">RoofTrack AI</h2>
        </div>

        {/* DATA NODES */}
        <Node label="Storm Data" value="LIVE" color="#3b82f6" position="top-[20px] left-1/2 -translate-x-1/2" />
        <Node label="Schedule" value="1 TODAY" color="#10b981" position="top-[120px] right-[40px]" /> 
        <Node label="Leads" value="40" color="#f59e0b" position="bottom-[180px] right-[-30px]" />
        <Node label="Revenue" value="34 ACTIVE" color="#22c55e" position="bottom-[10px] right-[120px]" />
        <Node label="Estimates" value="PENDING" color="#ef4444" position="bottom-[10px] left-[120px]" />
        <Node label="Satellite" value="TERRITORY" color="#8b5cf6" position="bottom-[180px] left-[-30px]" />

      </div>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        @keyframes dataStream {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DataEngine;