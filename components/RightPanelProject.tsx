
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
    if (score < 30) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    if (score < 70) return 'text-amber-500 bg-amber-50 border-amber-100';
    return 'text-red-500 bg-red-50 border-red-100';
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      <header>
        <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Project Manager Agent</h3>
        <p className="text-[12px] text-gray-500 font-serif italic mb-6">Operational risk assessment and resource allocation.</p>
      </header>

      {analysis ? (
        <div className="space-y-8">
          {/* Risk Score */}
          <section className={`p-6 rounded-2xl border ${getScoreColor(analysis.riskScore)}`}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[11px] uppercase font-bold tracking-widest">Risk Score</h4>
              <span className="text-2xl font-serif font-bold">{analysis.riskScore}/100</span>
            </div>
            <p className="text-[13px] font-serif italic opacity-90 leading-relaxed">
              "{analysis.riskSummary}"
            </p>
          </section>

          {/* Bottlenecks */}
          <section>
            <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-3">Identified Bottlenecks</h4>
            <ul className="space-y-2">
              {analysis.bottlenecks.map((b, i) => (
                <li key={i} className="flex items-start space-x-3 p-3 bg-red-50/50 rounded-lg">
                  <span className="text-red-400 mt-0.5 text-[10px]">●</span>
                  <span className="text-[12px] text-gray-700">{b}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Resource Optimization */}
          <section>
            <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-3">Resource Suggestions</h4>
            <div className="space-y-3">
              {analysis.resourceOptimization?.map((opt, i) => (
                <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm group hover:border-emerald-200 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[12px] font-bold text-gray-900">{opt.collaboratorName}</span>
                    <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">{opt.currentRole}</span>
                  </div>
                  <p className="text-[12px] text-emerald-700 font-medium mb-2">→ {opt.suggestedMove}</p>
                  <p className="text-[11px] text-gray-400 italic mb-4">{opt.impact}</p>
                  <button 
                    onClick={() => onApplyOptimization(project.id, opt)}
                    className="w-full py-2 bg-gray-50 text-gray-600 text-[10px] uppercase font-bold tracking-widest rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    Apply Change
                  </button>
                </div>
              ))}
              {(!analysis.resourceOptimization || analysis.resourceOptimization.length === 0) && (
                <p className="text-[12px] text-gray-400 italic">No resource conflicts detected.</p>
              )}
            </div>
          </section>

          {/* Mitigation Steps */}
          <section>
            <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-3">Mitigation Plan</h4>
            <div className="space-y-2">
              {analysis.mitigationSteps.map((step, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-[9px] text-gray-400 font-bold">{i + 1}</div>
                  <span className="text-[12px] text-gray-600">{step}</span>
                </div>
              ))}
            </div>
          </section>

          <button 
            onClick={() => onAnalyzeProject(project)}
            disabled={isAnalyzing}
            className="w-full py-4 border border-gray-200 text-gray-400 rounded-xl text-[11px] uppercase font-bold tracking-widest hover:text-black hover:border-gray-300 transition-all"
          >
            {isAnalyzing ? 'Re-analyzing...' : 'Refresh Analysis'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-6 text-xl text-amber-500">⚠️</div>
          <p className="text-[13px] text-gray-400 font-serif italic mb-8">No risk assessment available.</p>
          <button 
            onClick={() => onAnalyzeProject(project)}
            disabled={isAnalyzing}
            className="w-full py-4 bg-black text-white rounded-xl text-[11px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center space-x-3"
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