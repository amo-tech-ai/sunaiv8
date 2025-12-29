
import React from 'react';
import { WizardBlueprint } from '../../hooks/useWizard';

interface WizardLiveBlueprintProps {
  blueprint: WizardBlueprint;
}

const WizardLiveBlueprint: React.FC<WizardLiveBlueprintProps> = ({ blueprint }) => {
  // Safe accessors with default fallbacks
  const budget = blueprint.constraints?.budgetRange?.[1] || 0;
  const hasBudget = budget > 0;
  const techStack = blueprint.constraints?.techStackPref || [];
  const hasTech = techStack.length > 0;
  const appType = blueprint.scope?.appType;
  const industry = blueprint.scope?.industry;
  const hasScope = !!(appType || industry);
  const integrations = blueprint.scope?.integrations || [];
  const hasIntegrations = integrations.length > 0 && integrations[0] !== "";

  return (
    <aside className="w-80 border-l border-gray-200 bg-white flex flex-col h-full">
      <header className="h-16 border-b border-gray-100 flex items-center px-6 bg-gray-50/50 shrink-0">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Live Blueprint</span>
          <span className="ml-auto text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold border border-emerald-100">Drafting...</span>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 custom-scrollbar">
          <div className="space-y-4">
              
              {/* 1. Identity Card */}
              <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm transition-all duration-300">
                  <span className="text-[9px] uppercase tracking-widest text-gray-300 font-bold mb-3 block">Project Identity</span>
                  
                  <div className="mb-4">
                    <h3 className="font-serif text-lg text-gray-900 leading-tight">
                      {blueprint.basics.projectName || <span className="text-gray-300 italic">Untitled Project</span>}
                    </h3>
                    <p className="text-[12px] text-gray-500 mt-1">
                      for <span className="font-medium text-gray-900">{blueprint.basics.companyName || "..."}</span>
                    </p>
                  </div>

                  {blueprint.basics.website && (
                    <div className="flex items-center space-x-2 text-[11px] text-blue-500 bg-blue-50 p-2 rounded-lg truncate overflow-hidden">
                      <span className="shrink-0">🔗</span>
                      <span className="truncate">{blueprint.basics.website}</span>
                    </div>
                  )}
              </div>

              {/* 2. Scope DNA */}
              {hasScope && (
                <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <span className="text-[9px] uppercase tracking-widest text-gray-300 font-bold mb-3 block">System DNA</span>
                    <div className="space-y-3">
                      {appType && (
                        <div className="flex justify-between items-center text-[12px]">
                          <span className="text-gray-500">Topology</span>
                          <span className="font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700">{appType}</span>
                        </div>
                      )}
                      {industry && (
                        <div className="flex justify-between items-center text-[12px]">
                          <span className="text-gray-500">Sector</span>
                          <span className="font-bold text-gray-900 text-right">{industry}</span>
                        </div>
                      )}
                    </div>
                </div>
              )}

              {/* 3. Goals Snapshot */}
              {blueprint.scope.goals && (
                <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <span className="text-[9px] uppercase tracking-widest text-gray-300 font-bold mb-2 block">Primary Objective</span>
                    <p className="text-[12px] text-gray-600 font-serif italic leading-relaxed line-clamp-4">
                      "{blueprint.scope.goals}"
                    </p>
                </div>
              )}

              {/* 4. Constraints Snapshot */}
              {(hasBudget || hasTech) && (
                <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <span className="text-[9px] uppercase tracking-widest text-gray-300 font-bold mb-3 block">Feasibility</span>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-[12px]">
                          <span className="text-gray-500">Max Budget</span>
                          <span className="font-bold text-gray-900">${budget.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center text-[12px]">
                          <span className="text-gray-500">Velocity</span>
                          <span className={`font-bold px-2 py-0.5 rounded ${
                            blueprint.constraints.timelineUrgency === 'Critical' ? 'bg-red-50 text-red-600' :
                            blueprint.constraints.timelineUrgency === 'High' ? 'bg-amber-50 text-amber-600' :
                            'bg-blue-50 text-blue-600'
                          }`}>{blueprint.constraints.timelineUrgency}</span>
                       </div>
                       {hasTech && (
                         <div className="pt-2 flex flex-wrap gap-1.5">
                           {techStack.map(t => (
                             <span key={t} className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{t}</span>
                           ))}
                         </div>
                       )}
                    </div>
                </div>
              )}

              {/* Integrations Tags */}
              {hasIntegrations && (
                 <div className="flex flex-wrap gap-2">
                    {integrations.map((int, i) => (
                      <span key={i} className="text-[10px] font-bold bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-500">
                        {int}
                      </span>
                    ))}
                 </div>
              )}

              {/* Debug JSON (Hidden opacity but accessible for dev) */}
              <div className="pt-8 opacity-10 hover:opacity-100 transition-opacity">
                  <div className="text-[9px] font-mono text-gray-400 mb-1">RAW STATE</div>
                  <pre className="text-[8px] text-gray-500 font-mono whitespace-pre-wrap break-all leading-relaxed bg-gray-100 p-2 rounded">
                      {JSON.stringify(blueprint, null, 2)}
                  </pre>
              </div>
          </div>
      </div>
    </aside>
  );
};

export default WizardLiveBlueprint;
