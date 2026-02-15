import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const DashboardDeepDive = () => {
  const [isClient, setIsClient] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useLayoutEffect(() => {
    if (!isClient) return;

    const ctx = gsap.context(() => {
      // Create the 3D Fan-out on Scroll
      gsap.to(".parallax-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
        rotateY: -25,
        rotateX: 10,
        x: (i) => i * 60,
        z: (i) => i * 100,
        stagger: 0.1,
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isClient]);

  if (!isClient) return <div className="h-screen w-full bg-[#020617]" />;

  return (
    <section ref={sectionRef} className="h-screen w-full flex items-center justify-center bg-[#020617] overflow-hidden">
      <div className="max-w-7xl w-full px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Marketing Narrative */}
        <div className="z-30">
          <div className="inline-block px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold mb-4 tracking-widest uppercase">
            Product Deep Dive
          </div>
          <h2 className="text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-[0.9]">
            Software <br/><span className="text-blue-500">You Can Feel.</span>
          </h2>
          <p className="text-slate-400 text-xl leading-relaxed max-w-md">
            Stop looking at flat data. RoofTrack AI brings your territory to life with 3D spatial awareness and real-time lead tracking.
          </p>
        </div>

        {/* 3D UI Stack */}
        <div className="relative h-[600px] flex items-center justify-center perspective-2000">
          
          {/* Bottom Layer: Map */}
          <div className="parallax-card absolute w-[400px] shadow-2xl rounded-2xl overflow-hidden border border-white/5 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <img src="/DoorKnockCard.png" alt="Map UI" className="w-full" />
          </div>

          {/* Middle Layer: Calendar */}
          <div className="parallax-card absolute w-[400px] shadow-2xl rounded-2xl overflow-hidden border border-white/10 z-10 opacity-80">
            <img src="/inspectionsCalendarCard.png" alt="Calendar UI" className="w-full" />
          </div>

          {/* Top Layer: Leads Dashboard */}
          <div className="parallax-card absolute w-[400px] shadow-2xl rounded-2xl overflow-hidden border border-blue-500/40 z-20 ring-1 ring-blue-500/20">
            <img src="/leadsDashboardCard.png" alt="Leads UI" className="w-full" />
          </div>

        </div>
      </div>
      
      <style jsx>{`
        .perspective-2000 { perspective: 2000px; }
        .parallax-card { transform-style: preserve-3d; }
      `}</style>
    </section>
  );
};

export default DashboardDeepDive;