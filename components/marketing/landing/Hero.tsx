
import React, { useState } from 'react';

interface HeroProps {
  onNavigate: (route: string) => void;
}

const ORBITAL_ICONS = [
  { label: 'NLP', icon: '💬', angle: 0 },
  { label: 'CLOUD', icon: '☁️', angle: 45 },
  { label: 'INTEGRATIONS', icon: '🔗', angle: 90 },
  { label: 'SOLUTIONS', icon: '📦', angle: 135 },
  { label: 'DATA', icon: '🗄️', angle: 180 },
  { label: 'AI AGENTS', icon: '🤖', angle: 225 },
  { label: 'AUTOMATION', icon: '⚙️', angle: 270 },
  { label: 'ANALYTICS', icon: '📊', angle: 315 },
];

const AnimatedGlobe: React.FC = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_20px_40px_rgba(74,144,226,0.15)]">
    <defs>
      <linearGradient id="aiGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7FB2E5" />
        <stop offset="100%" stopColor="#4A90E2" />
      </linearGradient>
      <mask id="globeMask">
        <circle cx="200" cy="200" r="180" fill="white" />
      </mask>
    </defs>
    <g mask="url(#globeMask)">
      <circle cx="200" cy="200" r="180" fill="#f8fbff" opacity="0.3" />
      {Array.from({ length: 12 }).map((_, lat) => {
        const y = 20 + (lat * 360) / 11;
        return Array.from({ length: 24 }).map((_, lon) => {
          const x = 20 + (lon * 360) / 23;
          const isContinent = Math.sin(lat * 0.5) * Math.cos(lon * 0.5) > 0;
          return isContinent ? (
            <circle 
              key={`${lat}-${lon}`} 
              cx={x} 
              cy={y} 
              r="1.5" 
              fill={lat % 2 === 0 ? "#4A90E2" : "#7FB2E5"} 
              opacity={0.15 + Math.random() * 0.2}
              className="animate-pulse"
              style={{ animationDelay: `${Math.random() * 2}s` }}
            />
          ) : null;
        });
      })}
    </g>
    <text 
      x="200" 
      y="225" 
      textAnchor="middle" 
      className="font-serif font-bold italic"
      style={{ fontSize: '120px', fill: 'url(#aiGradient)', filter: 'drop-shadow(0 4px 12px rgba(74,144,226,0.2))' }}
    >
      AI
    </text>
    <circle cx="200" cy="200" r="190" fill="none" stroke="url(#aiGradient)" strokeWidth="0.5" opacity="0.1" />
  </svg>
);

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [isHoveringOrbital, setIsHoveringOrbital] = useState(false);
  const words = ["Build", "Intelligent", "AI", "Products,", "Agents", "&", "Automation"];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FDFDFD]">
      <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 py-32">
        <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex items-center space-x-3 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Production-Ready AI</span>
          </div>
          
          <h1 className="font-serif text-6xl md:text-[72px] leading-[1.05] tracking-tight text-[#0a1628]">
            {words.map((word, i) => (
              <span 
                key={i} 
                className={`inline-block mr-[0.25em] animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-backwards ${word === "AI" || word === "Products," ? 'text-gradient-blue' : ''}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {word}
              </span>
            ))}
          </h1>
          
          <p className="text-xl text-gray-500 font-light leading-relaxed max-w-lg">
            Sun AI designs and launches production-ready AI platforms, automation systems, and multi-agent solutions that transform how teams work and scale.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button onClick={() => onNavigate('Booking')} className="bg-[#0a1628] text-white px-10 py-5 rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-2xl shadow-black/10 group flex items-center">
              Start Your Project <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button onClick={() => onNavigate('Work')} className="bg-white text-[#0a1628] border border-gray-200 px-10 py-5 rounded-full text-[13px] font-bold uppercase tracking-widest hover:border-gray-300 transition-all flex items-center">
              <span className="mr-2">💬</span> Talk to an Expert
            </button>
          </div>
        </div>

        <div className="relative h-[600px] w-full flex items-center justify-center">
          <div className="absolute w-[500px] h-[500px] bg-[#E8F1FF] rounded-full blur-[120px] opacity-20" />
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${isHoveringOrbital ? 'opacity-100' : 'opacity-40'}`}>
            <div className="w-[540px] h-[540px] border border-gray-100 rounded-full absolute" />
            <div className="w-[420px] h-[420px] border border-gray-100 rounded-full absolute" />
            <div className="w-[320px] h-[320px] border border-dashed border-gray-200 rounded-full absolute" />
          </div>
          <div className="relative w-[380px] h-[380px] flex items-center justify-center animate-in zoom-in duration-1000 delay-500">
             <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible group animate-breathe">
                <div className="w-full h-full">
                  <AnimatedGlobe />
                </div>
             </div>
          </div>
          <div className={`absolute inset-0 animate-orbit ${isHoveringOrbital ? 'paused' : ''}`} onMouseEnter={() => setIsHoveringOrbital(true)} onMouseLeave={() => setIsHoveringOrbital(false)}>
            {ORBITAL_ICONS.map((node) => (
              <div key={node.label} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: `translate(-50%, -50%) rotate(${node.angle}deg) translateY(-270px)` }}>
                <div className="animate-counter-orbit flex flex-col items-center group cursor-pointer" style={{ animationPlayState: isHoveringOrbital ? 'paused' : 'running' }}>
                  <div className="w-14 h-14 bg-white border border-gray-100 rounded-full shadow-[0_12px_24px_rgba(0,0,0,0.05)] flex items-center justify-center text-xl group-hover:scale-125 group-hover:border-[#4A90E2] transition-all duration-500 relative">
                     <span className="z-10 group-hover:rotate-12 transition-transform">{node.icon}</span>
                  </div>
                  <span className="mt-3 text-[8px] uppercase tracking-[0.3em] font-bold text-gray-300 group-hover:text-[#0a1628] transition-colors">{node.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
