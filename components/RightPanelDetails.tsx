
import React from 'react';
import { FocusState, PipelineStage } from '../types';

interface RightPanelDetailsProps {
  focus: FocusState;
  onUpdateLeadStage: (leadId: string, nextStage: PipelineStage) => void;
}

const RightPanelDetails: React.FC<RightPanelDetailsProps> = ({ focus, onUpdateLeadStage }) => {
  if (!focus.data) return null;
  const isContact = focus.type === 'contact';

  return (
    <div className="animate-in fade-in duration-300">
      <header className="mb-10">
        <span className="text-[10px] uppercase font-bold text-gray-300 mb-1 block">Focused {focus.type}</span>
        <h2 className="text-[18px] font-serif font-medium text-gray-900 leading-tight">
          {isContact ? focus.data.company : (focus.data.title || focus.data.name)}
        </h2>
      </header>

      <div className="space-y-8">
        {isContact && (
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4">Pipeline Stage</h3>
            <div className="flex flex-wrap gap-2">
              {['Discovery', 'Proposal', 'Negotiation', 'Closed'].map((s) => (
                <button 
                  key={s}
                  onClick={() => onUpdateLeadStage(focus.data.id, s as PipelineStage)}
                  className={`text-[10px] px-3 py-1.5 rounded-full border transition-all font-bold ${
                    focus.data.pipelineStage === s 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4">Description</h3>
          <p className="text-[13px] text-gray-600 leading-relaxed font-serif italic">
            {focus.data.bio || focus.data.description || "No expanded context provided."}
          </p>
        </section>
      </div>
    </div>
  );
};

export default RightPanelDetails;
