
import React, { useState, useEffect } from 'react';
import MarketingHeader from './Header';
import MarketingFooter from './Footer';

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

  const agents = [
    { name: 'Researcher Agent', role: 'Competitive Intelligence & Grounding', model: 'Gemini 3 Pro', icon: '🔍' },
    { name: 'Planner Agent', role: 'Strategic Roadmap Generation', model: 'Gemini 3 Pro', icon: '🗺️' },
    { name: 'Analyst Agent', role: 'ROI Forecasting & Data Audit', model: 'Gemini 3 Pro', icon: '📈' },
    { name: 'Creative Agent', role: 'Moodboarding & Prototyping', model: 'Gemini 2.5 Flash', icon: '✨' }
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans flex flex-col">
      <MarketingHeader onNavigate={onNavigate} scrolled={scrolled} />

      <div className="max-w-7xl mx-auto px-8 pt-48 pb-40">
        <header className="max-w-3xl mb-32 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-[11px]">Autonomous Workforce</span>
          <h1 className="font-serif text-6xl leading-tight text-white">Digital Employees for <span className="italic">Cognitive Scale.</span></h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            Meet our specialized agency agents. They work behind the scenes to research, plan, and analyze your projects with superhuman precision.
          </p>
        </header>

        <div className="space-y-6">
          {agents.map((agent, i) => (
            <div 
              key={agent.name} 
              className="flex items-center justify-between p-10 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-500 group"
            >
              <div className="flex items-center space-x-12 text-white">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500">
                  {agent.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-serif mb-2">{agent.name}</h3>
                  <p className="text-[14px] text-gray-500 font-bold uppercase tracking-widest">{agent.role}</p>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-1">Engine</span>
                <span className="text-[14px] font-mono text-emerald-400">{agent.model}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
             <h2 className="font-serif text-4xl leading-tight text-white">Seamless Human-Agent Orchestration.</h2>
             <p className="text-gray-400 leading-relaxed font-light">
               Our platform acts as the bridge. Agents propose strategy, humans authorize execution. This "Controller Gate" architecture ensures 100% agency quality with 10x the efficiency.
             </p>
             <button 
                onClick={() => onNavigate('Booking')}
                className="bg-white text-black px-10 py-5 rounded-full text-[13px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5"
             >
               Hire Your AI Team
             </button>
          </div>
          <div className="aspect-video bg-emerald-500/10 rounded-[3rem] border border-emerald-500/20 flex items-center justify-center p-12">
             <div className="w-full h-full border border-emerald-500/10 rounded-2xl relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent animate-pulse" />
                <span className="text-8xl animate-bounce">✧</span>
             </div>
          </div>
        </div>
      </div>

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
};

export default AgentsPage;
