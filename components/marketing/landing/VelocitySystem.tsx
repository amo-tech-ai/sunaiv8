
import React, { useEffect, useRef, useState } from 'react';

interface TimelineStepProps {
  week: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  delay: number;
  isVisible: boolean;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ week, title, subtitle, icon, delay, isVisible }) => (
  <div 
    className={`relative flex flex-col items-center group transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    {/* Icon Area */}
    <div className="mb-8 relative z-10 flex flex-col items-center">
      <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center border border-[#FF6B2C]/20 shadow-sm group-hover:scale-110 group-hover:border-[#FF6B2C] group-hover:shadow-[#FF6B2C]/10 transition-all duration-500 mb-4`}>
        <div className="text-[#FF6B2C] w-5 h-5">{icon}</div>
      </div>
      {/* Connector Dot */}
      <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B2C] border-2 border-white shadow-sm" />
    </div>

    {/* Card */}
    <div className="bg-white border border-[#0F172A]/[0.08] p-8 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)] hover:-translate-y-1.5 transition-all duration-500 w-full text-center">
      <span className="text-[11px] uppercase tracking-[0.1em] font-bold text-[#FF6B2C] block mb-2">{week}</span>
      <h4 className="text-[20px] font-bold text-[#0F172A] mb-2">{title}</h4>
      <p className="text-[14px] text-[#64748B] leading-relaxed font-light">{subtitle}</p>
    </div>
  </div>
);

const VelocitySystem: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      week: "WEEKS 1–2",
      title: "Strategy & Design",
      subtitle: "Scope, architecture, and UX",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      )
    },
    {
      week: "WEEKS 3–5",
      title: "Rapid Build",
      subtitle: "Core development and AI logic",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    },
    {
      week: "WEEKS 6–7",
      title: "Integrations",
      subtitle: "Testing and connecting APIs",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      )
    },
    {
      week: "WEEK 8",
      title: "Launch & Scale",
      subtitle: "Deployment and handoff",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
          <path d="M12 15l-3-3" />
          <path d="M19 8l-2-2" />
          <path d="M20 4a2 2 0 00-2.83 0L10 11.17l4.83 4.83L22 9s-1.04-4.25-2-5z" />
        </svg>
      )
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="py-32 bg-gradient-to-b from-[#F7FAFC] to-[#EEF3F7] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-8">
        {/* Header Block */}
        <header className="text-center mb-24 space-y-6">
          <span 
            className={`text-[12px] uppercase tracking-[0.1em] font-bold text-[#FF6B2C] block transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            THE SUN AI VELOCITY SYSTEM
          </span>
          <h2 
            className={`font-serif text-[48px] md:text-[64px] text-[#0F172A] leading-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            Build AI in <span className="text-[#FF6B2C]">8 Weeks.</span> Not 8 Months.
          </h2>
          <p 
            className={`text-[18px] md:text-[20px] text-[#475569] font-light leading-relaxed max-w-2xl mx-auto transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            A proven acceleration system that takes your AI project from idea to production — fast.
          </p>
        </header>

        {/* Timeline visualization */}
        <div className="relative pt-12">
          {/* Horizontal Line - Drawing animation */}
          <div className="absolute top-[61px] left-0 right-0 h-[2px] bg-[#0F172A]/[0.08] hidden lg:block">
            <div 
              className="h-full bg-gradient-to-r from-transparent via-[#FF6B2C]/30 to-transparent transition-all duration-[2000ms] ease-in-out"
              style={{ width: isVisible ? '100%' : '0%' }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <TimelineStep
                key={step.title}
                week={step.week}
                title={step.title}
                subtitle={step.subtitle}
                icon={step.icon}
                delay={800 + (i * 150)}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>

        {/* Final Affirmation */}
        <div 
          className={`mt-24 text-center transition-all duration-1000 delay-[1.5s] ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <button className="bg-[#0F172A] text-white px-10 py-4 rounded-xl text-[13px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#0F172A]/10">
            View Sample Timeline
          </button>
        </div>
      </div>
    </section>
  );
};

export default VelocitySystem;
