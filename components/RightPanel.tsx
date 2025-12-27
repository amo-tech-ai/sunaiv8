
import React, { useEffect, useState } from 'react';
import { FocusState, AIInsight, Contact, ActionItem, PipelineStage, EnrichmentSuggestion, ResearchResult, MarketReport } from '../types';
import { getAIInsight, generateCreativeConcept } from '../services/geminiService';

import RightPanelDetails from './RightPanelDetails';
import RightPanelIntelligence from './RightPanelIntelligence';
import RightPanelResearch from './RightPanelResearch';
import RightPanelCreative from './RightPanelCreative';

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
}

const RightPanel: React.FC<RightPanelProps> = ({ 
  focus, history, onUpdateLeadStage, onAuditAction, onAddTask, onVisualUpdate, onResearchUpdate, onMarketReportUpdate, onBudgetUpdate, onApprovePlan, onOpenMarketReport, onDeleteEntity
}) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'details' | 'intelligence' | 'research' | 'creative'>('details');
  const [generatingVisual, setGeneratingVisual] = useState(false);

  useEffect(() => {
    if (focus.type && focus.data) {
      if (focus.data.pendingDraft || focus.data.proposedPlan) setView('intelligence');
      else setView('details');
      
      setLoading(true);
      getAIInsight(focus.type, focus.data).then(res => { 
        setInsight(res); 
        setLoading(false); 
      });
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

  const handleAddTaskFromAI = (title: string) => {
    if (focus.data) {
      onAddTask({
        title,
        project: focus.data.company || 'AI Proposal',
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

  return (
    <aside className="w-80 border-l border-gray-200 h-screen bg-white flex flex-col overflow-hidden">
      <nav className="flex border-b border-gray-100">
        <button onClick={() => setView('details')} className={`flex-1 py-4 text-[9px] uppercase tracking-widest font-bold transition-all ${view === 'details' ? 'text-black border-b border-black' : 'text-gray-300'}`}>Details</button>
        <button onClick={() => setView('intelligence')} className={`flex-1 py-4 text-[9px] uppercase tracking-widest font-bold transition-all ${view === 'intelligence' ? 'text-black border-b border-black' : 'text-gray-300'}`}>Intelligence</button>
        {isContact && (
          <>
            <button onClick={() => setView('research')} className={`flex-1 py-4 text-[9px] uppercase tracking-widest font-bold transition-all ${view === 'research' ? 'text-black border-b border-black' : 'text-gray-300'}`}>Research</button>
            <button onClick={() => setView('creative')} className={`flex-1 py-4 text-[9px] uppercase tracking-widest font-bold transition-all ${view === 'creative' ? 'text-black border-b border-black' : 'text-gray-300'}`}>Creative</button>
          </>
        )}
      </nav>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {view === 'details' && (
          <RightPanelDetails 
            focus={focus} 
            onUpdateLeadStage={onUpdateLeadStage} 
            onDelete={onDeleteEntity}
          />
        )}

        {view === 'intelligence' && (
          <RightPanelIntelligence 
            focus={focus}
            insight={insight}
            loading={loading}
            onBudgetUpdate={onBudgetUpdate}
            onApprovePlan={() => onApprovePlan(focus.data.id)}
            onAddTaskFromAI={handleAddTaskFromAI}
          />
        )}

        {view === 'research' && isContact && (
          <RightPanelResearch 
            focus={focus}
            isResearching={focus.data?.isResearching}
            onDeepResearch={handleDeepResearch}
            onOpenMarketReport={onOpenMarketReport}
          />
        )}

        {view === 'creative' && isContact && (
          <RightPanelCreative 
            focus={focus}
            generatingVisual={generatingVisual}
            onVisualize={handleVisualize}
          />
        )}
      </div>
    </aside>
  );
};

export default RightPanel;
