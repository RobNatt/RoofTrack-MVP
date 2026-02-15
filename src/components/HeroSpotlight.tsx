'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HeroSpotlight: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Client-side only mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Setup GSAP animation after mount
  useEffect(() => {
    if (!isMounted || !containerRef.current || !textRef.current) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        gsap.to(textRef.current, {
          scale: 50,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            markers: false, // Set to true for debugging
            pin: false,
          },
        });
      }, containerRef);

      // Refresh ScrollTrigger after setup
      ScrollTrigger.refresh();

      return () => {
        ctx.revert();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMounted]);

  // Show placeholder during SSR
  if (!isMounted) {
    return <div className="h-[300vh] bg-black" />;
  }

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-black">
      {/* Sticky container */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          style={{ zIndex: 0 }}
        >
          <source src="/RoofVideo.mp4" type="video/mp4" />
        </video>
        
        {/* Text with mix-blend */}
        <div 
          className="relative flex h-full w-full items-center justify-center" 
          style={{ 
            zIndex: 10,
            mixBlendMode: 'screen',
            backgroundColor: 'white'
          }}
        >
          <h1 
            ref={textRef}
            className="text-[25vw] text-center font-black tracking-tighter uppercase leading-none"
            style={{ 
              color: 'black',
              transformOrigin: 'center center',
              willChange: 'transform'
            }}
          >
            ROOF
            
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSpotlight;
