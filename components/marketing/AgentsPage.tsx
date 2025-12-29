import React, { useState, useEffect } from 'react';
import MarketingHeader from './Header';
import { MarketingFooter } from './Footer';
import OrchestrationDiagram from './OrchestrationDiagram';

interface AgentsPageProps {
  onNavigate: (route: string) => void;
}

const AgentsPage: React.FC<AgentsPageProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToDiagram = () => {
    const el = document.getElementById('architecture-diagram');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const agents = [
    { name: 'Researcher', role: 'Competitive Intelligence', model: 'Gemini 3 Pro', icon: '🔍', desc: 'Deep web grounding and competitor analysis.' },
    { name: 'Planner', role: 'Strategic Roadmaps', model: 'Gemini 3 Pro', icon: '🗺️', desc: 'Converts insights into 4-week execution plans.' },
    { name: 'Analyst', role: 'ROI Forecasting', model: 'Gemini 3 Pro', icon: '📈', desc: 'Predictive budget and risk scoring using Python.' },
    { name: 'Creative', role: 'Visual Prototyping', model: 'Gemini 2.5 Flash', icon: '✨', desc: 'Generates high-fidelity mood boards and briefs.' }
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      <MarketingHeader onNavigate={onNavigate} scrolled={scrolled} />

      <div className="max-w-7xl mx-auto px-8 pt-48 pb-40">
        
        {/* HERO SECTION */}
        <header className="max-w-4xl mb-32 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center space-x-3 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
            <span className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px]">Autonomous Workforce</span>
          </div>
          <h1 className="font-serif text-6xl md:text-7xl leading-[1.1] text-white">
            Digital Employees for <br/><span className="italic text-gray-500">Cognitive Scale.</span>
          </h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl">
            A sovereign team of specialized agents working in concert to execute strategy, research, and production — 24/7, without burnout.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => onNavigate('Booking')}
              className="bg-white text-black px-8 py-4 rounded-full text-[12px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5"
            >
              Deploy Your Team
            </button>
            <button 
              onClick={scrollToDiagram}
              className="px-8 py-4 rounded-full border border-white/10 text-white text-[12px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              View Architecture
            </button>
          </div>
        </header>

        {/* AGENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-40">
          {agents.map((agent, i) => (
            <div 
              key={agent.name} 
              className="group relative p-10 bg-white/[0.03] border border-white/10 rounded-3xl hover:bg-white/[0.06] hover:border-emerald-500/30 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[10px] font-mono text-emerald-500">{agent.model}</span>
              </div>
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:border-emerald-500/50 transition-all duration-500 shadow-2xl">
                    {agent.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-serif mb-2 text-white group-hover:text-emerald-400 transition-colors">{agent.name}</h3>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">{agent.role}</p>
                  </div>
                  <p className="text-gray-400 font-light leading-relaxed">
                    {agent.desc}
                  </p>
                </div>
                <div 
                  onClick={() => onNavigate('Booking')}
                  className="pt-8 mt-8 border-t border-white/5 flex items-center text-[11px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors cursor-pointer"
                >
                  <span>Configure Agent</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORCHESTRATION DIAGRAM SECTION */}
        <div id="architecture-diagram" className="mt-40 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-24 items-center">
          <div className="lg:col-span-2 space-y-10">
             <div className="space-y-4">
               <span className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px]">The Architecture</span>
               <h2 className="font-serif text-4xl leading-tight text-white">Seamless Human-Agent Orchestration.</h2>
             </div>
             <p className="text-gray-400 leading-relaxed font-light text-lg">
               We don't just prompt models; we engineer flows. Our "Controller Gate" architecture ensures every AI output is verified by a human before it touches your production database.
             </p>
             
             <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mt-1">1</div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Input & Routing</h4>
                    <p className="text-gray-500 text-xs mt-1">Orchestrator analyzes intent and selects the right agent.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mt-1">2</div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Parallel Processing</h4>
                    <p className="text-gray-500 text-xs mt-1">Multiple agents (Research, Plan) work simultaneously.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mt-1">3</div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Controller Gate</h4>
                    <p className="text-gray-500 text-xs mt-1">Mandatory human approval for high-risk actions.</p>
                  </div>
                </div>
             </div>

             <button 
                onClick={() => onNavigate('Booking')}
                className="bg-emerald-500 text-black px-8 py-4 rounded-full text-[12px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20"
             >
               Hire Your AI Team
             </button>
          </div>
          
          <div className="lg:col-span-3">
             <div className="aspect-[16/9] w-full">
                <OrchestrationDiagram />
             </div>
             <p className="text-center text-[10px] text-gray-600 mt-6 font-mono uppercase tracking-widest">
               Fig 1.0 — Distributed Agent Logic Flow
             </p>
          </div>
        </div>
      </div>

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
};

export default AgentsPage;