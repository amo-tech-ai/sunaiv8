
import React, { useState, useEffect, useRef } from 'react';

const GhostCursor: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  const getCursorPos = () => {
    switch(activeStep) {
      case 0: return 'top-[62%] left-[45%]'; // Selecting AI Product
      case 1: return 'top-[35%] left-[25%]'; // Hovering Approved Badge
      case 2: return 'top-[55%] left-[60%]'; // Hovering Architecture card
      default: return 'top-1/2 left-1/2 opacity-0';
    }
  };

  return (
    <div className={`absolute z-50 pointer-events-none transition-all duration-1000 ease-in-out ${getCursorPos()} ${activeStep > 2 ? 'opacity-0' : 'opacity-100'}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" className="drop-shadow-[0_4px_8px_rgba(16,185,129,0.6)] animate-bounce">
        <path d="M5 3l14 9-6 1-3 6-5-16z" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
      </svg>
    </div>
  );
};

const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const scrollProgress = -rect.top / (sectionHeight - window.innerHeight);
      const step = Math.min(3, Math.max(0, Math.floor(scrollProgress * 4)));
      setActiveStep(step);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      number: "1.",
      title: "Scope",
      description: "Start your project. Use AI or work with an expert to build a custom scope to share with our engineers."
    },
    {
      number: "2.",
      title: "Blueprint",
      description: "Get a detailed technical roadmap, timeline, and transparent pricing before any code is written."
    },
    {
      number: "3.",
      title: "Dashboard",
      description: "Track progress in real-time with a dedicated client portal. Review deliverables, approve milestones, and collaborate seamlessly."
    }
  ];

  return (
    <section ref={containerRef} className="relative min-h-[400vh] bg-white">
      <style>{`
        .browser-frame {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.06);
          transition: all 700ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .step-inactive { opacity: 0.2; transform: translateX(-10px); }
        .step-active { opacity: 1; transform: translateX(0); }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .shimmer { animation: shimmer 2s ease-in-out infinite; }
      `}</style>

      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-[12px] uppercase tracking-[0.2em] font-bold text-[#10B981]">HOW IT WORKS</span>
              <h2 className="font-serif text-[48px] md:text-[56px] leading-[1.1] text-[#0a1628] tracking-tight">The smarter way to build your startup</h2>
            </div>
            
            <div className="space-y-12 relative pl-8">
              <div className="absolute left-0 top-0 w-px h-full bg-gray-100">
                <div 
                  className="bg-[#10B981] w-full transition-all duration-700 ease-out" 
                  style={{ height: `${Math.min(100, ((activeStep + 1) / 3) * 100)}%` }}
                />
              </div>

              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div key={idx} className={`transition-all duration-500 ${isActive ? 'step-active' : 'step-inactive'}`}>
                    <div className="flex items-baseline space-x-3 mb-3">
                       <span className={`font-serif text-3xl italic ${isActive ? 'text-[#10B981]' : 'text-gray-300'}`}>{step.number}</span>
                       <h3 className="font-serif text-3xl text-[#0a1628]">{step.title}</h3>
                    </div>
                    {isActive && (
                      <p className="text-gray-500 font-light leading-relaxed max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {step.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative h-[600px] flex items-center justify-center">
            <div className="w-full max-w-[560px] browser-frame min-h-[440px] flex flex-col relative bg-white border border-gray-100">
              <GhostCursor activeStep={activeStep} />
              <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center space-x-2">
                <div className="flex space-x-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
              </div>
              <div className="flex-1 p-8 relative overflow-hidden bg-white">
                <div className={`absolute inset-0 p-8 flex flex-col items-center text-center transition-all duration-700 ${activeStep === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                   <h4 className="font-serif text-2xl text-[#0a1628] mb-2">Project Scope Wizard</h4>
                   <p className="text-[13px] text-gray-400 mb-8">Select your project type</p>
                   <div className="grid grid-cols-3 gap-3 mb-10 w-full max-w-sm">
                      {['MVP', 'AI Product', 'Auto', 'Mobile', 'Dash', 'CRM', 'Landing'].map(item => (
                        <span 
                          key={item} 
                          className={`px-3 py-3 rounded-xl text-[11px] font-semibold border transition-all ${item === 'AI Product' ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-lg shadow-emerald-500/10' : 'bg-gray-50 border-transparent text-gray-400'}`}
                        >
                          {item}
                        </span>
                      ))}
                   </div>
                   <button className="bg-[#0a1628] text-white px-10 py-3 rounded-xl text-[12px] font-bold uppercase tracking-widest shadow-xl">Continue →</button>
                   <div className="flex space-x-1.5 mt-8">
                      <div className="w-6 h-1.5 rounded-full bg-[#10B981]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-100" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-100" />
                   </div>
                </div>
                <div className={`absolute inset-0 p-10 flex flex-col items-start transition-all duration-700 ${activeStep === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                   <h4 className="font-serif text-2xl text-[#0a1628] mb-1">Project Blueprint</h4>
                   <p className="text-[12px] text-gray-400 mb-6">Technical Roadmap & Timeline</p>
                   <div className="bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-lg flex items-center mb-8">
                      <span className="text-emerald-600 mr-2 text-sm">✓</span>
                      <span className="text-emerald-700 text-[11px] font-bold uppercase tracking-wide">Budget Approved: $18k — 8 Weeks</span>
                   </div>
                   <div className="w-full space-y-4">
                      <div className="h-12 w-full bg-gray-50 rounded-xl border border-gray-100 flex items-center px-4 relative overflow-hidden">
                         <div className="shimmer h-full w-1/3 bg-emerald-500/5 absolute left-0 top-0" />
                         <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3" />
                         <div className="w-1/2 h-1.5 bg-gray-100 rounded-full" />
                      </div>
                      <div className="h-24 w-full bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
                         <div className="w-1/3 h-1.5 bg-gray-200 rounded-full" />
                         <div className="w-2/3 h-1.5 bg-gray-100 rounded-full" />
                         <div className="w-full h-8 flex items-end">
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500 w-1/2" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
                <div className={`absolute inset-0 flex transition-all duration-700 ${activeStep === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
                   <div className="w-16 border-r border-gray-100 bg-gray-50/50 flex flex-col items-center py-6 space-y-4">
                      <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center text-white text-[12px] shadow-lg shadow-emerald-500/20">🏠</div>
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-300 text-[12px]">📁</div>
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-300 text-[12px]">👥</div>
                   </div>
                   <div className="flex-1 p-8 space-y-6">
                      <div className="flex justify-between items-center mb-2">
                         <h4 className="font-serif text-xl text-[#0a1628]">Client Portal</h4>
                         <div className="w-8 h-8 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         {['Proposal', 'Architecture', 'Assets', 'Milestones'].map(item => (
                           <div key={item} className={`p-4 rounded-xl border transition-all ${item === 'Architecture' ? 'border-[#10B981] bg-emerald-50 shadow-sm' : 'bg-white border-gray-100'}`}>
                              <div className={`w-7 h-7 rounded-lg mb-3 flex items-center justify-center text-[10px] ${item === 'Architecture' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                                 {item === 'Assets' ? '🖼️' : '📄'}
                              </div>
                              <span className="text-[11px] font-bold text-[#0a1628]">{item}</span>
                           </div>
                         ))}
                      </div>
                      <div className="pt-4 border-t border-gray-50">
                         <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-2">
                            <span>Project Progress</span>
                            <span className="text-emerald-500">67%</span>
                         </div>
                         <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[67%]" />
                         </div>
                      </div>
                   </div>
                </div>
                <div className={`absolute inset-0 bg-[#0a1628] flex flex-col items-center justify-center p-12 text-center transition-all duration-700 ${activeStep > 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
                   <h4 className="font-serif text-3xl text-white mb-6 leading-tight">Ready to build your masterpiece?</h4>
                   <button className="bg-[#10B981] text-white px-10 py-4 rounded-xl text-[13px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/10">Start Your Project</button>
                   <p className="mt-8 text-gray-400 text-[12px] font-serif italic">"Quiet AI, high-fidelity execution."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
