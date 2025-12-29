
import React, { useEffect, useRef, useState } from 'react';

interface BuildCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const BuildCard: React.FC<BuildCardProps> = ({ icon, title, description, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 80);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`bg-white border border-gray-100 p-8 rounded-[20px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group flex flex-col h-full ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="w-14 h-14 bg-emerald-50/50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-50 transition-colors duration-500">
        <div className="text-emerald-600 w-7 h-7 group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
      </div>
      <h3 className="text-[17px] font-semibold text-[#0a1628] mb-3 tracking-tight">{title}</h3>
      <p className="text-[14px] text-gray-500 font-light leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const WhatWeBuild: React.FC = () => {
  const items = [
    {
      title: "AI Applications",
      description: "Intelligent applications that adapt to user context and behavior.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <path d="M12 18h.01" />
          <path d="M9 6h6" />
        </svg>
      )
    },
    {
      title: "Automation Systems",
      description: "End-to-end workflows that run reliably on autopilot.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 11a8.1 8.1 0 00-15.5-2m-.5 5v-5h5" />
          <path d="M4 13a8.1 8.1 0 0015.5 2m.5-5v5h-5" />
        </svg>
      )
    },
    {
      title: "Multi-Agent Systems",
      description: "Orchestrated agents solving complex, multi-step logic.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      )
    },
    {
      title: "Custom AI Agents",
      description: "Specialized agents trained on your data and workflows.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v2M12 20v2M20 12h2M2 12h2" />
          <circle cx="12" cy="12" r="4" />
          <path d="M15 9l3-3M9 15l-3 3M15 15l3 3M9 9l-3-3" />
        </svg>
      )
    },
    {
      title: "Dashboards & Analytics",
      description: "Real-time visibility into performance, operations, and outcomes.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V10M12 20V4M6 20v-6" />
          <path d="M3 20h18" />
        </svg>
      )
    },
    {
      title: "Internal Tools",
      description: "Admin panels and systems that streamline internal operations.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.77 3.77z" />
        </svg>
      )
    },
    {
      title: "Marketplaces",
      description: "Platforms that intelligently match supply and demand.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      )
    },
    {
      title: "Autonomous Workflows",
      description: "Self-healing processes for mission-critical execution.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-32 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-8">
        <header className="mb-20 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-px bg-emerald-500" />
            <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-400">OUR EXPERTISE</span>
          </div>
          <h2 className="font-serif text-5xl text-[#0a1628] leading-tight">What We Build</h2>
          <p className="text-lg text-gray-500 font-light leading-relaxed max-w-2xl">
            From custom agents to full-scale automation platforms, we engineer systems that drive measurable ROI.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <BuildCard
              key={item.title}
              index={i}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeBuild;
