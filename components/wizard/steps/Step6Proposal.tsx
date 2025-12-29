
import React, { useState } from 'react';
import { WizardBlueprint } from '../../../hooks/useWizard';

interface Step6ProposalProps {
  blueprint: WizardBlueprint;
  onLaunch: () => void;
  onRefine: (feedback: string) => void;
}

const Step6Proposal: React.FC<Step6ProposalProps> = ({ blueprint, onLaunch, onRefine }) => {
  const [refinementText, setRefinementText] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const roadmap = blueprint.artifacts?.roadmap;
  const budget = blueprint.artifacts?.budget;

  // Calculate mock confidence based on artifacts
  const confidenceScore = (roadmap ? 50 : 0) + (budget ? 40 : 0) + 4; 

  const handleRefineSubmit = () => {
    setIsRefining(true);
    // Simulate refinement delay
    setTimeout(() => {
        onRefine(refinementText);
        setRefinementText('');
        setIsRefining(false);
    }, 1500);
  };

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 print:p-0 print:max-w-none">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #proposal-container, #proposal-container * { visibility: visible; }
          #proposal-container { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div id="proposal-container">
        <div className="mb-10 text-center print:text-left print:mb-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4 no-print">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-700">Blueprint Generated</span>
          </div>
          <h2 className="font-serif text-3xl text-gray-900 mb-2">Proposal: {blueprint.basics.projectName}</h2>
          <p className="text-gray-500 text-[14px] no-print">Review the AI-architected proposal before committing to production.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Executive Summary & Budget */}
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm print:border-black print:shadow-none">
                <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-4">Executive Summary</h3>
                <div className="space-y-4">
                   <div>
                      <span className="block text-[10px] text-gray-400 uppercase font-bold">Objective</span>
                      <p className="text-[13px] text-gray-700 font-serif italic leading-relaxed">
                          "{blueprint.scope.goals}"
                      </p>
                   </div>
                   <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                      <div>
                          <span className="block text-[10px] text-gray-400 uppercase font-bold">Est. Duration</span>
                          <span className="text-[14px] font-bold text-gray-900">{roadmap?.wbs?.reduce((acc: number, p: any) => acc + (parseInt(p.duration) || 0), 0) || '8'} Weeks</span>
                      </div>
                      <div>
                          <span className="block text-[10px] text-gray-400 uppercase font-bold">Confidence</span>
                          <span className="text-[14px] font-bold text-emerald-600">{confidenceScore}%</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-[#0a0a0f] p-6 rounded-2xl border border-gray-800 shadow-xl text-white print:bg-white print:text-black print:border-black">
                <h3 className="text-[11px] uppercase tracking-widest font-bold text-emerald-500 mb-6 print:text-black">Investment Required</h3>
                <div className="flex items-baseline space-x-1 mb-6">
                   <span className="text-3xl font-serif">${budget?.totalEstimatedCost?.toLocaleString() || '0'}</span>
                   <span className="text-gray-500 text-sm">USD</span>
                </div>
                
                {budget?.breakdown && (
                    <div className="space-y-3 mb-6">
                      {budget.breakdown.slice(0, 3).map((item: any, i: number) => (
                          <div key={i} className="flex justify-between text-[12px] border-b border-white/10 pb-2 print:border-gray-200">
                              <span className="text-gray-400 print:text-gray-600">{item.item}</span>
                              <span className="font-mono text-gray-300 print:text-black">${item.cost.toLocaleString()}</span>
                          </div>
                      ))}
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/10 print:border-gray-200">
                   <span className="text-[10px] uppercase font-bold text-gray-500">Proj. ROI (12m)</span>
                   <span className="text-emerald-400 font-bold font-mono print:text-black">+{budget?.roiProjection || 0}%</span>
                </div>
             </div>
          </div>

          {/* Right Column: Roadmap */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col print:border-black print:shadow-none">
             <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-6">Execution Roadmap</h3>
             
             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                {roadmap?.wbs ? (
                    roadmap.wbs.map((phase: any, i: number) => (
                        <div key={i} className="relative pl-6 border-l-2 border-gray-100 pb-6 last:pb-0 last:border-0 print:border-black">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-emerald-500 print:border-black" />
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-[14px] font-bold text-gray-900">{phase.name}</h4>
                                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded print:border print:border-gray-300">{phase.duration}</span>
                            </div>
                            <div className="space-y-2">
                                {phase.tasks.map((task: any, j: number) => (
                                    <div key={j} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-colors group print:bg-white print:border-gray-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-black transition-colors print:bg-black" />
                                            <span className="text-[12px] text-gray-600 font-medium">{task.title}</span>
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase ${
                                            task.effort === 'High' ? 'text-red-400 print:text-black' : 'text-gray-400'
                                        }`}>{task.effort}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-400 italic">No roadmap generated.</div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-lg flex items-center justify-between sticky bottom-6 no-print">
         <div className="flex-1 flex items-center space-x-4">
            <input 
                type="text" 
                placeholder="Ask to refine (e.g. 'Make it 6 weeks')..."
                value={refinementText}
                onChange={(e) => setRefinementText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRefineSubmit()}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-black transition-all"
            />
            <button 
                onClick={handleRefineSubmit}
                disabled={!refinementText || isRefining}
                className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black disabled:opacity-30"
            >
                {isRefining ? 'Refining...' : 'Refine'}
            </button>
         </div>
         
         <div className="w-px h-8 bg-gray-200 mx-4" />
         
         <div className="flex items-center space-x-3">
            <button 
                onClick={handleExport}
                className="px-6 py-4 rounded-xl text-[12px] font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
            >
                Export PDF
            </button>
            <button 
                onClick={onLaunch}
                className="bg-black text-white px-8 py-4 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95 flex items-center space-x-3 group"
            >
                <span>Approve & Launch</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default Step6Proposal;
