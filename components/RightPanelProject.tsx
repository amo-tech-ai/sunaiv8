
import React from 'react';
import { FocusState, Project } from '../types';

interface RightPanelProjectProps {
  focus: FocusState;
  isAnalyzing: boolean;
  onAnalyzeProject: (project: Project) => void;
  onApplyOptimization: (projectId: string, optimization: any) => void;
}

const RightPanelProject: React.FC<RightPanelProjectProps> = ({ 
  focus, isAnalyzing, onAnalyzeProject, onApplyOptimization 
}) => {
  if (focus.type !== 'project' || !focus.data) return null;
  const project = focus.data as Project;
  const analysis = project.analysis;

  const getScoreColor = (score: number) => {
    if (score < 30) return '#10b981'; // Emerald
    if (score < 70) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score < 30) return 'Stable';
    if (score < 70) return 'Caution';
    return 'Critical';
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-8 pb-12">
      <header>
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
          <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Project Manager Agent</h3>
        </div>
        <p className="text-[12px] text-gray-500 font-serif italic">Operational risk assessment and resource allocation.</p>
      </header>

      {analysis ? (
        <div className="space-y-10">
          {/* Risk Score Radial */}
          <section className="flex items-center space-x-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="relative w-20 h-20 flex-shrink-0">
               {/* Conic Gradient Ring */}
               <div 
                 className="absolute inset-0 rounded-full"
                 style={{ 
                   background: `conic-gradient(${getScoreColor(analysis.riskScore)} ${analysis.riskScore}%, #e5e7eb 0)` 
                 }}
               />
               <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="text-xl font-serif font-bold text-gray-900">{analysis.riskScore}</span>
                  <span className="text-[8px] uppercase font-bold text-gray-400">Score</span>
               </div>
            </div>
            <div>
              <h4 className="text-[11px] uppercase font-bold tracking-widest text-gray-900 mb-1">
                Status: <span style={{ color: getScoreColor(analysis.riskScore) }}>{getScoreLabel(analysis.riskScore)}</span>
              </h4>
              <p className="text-[12px] text-gray-500 font-serif italic leading-relaxed line-clamp-3">
                "{analysis.riskSummary}"
              </p>
            </div>
          </section>

          {/* Bottlenecks */}
          <section>
            <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-4 border-b border-gray-100 pb-2">Identified Bottlenecks</h4>
            <ul className="space-y-3">
              {analysis.bottlenecks.map((b, i) => (
                <li key={i} className="flex items-start space-x-3 p-3 bg-white border border-red-100 rounded-lg shadow-sm">
                  <span className="text-red-400 mt-0.5 text-[14px]">!</span>
                  <span className="text-[12px] text-gray-700 leading-snug">{b}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Resource Optimization */}
          <section>
            <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-4 border-b border-gray-100 pb-2">Resource Suggestions</h4>
            <div className="space-y-4">
              {analysis.resourceOptimization?.map((opt, i) => (
                <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm group hover:border-emerald-200 transition-all relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[13px] font-bold text-gray-900 block">{opt.collaboratorName}</span>
                      <span className="text-[9px] text-gray-400 uppercase tracking-wider">{opt.currentRole}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold uppercase tracking-tighter">Optimization</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <p className="text-[11px] text-gray-600 font-medium mb-1">Recommendation:</p>
                    <p className="text-[12px] text-gray-800 italic font-serif">"{opt.suggestedMove}"</p>
                  </div>
                  <p className="text-[10px] text-gray-400 mb-4 pl-1 border-l-2 border-gray-200">Impact: {opt.impact}</p>
                  <button 
                    onClick={() => onApplyOptimization(project.id, opt)}
                    className="w-full py-2.5 bg-black text-white text-[10px] uppercase font-bold tracking-widest rounded-lg hover:bg-gray-800 transition-all shadow-sm active:scale-95"
                  >
                    Apply Change
                  </button>
                </div>
              ))}
              {(!analysis.resourceOptimization || analysis.resourceOptimization.length === 0) && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <span className="text-[12px] text-gray-400 italic">No resource conflicts detected.</span>
                </div>
              )}
            </div>
          </section>

          {/* Mitigation Steps */}
          <section>
            <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-4 border-b border-gray-100 pb-2">Mitigation Plan</h4>
            <div className="space-y-3">
              {analysis.mitigationSteps.map((step, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[10px] text-gray-500 font-bold shadow-sm">{i + 1}</div>
                  <span className="text-[12px] text-gray-600 pt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </section>

          <button 
            onClick={() => onAnalyzeProject(project)}
            disabled={isAnalyzing}
            className="w-full py-4 border border-gray-200 text-gray-400 rounded-xl text-[11px] uppercase font-bold tracking-widest hover:text-black hover:border-gray-300 transition-all bg-white"
          >
            {isAnalyzing ? 'Re-analyzing...' : 'Refresh Analysis'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-2xl border border-gray-100 shadow-sm text-gray-300">
            {isAnalyzing ? <div className="animate-spin text-xl">⏳</div> : '⚠️'}
          </div>
          <h4 className="text-[14px] font-medium text-gray-900 mb-2">Analysis Required</h4>
          <p className="text-[12px] text-gray-400 font-serif italic mb-8 max-w-[240px]">
            Run the Risk Agent to detect schedule slips, resource conflicts, and critical path blockers.
          </p>
          <button 
            onClick={() => onAnalyzeProject(project)}
            disabled={isAnalyzing}
            className="w-full py-4 bg-black text-white rounded-xl text-[11px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center space-x-3 active:scale-95"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Diagnostics...</span>
              </>
            ) : (
              <span>⚡ Analyze Project Risks</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default RightPanelProject;
