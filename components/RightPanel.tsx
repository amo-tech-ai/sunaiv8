
import React, { useEffect, useState } from 'react';
import { FocusState, AIInsight, Contact, ActionItem, PipelineStage, EnrichmentSuggestion, ResearchResult, MarketReport, Project } from '../types';
import { getAIInsight, generateCreativeConcept, analyzeProjectHealth } from '../services/geminiService';
import ErrorBoundary from './ErrorBoundary';

import RightPanelDetails from './RightPanelDetails';
import RightPanelIntelligence from './RightPanelIntelligence';
import RightPanelResearch from './RightPanelResearch';
import RightPanelCreative from './RightPanelCreative';
import RightPanelProject from './RightPanelProject';

interface RightPanelProps {
  focus: FocusState;
  history: FocusState[];
  onFocusFromHistory: (focus: FocusState) => void;
  onAuditAction: (action: string, context: string) => void;
  onUpdateLeadStage: (leadId: string, nextStage: PipelineStage) => void;
  onApplyEnrichment: (leadId: string, fields: Partial<EnrichmentSuggestion>) => void;
  onTriggerEnrichment: (leadId: string) => void;
  onAddTask: (task: Partial<ActionItem>) => void;
  onApproveDraft: (leadId: string) => void;
  onVisualUpdate: (leadId: string, asset: string) => void;
  onResearchUpdate: (leadId: string, research: ResearchResult) => void;
  onMarketReportUpdate: (leadId: string, report: MarketReport) => void;
  onBudgetUpdate: (leadId: string) => void;
  onApprovePlan: (leadId: string) => void;
  onOpenMarketReport: (leadId: string) => void;
  onDeleteEntity: (id: string) => void;
  // New handlers for Project Agent
  onProjectAnalysisUpdate?: (projectId: string, analysis: any) => void;
  projects?: Project[]; // Need access to all projects for context
}

