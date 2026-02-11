// components/DashboardCard.tsx
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const DashboardCard = ({ title, description, icon }: CardProps) => {
  return (
    <div className="group relative">
      {/* The Glow Effect (Hidden by default, fades in on hover) */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-brand-aurora to-cyan-500 opacity-0 blur transition duration-500 group-hover:opacity-60" />
      
      {/* The Card Body */}
      <div className="relative flex flex-col h-64 w-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:bg-white/10">
        <div className="mb-4 text-brand-gold text-3xl">
          {icon || "✨"}
        </div>
        <h3 className="mb-2 text-xl font-bold text-white tracking-wide">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-brand-silver/80">
          {description}
        </p>
      </div>
    </div>
  );
};