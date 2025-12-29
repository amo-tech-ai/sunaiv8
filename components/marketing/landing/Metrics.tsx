
import React, { useEffect, useRef, useState } from 'react';

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  trigger: boolean;
}

const Counter: React.FC<CounterProps> = ({ end, suffix = "", duration = 1500, trigger }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [trigger, end, duration]);

  return <span>{count}{suffix}</span>;
};

const MetricCard: React.FC<{ 
  icon: React.ReactNode; 
  number: number; 
  suffix: string; 
  label: string; 
  delay: number;
  isVisible: boolean;
  accentClass: string;
  bgAccentClass: string;
}> = ({ icon, number, suffix, label, delay, isVisible, accentClass, bgAccentClass }) => (
  <div 
    className={`bg-white border border-gray-100 p-8 rounded-[16px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex items-center space-x-6 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
    }`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className={`w-14 h-14 ${bgAccentClass} rounded-full flex items-center justify-center shrink-0`}>
      <div className={`${accentClass} w-7 h-7`}>{icon}</div>
    </div>
    <div>
      <div className="text-[48px] font-bold text-[#00334F] leading-none mb-1">
        <Counter end={number} suffix={suffix} trigger={isVisible} />
      </div>
      <p className="text-[15px] text-gray-500 font-medium">{label}</p>
    </div>
  </div>
);

const Metrics: React.FC = () => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const growthHeights = [45, 58, 72, 65, 84, 92, 100];

  return (
    <section ref={sectionRef} className="py-32 bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Content & Metrics */}
        <div className="space-y-10">
          <div className={`space-y-6 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="font-serif text-5xl text-[#00334F] leading-tight max-w-lg">
              AI That Drives <span className="text-[#FF6B2C]">Measurable Results</span>
            </h2>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-md">
              Stop experimenting and start scaling. Our systems are engineered for ROI, speed, and reliability.
            </p>
          </div>

          <div className="space-y-6">
            <MetricCard 
              isVisible={isVisible}
              delay={400}
              number={6}
              suffix="x"
              label="Faster Deployment"
              accentClass="text-[#FF6B2C]"
              bgAccentClass="bg-[#FF6B2C]/5"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              }
            />
            <MetricCard 
              isVisible={isVisible}
              delay={500}
              number={35}
              suffix="%"
              label="Cost Savings"
              accentClass="text-emerald-500"
              bgAccentClass="bg-emerald-50"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              }
            />
            <MetricCard 
              isVisible={isVisible}
              delay={600}
              number={340}
              suffix="%"
              label="Productivity Lift"
              accentClass="text-purple-500"
              bgAccentClass="bg-purple-50"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Right: Chart Visualization */}
        <div className={`bg-white border border-gray-100 p-10 md:p-12 rounded-[24px] shadow-xl transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
        }`}>
          <div className="mb-12">
            <h4 className="text-[18px] font-semibold text-[#00334F] mb-8">Performance vs. Traditional Development</h4>
            
            <div className="space-y-6">
              {/* Traditional Dev Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[13px] font-medium text-gray-400 uppercase tracking-wider">
                  <span>Traditional Dev</span>
                  <span>8 Months</span>
                </div>
                <div className="h-10 w-full bg-gray-100 rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-slate-300 transition-all duration-1000 ease-out"
                    style={{ width: isVisible ? '100%' : '0%' }}
                  />
                </div>
              </div>

              {/* Sun AI Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[13px] font-bold text-[#FF6B2C] uppercase tracking-wider">
                  <span>Sun AI Platform</span>
                  <span>8 Weeks</span>
                </div>
                <div className="h-10 w-full bg-[#FF6B2C]/10 rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-[#FF6B2C] transition-all duration-1000 delay-200 ease-out"
                    style={{ width: isVisible ? '16.6%' : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-50 flex flex-col items-center">
            <div className="h-40 w-full flex items-end justify-between space-x-2 px-4 mb-6">
              {growthHeights.map((h, i) => (
                <div 
                  key={i}
                  className="flex-1 bg-gradient-to-t from-[#0D9488]/80 to-[#14B8A6] rounded-t-md transition-all duration-1000 ease-out shadow-lg"
                  style={{ 
                    height: isVisible ? `${h}%` : '0%',
                    transitionDelay: `${1000 + (i * 100)}ms`
                  }}
                />
              ))}
            </div>
            <p className="text-[13px] text-gray-400 font-medium uppercase tracking-[0.2em]">Project Velocity Over Time</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Metrics;