const RightPanel: React.FC<RightPanelProps> = ({ 
  focus, history, onUpdateLeadStage, onAuditAction, onAddTask, onVisualUpdate, onResearchUpdate, onMarketReportUpdate, onBudgetUpdate, onApprovePlan, onOpenMarketReport, onDeleteEntity,
  onProjectAnalysisUpdate, projects
}) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'details' | 'intelligence' | 'research' | 'creative' | 'project_risk'>('details');
  const [generatingVisual, setGeneratingVisual] = useState(false);
  const [analyzingProject, setAnalyzingProject] = useState(false);

  useEffect(() => {
    if (focus.type && focus.data) {
      if (focus.type === 'project') {
        setView('project_risk');
      } else if (focus.data.pendingDraft || focus.data.proposedPlan) {
        setView('intelligence');
      } else {
        setView('details');
      }
      
      if (focus.type !== 'project') {
        setLoading(true);
        getAIInsight(focus.type, focus.data).then(res => { 
          setInsight(res); 
          setLoading(false); 
        });
      }
    }
  }, [focus]);

  const handleVisualize = async () => {
    if (focus.type === 'contact' && focus.data) {
      setGeneratingVisual(true);
      const asset = await generateCreativeConcept(focus.data);
      if (asset) {
        onVisualUpdate(focus.data.id, asset);
        onAuditAction(`Creative Visual Generated`, focus.data.company);
      }
      setGeneratingVisual(false);
    }
  };

  const handleDeepResearch = async () => {
    if (focus.type === 'contact' && focus.data) {
      onResearchUpdate(focus.data.id, null as any); 
    }
  };

  const handleProjectAnalysis = async (project: Project) => {
    if (!projects || !onProjectAnalysisUpdate) return;
    setAnalyzingProject(true);
    const analysis = await analyzeProjectHealth(project, projects);
    if (analysis) {
      onProjectAnalysisUpdate(project.id, analysis);
      onAuditAction('Project Risk Analysis', project.name);
    }
    setAnalyzingProject(false);
  };

  const handleApplyOptimization = (projectId: string, optimization: any) => {
    onAuditAction('Resource Reallocation', `${optimization.collaboratorName}: ${optimization.suggestedMove}`);
    // Ideally this would trigger a state update in App.tsx to move the collaborator
  };

  const handleAddTaskFromAI = (title: string) => {
    if (focus.data) {
      onAddTask({
        title,
        project: focus.data.company || focus.data.name || 'AI Proposal',
        priority: 'Medium',
        status: 'Backlog',
        linkedEntityId: focus.data.id,
        linkedEntityType: focus.type === 'contact' ? 'contact' : 'project'
      });
      onAuditAction('Task Authorized from AI Suggestion', focus.data.company || focus.data.name);
    }
  };

  if (focus.type === null && history.length === 0) {
    return (
      <aside className="w-80 border-l border-gray-200 h-screen bg-white flex items-center justify-center p-8 text-center">
        <div className="max-w-[160px]">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 border border-gray-100 text-gray-300">✧</div>
          <p className="text-[12px] text-gray-300 font-serif italic">Select an asset to activate intelligence.</p>
        </div>
      </aside>
    );
  }

  const isContact = focus.type === 'contact';
  const isProject = focus.type === 'project';

  return (
    <aside className="w-80 border-l border-gray-200 h-screen bg-white flex flex-col overflow-hidden shadow-[-1px_0_0_0_rgba(0,0,0,0.05)]">
      <nav className="flex border-b border-gray-100 bg-white sticky top-0 z-10 overflow-x-auto no-scrollbar">
        {!isProject && <button onClick={() => setView('details')} className={`flex-1 py-4 text-[9px] uppercase tracking-widest font-bold transition-all min-w-[80px] ${view === 'details' ? 'text-black border-b border-black' : 'text-gray-300'}`}>Details</button>}
        {!isProject && <button onClick={() => setView('intelligence')} className={`flex-1 py-4 text-[9px] uppercase tracking-widest font-bold transition-all min-w-[80px] ${view === 'intelligence' ? 'text-black border-b border-black' : 'text-gray-300'}`}>Intelligence</button>}
        {isProject && <button onClick={() => setView('project_risk')} className={`flex-1 py-4 text-[9px] uppercase tracking-widest font-bold transition-all min-w-[80px] ${view === 'project_risk' ? 'text-black border-b border-black' : 'text-gray-300'}`}>Risk Agent</button>}
        {isContact && (
          <>
            <button onClick={() => setView('research')} className={`flex-1 py-4 text-[9px] uppercase tracking-widest font-bold transition-all min-w-[80px] ${view === 'research' ? 'text-black border-b border-black' : 'text-gray-300'}`}>Research</button>
            <button onClick={() => setView('creative')} className={`flex-1 py-4 text-[9px] uppercase tracking-widest font-bold transition-all min-w-[80px] ${view === 'creative' ? 'text-black border-b border-black' : 'text-gray-300'}`}>Creative</button>
          </>
        )}
      </nav>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {view === 'details' && !isProject && (
          <ErrorBoundary name="Asset Details Tab">
            <RightPanelDetails 
              focus={focus} 
              onUpdateLeadStage={onUpdateLeadStage} 
              onDelete={onDeleteEntity}
            />
          </ErrorBoundary>
        )}

        {view === 'intelligence' && !isProject && (
          <ErrorBoundary name="Intelligence Analysis Tab">
            <RightPanelIntelligence 
              focus={focus}
              insight={insight}
              loading={loading}
              onBudgetUpdate={onBudgetUpdate}
              onApprovePlan={() => onApprovePlan(focus.data.id)}
              onAddTaskFromAI={handleAddTaskFromAI}
            />
          </ErrorBoundary>
        )}

        {view === 'project_risk' && isProject && (
          <ErrorBoundary name="Project Risk Tab">
            <RightPanelProject 
              focus={focus}
              isAnalyzing={analyzingProject}
              onAnalyzeProject={handleProjectAnalysis}
              onApplyOptimization={handleApplyOptimization}
            />
          </ErrorBoundary>
        )}

        {view === 'research' && isContact && (
          <ErrorBoundary name="Grounding & Research Tab">
            <RightPanelResearch 
              focus={focus}
              isResearching={focus.data?.isResearching}
              onDeepResearch={handleDeepResearch}
              onOpenMarketReport={onOpenMarketReport}
            />
          </ErrorBoundary>
        )}

        {view === 'creative' && isContact && (
          <ErrorBoundary name="Creative Concept Tab">
            <RightPanelCreative 
              focus={focus}
              generatingVisual={generatingVisual}
              onVisualize={handleVisualize}
            />
          </ErrorBoundary>
        )}
      </div>
    </aside>
  );
};

export default RightPanel;
