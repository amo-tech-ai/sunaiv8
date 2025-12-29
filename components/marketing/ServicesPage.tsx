
import React, { useState, useEffect } from 'react';
import MarketingHeader from './Header';
import MarketingFooter from './Footer';

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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-[#0a1628]">
      <MarketingHeader onNavigate={onNavigate} scrolled={scrolled} />

      {/* 1. HERO */}
      <section className="pt-48 pb-32 px-8 max-w-7xl mx-auto text-center">
        <div className="inline-block mb-6 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
           <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-600">Enterprise Grade</span>
        </div>
        <h1 className="font-serif text-6xl md:text-7xl leading-[1.1] mb-8 text-[#0a1628]">
          AI Systems Built for<br/> Production — <span className="text-gray-400 italic">Not Demos.</span>
        </h1>
        <p className="text-xl text-gray-500 font-light max-w-3xl mx-auto mb-12 leading-relaxed">
          We design and build full-stack AI platforms, agents, and automation systems that ship fast, scale reliably, and stay human-controlled.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => scrollToSection('core-services')}
            className="bg-[#0a1628] text-white px-8 py-4 rounded-full text-[13px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
          >
            Explore Services
          </button>
          <button 
            onClick={() => scrollToSection('industries')}
            className="bg-white border border-gray-200 text-[#0a1628] px-8 py-4 rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
          >
            See Industry Solutions
          </button>
        </div>
      </section>

      {/* 2. WHAT WE BUILD */}
      <section className="py-24 bg-[#FAFAFA] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16">
             <h2 className="font-serif text-4xl mb-4">What We Build</h2>
             <p className="text-gray-500 font-light">Comprehensive system components, not just features.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Web Applications", desc: "Full-stack platforms with clean architecture.", icon: "🖥️" },
              { title: "AI Features", desc: "Intelligent capabilities powered by Gemini 3 & Claude.", icon: "✨" },
              { title: "AI Agents", desc: "Multi-agent systems with orchestrators and analysts.", icon: "🤖" },
              { title: "Automations", desc: "Trigger-based workflow engines that run reliably.", icon: "⚙️" },
              { title: "Workflows", desc: "User input → Reasoning → Approvals → Actions.", icon: "🔄" },
              { title: "AI Logic", desc: "Custom decision-making and reasoning layers.", icon: "🧠" },
              { title: "Wizards", desc: "Multi-step guided forms for complex intake.", icon: "🪄" },
              { title: "Chatbots", desc: "Context-aware assistants across Web & WhatsApp.", icon: "💬" },
              { title: "Dashboards", desc: "Operational views for data and agent outputs.", icon: "📊" }
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start space-x-4">
                <span className="text-2xl bg-gray-50 p-2 rounded-lg">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-[15px] mb-1">{item.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR APPROACH */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div>
             <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-500 mb-4 block">Methodology</span>
             <h2 className="font-serif text-5xl mb-8 leading-tight">Systems Before AI.<br/>Humans in Control.</h2>
             <p className="text-lg text-gray-500 font-light leading-relaxed mb-8">
               We don't just "wrap" an API. We architect systems where AI proposes and humans approve. This "Controller Gate" pattern ensures your operations stay trustworthy even at scale.
             </p>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Systems First", desc: "Sitemap, screens, routing, and data ownership defined before models." },
                { title: "Human-in-the-Loop", desc: "AI proposes. Humans approve. Nothing breaks in silence." },
                { title: "Production-Ready", desc: "Designed to ship, scale, and be maintained by your team." },
                { title: "Multi-Industry", desc: "Proven logic across Real Estate, SaaS, and E-commerce." }
              ].map(card => (
                <div key={card.title} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                   <h4 className="font-bold text-[14px] mb-2">{card.title}</h4>
                   <p className="text-[12px] text-gray-500 leading-relaxed">{card.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 4. CORE SERVICES */}
      <section id="core-services" className="py-32 bg-[#050508] text-white">
        <div className="max-w-7xl mx-auto px-8">
           <header className="mb-20">
             <h2 className="font-serif text-5xl mb-6">Core Services</h2>
             <p className="text-gray-400 font-light max-w-2xl">
               Select a specialized track to accelerate your build. Each service acts as a complete product module.
             </p>
           </header>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { title: "AI Web Development", route: "/services/ai-web-dev", desc: "Full-stack React-based platforms with embedded AI logic and clean architecture." },
               { title: "AI Development", route: "/services/ai-development", desc: "Custom reasoning layers, model integration, and RAG systems." },
               { title: "AI Agents", route: "/services/ai-agents", desc: "Autonomous multi-agent systems with orchestrators and approval gates." },
               { title: "AI Chatbots", route: "/services/ai-chatbots", desc: "Omnichannel assistants for Web, WhatsApp, and SMS." },
               { title: "AI MVP", route: "/services/ai-mvp", desc: "8-week rapid launch system taking you from idea to production revenue." },
               { title: "Sales & Marketing AI", route: "/services/ai-sales-marketing", desc: "Lead scoring, CRM automation, and predictive campaign intelligence." }
             ].map((service) => (
               <div 
                 key={service.title} 
                 onClick={() => onNavigate('Booking')} 
                 className="group p-10 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col justify-between min-h-[320px]"
               >
                 <div>
                   <h3 className="font-serif text-3xl mb-4 group-hover:text-emerald-400 transition-colors">{service.title}</h3>
                   <p className="text-gray-400 font-light leading-relaxed">{service.desc}</p>
                 </div>
                 <div className="pt-8 border-t border-white/5 flex items-center text-[12px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                   <span>View Service</span>
                   <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* 5. INDUSTRY SOLUTIONS */}
      <section id="industries" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-500 mb-4 block">Vertical Intelligence</span>
            <h2 className="font-serif text-5xl text-[#0a1628]">Industry Solutions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['SaaS', 'E-Commerce', 'Healthcare', 'Real Estate', 'B2B', 'Automotive', 'Tourism', 'Fintech'].map(ind => (
              <button 
                key={ind}
                onClick={() => onNavigate('Booking')}
                className="py-6 px-4 bg-gray-50 border border-gray-100 rounded-xl text-[14px] font-medium text-gray-600 hover:bg-[#0a1628] hover:text-white hover:border-[#0a1628] transition-all"
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. AI AGENT SYSTEM */}
      <section className="py-24 bg-emerald-50 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div>
               <h2 className="font-serif text-4xl mb-6 text-[#0a1628]">The 10-Agent Architecture</h2>
               <p className="text-gray-600 font-light leading-relaxed mb-8">
                 We don't rely on a single prompt. We deploy a specialized workforce of 10 distinct agents, each with a specific role, toolset, and success metric.
               </p>
               <ul className="grid grid-cols-2 gap-y-4 text-[13px] font-medium text-gray-700">
                 <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"/>Orchestrator</li>
                 <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"/>Planner</li>
                 <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"/>Analyst</li>
                 <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"/>Ops Automation</li>
                 <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"/>Content/Comms</li>
                 <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"/>Retriever (RAG)</li>
                 <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"/>Extractor</li>
                 <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"/>Optimizer</li>
                 <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"/>Scorer</li>
                 <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"/>Controller (Gate)</li>
               </ul>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-500/10">
               <div className="flex flex-col space-y-4">
                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">USER INPUT</span>
                    <span className="text-xs text-gray-400">→</span>
                    <span className="text-xs font-bold text-[#0a1628]">ORCHESTRATOR</span>
                 </div>
                 <div className="flex justify-center py-2">
                    <div className="h-8 w-px bg-gray-200"/>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                       <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-1">Plan</span>
                       <span className="text-xs text-emerald-800">Planner Agent</span>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center">
                       <span className="text-[10px] uppercase font-bold text-blue-600 block mb-1">Research</span>
                       <span className="text-xs text-blue-800">Analyst Agent</span>
                    </div>
                 </div>
                 <div className="flex justify-center py-2">
                    <div className="h-8 w-px bg-gray-200"/>
                 </div>
                 <div className="p-4 bg-[#0a1628] rounded-xl text-center shadow-lg text-white">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Gate</span>
                    <span className="text-xs">Human Controller Approval</span>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* 7. TECH STACK (Compact) */}
      <section className="py-20 bg-white text-center">
        <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-6">Powered By Enterprise Infrastructure</p>
        <div className="flex flex-wrap justify-center gap-8 text-gray-500 font-medium text-lg">
           <span>Gemini 3</span>
           <span>Claude 3.5</span>
           <span>OpenAI</span>
           <span>Supabase</span>
           <span>Figma</span>
           <span>Cursor</span>
           <span>Next.js</span>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-40 bg-[#0a1628] text-center px-8">
        <h2 className="font-serif text-5xl md:text-6xl text-white mb-8">Ready to Build?</h2>
        <p className="text-xl text-gray-400 font-light mb-12 max-w-2xl mx-auto">
          Start with a scoped system, not a guess. Launch your AI platform in 8 weeks.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => onNavigate('Booking')}
            className="bg-emerald-500 text-[#0a1628] px-10 py-5 rounded-full text-[13px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
          >
            Start Your Project
          </button>
          <button 
            onClick={() => onNavigate('Work')}
            className="bg-transparent border border-white/20 text-white px-10 py-5 rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            View AI MVP Program
          </button>
        </div>
      </section>

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
};

export default ServicesPage;
