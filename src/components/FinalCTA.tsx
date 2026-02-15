import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const FinalCTA = () => {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useLayoutEffect(() => {
    if (!isClient) return;

    const ctx = gsap.context(() => {
      // Magnetic Button Effect
      const handleMouseMove = (e: MouseEvent) => {
        if (!buttonRef.current || !containerRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(buttonRef.current, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.4,
          ease: "power2.out",
        });

        // Move the background glow toward the mouse
        gsap.to(".cta-glow", {
          x: (e.clientX - window.innerWidth / 2) * 0.1,
          y: (e.clientY - window.innerHeight / 2) * 0.1,
          duration: 1,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
      };

      window.addEventListener("mousemove", handleMouseMove);
      buttonRef.current?.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        buttonRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [isClient]);

  if (!isClient) return <div className="h-[600px] bg-[#020617]" />;

  return (
    <section ref={containerRef} className="relative py-32 w-full bg-[#020617] overflow-hidden flex items-center justify-center">
      
      {/* Background Tech Elements */}
      <div className="cta-glow absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* The Final Core Ping */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 w-12 h-12 bg-blue-500 rounded-full animate-ping opacity-20" />
            <div className="relative w-12 h-12 bg-slate-900 border border-blue-500/50 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
            </div>
          </div>
        </div>

        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
          Ready to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Scale Your Territory?</span>
        </h2>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 antialiased">
          Join the elite roofing firms using AI to automate inspections, 
          track leads, and dominate their local markets.
        </p>

        {/* Magnetic CTA Button */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button 
            ref={buttonRef}
            className="group relative px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] rounded-sm transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.5)]"
          >
            <span className="relative z-10">Deploy RoofTrack AI</span>
            <div className="absolute inset-0 w-0 group-hover:w-full bg-white/10 transition-all duration-300" />
          </button>

          <button className="px-10 py-5 border border-slate-700 hover:border-slate-500 text-slate-300 font-bold uppercase tracking-[0.2em] rounded-sm transition-all">
            View Pricing
          </button>
        </div>

        {/* Closing Subtext */}
        <p className="mt-12 text-slate-600 text-xs font-bold uppercase tracking-widest">
          No credit card required • 14-day free trial • 24/7 Field Support
        </p>
      </div>

      {/* Footer-esque Bottom Border */}
      <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
    </section>
  );
};

export default FinalCTA;