import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LiveMetrics = () => {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Metric Component inside the main file for full scope
  const MetricCard = ({ label, target, suffix, subtext, color }: any) => {
    const [displayValue, setDisplayValue] = useState(0);
    const countRef = useRef({ val: 0 });

    useLayoutEffect(() => {
      if (!isClient) return;

      const anim = gsap.to(countRef.current, {
        val: target,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          // Force React to re-render the incrementing number
          setDisplayValue(Math.ceil(countRef.current.val));
        }
      });

      return () => {
        if (anim.scrollTrigger) anim.scrollTrigger.kill();
        anim.kill();
      };
    }, [isClient, target]);

    return (
      <div className="metric-card relative p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 transition-colors duration-500 overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: color }} />
        
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">{label}</p>
        
        <h3 className="text-6xl font-black text-white mb-2 tracking-tighter flex items-baseline">
          {displayValue.toLocaleString()}
          <span className="text-2xl text-blue-500 ml-1">{suffix}</span>
        </h3>
        
        <p className="text-slate-400 text-sm leading-relaxed antialiased">{subtext}</p>
        
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 group-hover:w-full transition-all duration-700" style={{ backgroundColor: color }} />
      </div>
    );
  };

  if (!isClient) return <div className="h-[500px] w-full bg-[#020617]" />;

  return (
    <section ref={containerRef} className="py-32 w-full bg-[#020617] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="mb-20 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Performance Audit 2026
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Hard Logic. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">Proven ROI.</span>
          </h2>
        </div>

        <div className="metrics-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          <MetricCard 
            label="ROI Increase" 
            target={340} 
            suffix="%" 
            subtext="Average boost in lead conversion and contract value within 6 months of deployment." 
            color="#3b82f6"
          />
          <MetricCard 
            label="AI Accuracy" 
            target={99} 
            suffix="%" 
            subtext="Precision rating for our automated storm damage assessment and roof geometry mapping." 
            color="#10b981"
          />
          <MetricCard 
            label="Resource Efficiency" 
            target={15} 
            suffix="hrs" 
            subtext="Weekly hours reclaimed per field representative by automating route and data sync." 
            color="#f59e0b"
          />
        </div>

      </div>

      {/* Futuristic Grid Background Layer */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`, 
                    backgroundSize: '50px 50px' }} />
    </section>
  );
};

export default LiveMetrics;