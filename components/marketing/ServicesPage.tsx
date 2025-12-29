
import React, { useState, useEffect } from 'react';
import { MarketingHeader, MarketingFooter } from './LandingPage';

interface ServicesPageProps {
  onNavigate: (route: string) => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      id: '01',
      title: 'AI Agents & Automation',
      desc: 'Multi-agent autonomous workflows for supply chain, research, and client triage.',
      signals: 'Reduced operational overhead by 40% for global retail brands.'
    },
    {
      id: '02',
      title: 'Predictive ROI Modeling',
      desc: 'Financial forecasting agents that model market shifts and campaign impact.',
      signals: '96% accuracy in budget projection for SS25 launches.'
    },
    {
      id: '03',
      title: 'Custom RAG Architectures',
      desc: 'Privacy-first internal knowledge bases that turn your documentation into an expert.',
      signals: 'Seamless onboarding for teams of 500+ across 3 continents.'
    },
    {
      id: '04',
      title: 'Creative Cinematic AI',
      desc: 'Cinematic mood-board and video generation using Veo and Pro-tier models.',
      signals: '10x faster creative prototyping for fashion editorial teams.'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <MarketingHeader onNavigate={onNavigate} scrolled={scrolled} />
      
      <div className="max-w-7xl mx-auto px-8 pt-48 pb-40">
        <header className="max-w-3xl mb-32 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-[11px]">Expertise Catalog</span>
          <h1 className="font-serif text-6xl leading-tight">Grounded AI Solutions for <span className="italic">Grounded Results.</span></h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed">
            We don't sell black boxes. We deliver transparent, high-fidelity systems that solve specific operational bottlenecks in the creative sector.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {services.map((s, i) => (
            <div 
              key={s.id} 
              className="p-12 border border-gray-100 rounded-3xl hover:border-black hover:shadow-2xl transition-all duration-700 group flex flex-col justify-between min-h-[400px]"
            >
              <div>
                <span className="font-serif text-4xl text-gray-200 group-hover:text-emerald-500 transition-colors duration-700 block mb-10">{s.id}.</span>
                <h3 className="font-serif text-3xl mb-6">{s.title}</h3>
                <p className="text-gray-500 font-light leading-relaxed mb-8">{s.desc}</p>
              </div>
              <div className="pt-8 border-t border-gray-50 italic font-serif text-[15px] text-emerald-600">
                Signals: {s.signals}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-40 bg-black rounded-[4rem] p-20 text-center text-white space-y-12">
          <h2 className="font-serif text-5xl leading-tight max-w-2xl mx-auto">Have a Custom Use Case? Let's Architect It.</h2>
          <button 
            onClick={() => onNavigate('Booking')}
            className="bg-emerald-500 text-black px-12 py-5 rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
          >
            Launch Strategy Brief
          </button>
        </div>
      </div>

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
};

export default ServicesPage;
