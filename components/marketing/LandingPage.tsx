
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
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

export const MarketingHeader: React.FC<{ onNavigate: (route: string) => void, scrolled: boolean }> = ({ onNavigate, scrolled }) => (
  <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-8 py-4 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-8'}`}>
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('Home')}>
        <div className="w-8 h-8 bg-[#0a1628] rounded-lg flex items-center justify-center">
          <span className="text-white text-xl font-serif">S</span>
        </div>
        <span className="font-serif text-xl tracking-tight text-[#0a1628]">Sun AI Agency</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
        <button onClick={() => onNavigate('Public Services')} className="hover:text-black transition-colors">Services</button>
        <button onClick={() => onNavigate('AI Agents')} className="hover:text-black transition-colors">AI Agents</button>
        <button onClick={() => onNavigate('Work')} className="hover:text-black transition-colors">Work</button>
        <button onClick={() => onNavigate('About')} className="hover:text-black transition-colors">Manifesto</button>
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={() => onNavigate('Main')} className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">Sign In</button>
        <button onClick={() => onNavigate('Booking')} className="bg-[#0a1628] text-white px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10">Start Project</button>
      </div>
    </div>
  </nav>
);

export const MarketingFooter: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => (
  <footer className="bg-[#0a1628] text-white py-24 px-8 border-t border-white/5 mt-auto">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
      {/* Brand Column */}
      <div className="space-y-8">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('Home')}>
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#0a1628] text-xl font-serif">S</span>
          </div>
          <h2 className="font-serif text-2xl text-white">Sun AI Agency</h2>
        </div>
        <p className="text-gray-400 font-light leading-relaxed text-sm">
          Engineering high-fidelity operations and creative systems for the next era of commerce.
        </p>
      </div>

      {/* Navigation Column */}
      <div className="space-y-6">
        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-500">Navigation</h4>
        <ul className="space-y-3 text-[13px] text-gray-400">
          <li onClick={() => onNavigate('Home')} className="hover:text-white transition-colors cursor-pointer">Home</li>
          <li onClick={() => onNavigate('Public Services')} className="hover:text-white transition-colors cursor-pointer">Expertise Catalog</li>
          <li onClick={() => onNavigate('AI Agents')} className="hover:text-white transition-colors cursor-pointer">Autonomous Workforce</li>
          <li onClick={() => onNavigate('Work')} className="hover:text-white transition-colors cursor-pointer">Selected Case Studies</li>
          <li onClick={() => onNavigate('About')} className="hover:text-white transition-colors cursor-pointer">Our Manifesto</li>
        </ul>
      </div>

      {/* Platform Column */}
      <div className="space-y-6">
        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-500">Platform</h4>
        <ul className="space-y-3 text-[13px] text-gray-400">
          <li onClick={() => onNavigate('Main')} className="hover:text-white transition-colors cursor-pointer">Main Dashboard</li>
          <li onClick={() => onNavigate('CRM')} className="hover:text-white transition-colors cursor-pointer">CRM Pipeline</li>
          <li onClick={() => onNavigate('Projects')} className="hover:text-white transition-colors cursor-pointer">Projects Portfolio</li>
          <li onClick={() => onNavigate('Tasks')} className="hover:text-white transition-colors cursor-pointer">Execution Manager</li>
          <li onClick={() => onNavigate('Booking')} className="pt-4 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer font-bold flex items-center">
            Start Project Wizard <span className="ml-2">→</span>
          </li>
        </ul>
      </div>

      {/* Contact Column */}
      <div className="space-y-6">
        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-500">Contact</h4>
        <ul className="space-y-4 text-[13px] text-gray-400">
          <li className="hover:text-white transition-colors cursor-pointer flex items-center space-x-2">
            <span>✉️</span>
            <span>hello@sunai.agency</span>
          </li>
          <li className="flex items-center space-x-2">
            <span>📍</span>
            <span>London / Paris / NYC</span>
          </li>
          <li className="pt-6 flex space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-widest">LinkedIn</span>
            <span className="hover:text-white transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-widest">Twitter</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest font-bold gap-4">
      <span>© 2024 Sun AI Agency</span>
      <div className="flex space-x-8">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
      </div>
    </div>
  </footer>
);

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isHoveringOrbital, setIsHoveringOrbital] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const words = ["Build", "Intelligent", "AI", "Products,", "Agents", "&", "Automation"];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-emerald-100 flex flex-col">
      <style>{`
        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes counter-orbit { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .animate-orbit { animation: orbit 60s linear infinite; }
        .animate-counter-orbit { animation: counter-orbit 60s linear infinite; }
        .animate-breathe { animation: breathe 6s ease-in-out infinite; }
        .paused { animation-play-state: paused; }
        .text-gradient-blue {
          background: linear-gradient(180deg, #7FB2E5 0%, #4A90E2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <MarketingHeader onNavigate={onNavigate} scrolled={scrolled} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FDFDFD]">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 py-32">
          
          {/* Left Content */}
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

          {/* Right Orbital Zone */}
          <div className="relative h-[600px] w-full flex items-center justify-center">
            <div className="absolute w-[500px] h-[500px] bg-[#E8F1FF] rounded-full blur-[120px] opacity-20" />
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${isHoveringOrbital ? 'opacity-100' : 'opacity-40'}`}>
              <div className="w-[540px] h-[540px] border border-gray-100 rounded-full absolute" />
              <div className="w-[420px] h-[420px] border border-gray-100 rounded-full absolute" />
              <div className="w-[320px] h-[320px] border border-dashed border-gray-200 rounded-full absolute" />
            </div>
            <div className="relative w-[380px] h-[380px] flex items-center justify-center animate-in zoom-in duration-1000 delay-500">
               <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-visible group animate-breathe">
                  <img src="https://raw.githubusercontent.com/ai-code-gen/assets/main/globe-ai.png" alt="Sun AI Globe" className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.05)]" />
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

      <section className="py-32 bg-white border-y border-gray-50">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-300 block mb-16">Selected Partners</span>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
            {['Vogue', 'LVMH', 'Farfetch', 'Net-a-Porter', 'Gucci', 'Dior'].map(brand => (
              <span key={brand} className="font-serif text-2xl font-bold text-black cursor-default">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;
