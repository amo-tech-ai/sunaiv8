
import React from 'react';
import { FocusState } from '../types';

interface RightPanelResearchProps {
  focus: FocusState;
  isResearching: boolean;
  onDeepResearch: () => void;
  onOpenMarketReport: (leadId: string) => void;
}

const RightPanelResearch: React.FC<RightPanelResearchProps> = ({ 
  focus, isResearching, onDeepResearch, onOpenMarketReport 
}) => {
  if (focus.type !== 'contact') return null;

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      <header>
        <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Intelligence Agent</h3>
        <p className="text-[12px] text-gray-500 font-serif italic mb-6">Deep market research and competitor probing.</p>
      </header>

      {focus.data?.researchData ? (
        <div className="space-y-6">
          <section className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-sm">
            <h4 className="text-[11px] uppercase font-bold text-emerald-600 mb-2">Findings Summary</h4>
            <p className="text-[13px] text-gray-700 font-serif leading-relaxed italic">{focus.data.researchData.summary}</p>
          </section>
          
          {focus.data.researchData.agentReport && (
            <button 
              onClick={() => onOpenMarketReport(focus.data.id)}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[11px] uppercase font-bold tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center space-x-3 shadow-md"
            >
              <span>📊 View Market Intelligence Report</span>
            </button>
          )}

          <section>
            <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-3">Grounding Sources</h4>
            <div className="space-y-2">
              {focus.data.researchData.sources.map((src: any, i: number) => (
                <a 
                  key={i} 
                  href={src.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block p-3 bg-gray-50 rounded-lg text-[11px] hover:bg-emerald-50 transition-colors truncate"
                >
                  🔗 {src.title}
                </a>
              ))}
            </div>
          </section>

          <button 
            onClick={onDeepResearch} 
            disabled={isResearching}
            className="w-full py-4 border border-gray-200 text-gray-500 rounded-xl text-[11px] uppercase font-bold tracking-widest hover:bg-gray-50 transition-all"
          >
            {isResearching ? 'Refreshing Intelligence...' : 'Refresh Agent Run'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-2xl">🔍</div>
          <p className="text-[13px] text-gray-400 font-serif italic mb-8">No deep intelligence available for this lead.</p>
          <button 
            onClick={onDeepResearch}
            disabled={isResearching}
            className="w-full py-4 bg-black text-white rounded-xl text-[11px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center space-x-3"
          >
            {isResearching ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Researching...</span>
              </>
            ) : (
              <span>✨ Trigger Deep Research Agent</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default RightPanelResearch;
