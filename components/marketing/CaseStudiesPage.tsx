import React, { useState, useEffect } from 'react';
import MarketingHeader from './Header';
import { MarketingFooter } from './Footer';

interface CaseStudiesPageProps {
  onNavigate: (route: string) => void;
}

const CaseStudiesPage: React.FC<CaseStudiesPageProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    {
      title: 'Maison Laurent',
      category: 'AI Transformation',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
      roi: '+42% Sales Efficiency'
    },
    {
      title: 'Luxe Collective',
      category: 'Predictive CRM',
      image: 'https://images.unsplash.com/photo-1491333078588-55b6733c7de6?auto=format&fit=crop&q=80&w=1200',
      roi: '30% Faster Lead Triage'
    },
    {
      title: 'Heritage SS25',
      category: 'Cinematic AI Mood films',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200',
      roi: '85% Creative Cost Reduction'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <MarketingHeader onNavigate={onNavigate} scrolled={scrolled} />

      <div className="max-w-7xl mx-auto px-8 pt-48 pb-40">
        <header className="mb-32 space-y-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-[11px]">The Proof Room</span>
          <h1 className="font-serif text-6xl leading-tight">Quantifiable <span className="italic">Impact.</span></h1>
        </header>

        <div className="grid grid-cols-1 gap-32">
          {projects.map((p, i) => (
            <div key={p.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-20 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`space-y-8 ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <span className="text-[11px] uppercase font-bold tracking-widest text-gray-400">{p.category}</span>
                <h2 className="font-serif text-5xl">{p.title}</h2>
                <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-2xl inline-block">
                   <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Key Outcome</span>
                   <span className="text-2xl font-serif text-emerald-600">{p.roi}</span>
                </div>
                <p className="text-lg text-gray-500 leading-relaxed font-light">
                  Deploying a custom-tuned Gemini 3 architecture allowed {p.title} to automate high-fidelity decision making across their creative supply chain.
                </p>
                <button 
                   onClick={() => onNavigate('Booking')}
                   className="text-black border-b-2 border-black pb-1 text-[13px] font-bold uppercase tracking-widest hover:text-emerald-600 hover:border-emerald-600 transition-all"
                >
                  Read Technical Breakdown →
                </button>
              </div>
              <div className={`aspect-[16/10] bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl relative group ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                 <img src={p.image} alt={p.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
};

export default CaseStudiesPage;