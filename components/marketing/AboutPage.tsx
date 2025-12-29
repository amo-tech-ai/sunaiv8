
import React, { useState, useEffect } from 'react';
import MarketingHeader from './Header';
import MarketingFooter from './Footer';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <MarketingHeader onNavigate={onNavigate} scrolled={scrolled} />

      <div className="max-w-7xl mx-auto px-8 pt-48 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start mb-40">
           <header className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
             <span className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-[11px]">The Manifesto</span>
             <h1 className="font-serif text-7xl leading-tight text-[#0a1628]">Intelligence, not <span className="italic text-gray-400">Noise.</span></h1>
           </header>
           <div className="space-y-12 pt-4">
             <p className="text-2xl font-serif italic text-gray-700 leading-relaxed">
               "We believe the most powerful AI systems are the ones that fade into the architecture of a business. At Sun AI Agency, we build 'Quiet AI'—systems that work silently at scale so you can do your best human work."
             </p>
             <div className="h-px bg-gray-100 w-full" />
             <p className="text-lg text-gray-500 leading-relaxed font-light">
               Founded by a team of engineers and creative directors from the luxury sector, we saw a gap between AI hype and production reality. We bridged that gap by combining hyper-local grounding with enterprise-grade reasoning.
             </p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-y border-gray-100 py-32">
           <div className="space-y-6">
             <span className="text-[11px] uppercase tracking-widest font-bold text-gray-400">01. Grounded</span>
             <h3 className="text-2xl font-serif">Verified Intelligence</h3>
             <p className="text-[14px] text-gray-500 leading-relaxed">Every claim our AI makes is verified against real-time search and location data. No hallucinations, just facts.</p>
           </div>
           <div className="space-y-6">
             <span className="text-[11px] uppercase tracking-widest font-bold text-gray-400">02. Autonomous</span>
             <h3 className="text-2xl font-serif">Self-Healing Workflows</h3>
             <p className="text-[14px] text-gray-500 leading-relaxed">Our agents monitor their own performance, identifying risks and suggesting optimizations before you even log in.</p>
           </div>
           <div className="space-y-6">
             <span className="text-[11px] uppercase tracking-widest font-bold text-gray-400">03. High-Fidelity</span>
             <h3 className="text-2xl font-serif">Production-Ready</h3>
             <p className="text-[14px] text-gray-500 leading-relaxed">We don't do 'proof of concepts'. We launch production platforms that generate revenue from day one.</p>
           </div>
        </div>

        <div className="mt-40 text-center space-y-12">
           <span className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-[11px]">Join the Network</span>
           <h2 className="font-serif text-5xl text-[#0a1628]">Ready to Quiet the Noise?</h2>
           <button 
             onClick={() => onNavigate('Booking')}
             className="bg-black text-white px-12 py-5 rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl active:scale-95"
           >
             Schedule a Strategy Call
           </button>
        </div>
      </div>

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
};

export default AboutPage;
