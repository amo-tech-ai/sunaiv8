
import React from 'react';
import { FocusState } from '../types';

interface RightPanelCreativeProps {
  focus: FocusState;
  generatingVisual: boolean;
  onVisualize: () => void;
}

const RightPanelCreative: React.FC<RightPanelCreativeProps> = ({ 
  focus, generatingVisual, onVisualize 
}) => {
  if (focus.type !== 'contact') return null;

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      <header>
        <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Creative Agent</h3>
        <p className="text-[12px] text-gray-500 font-serif italic mb-6">Generating luxury mood boards and prototypes.</p>
      </header>

      <div className="space-y-6">
        {focus.data?.pendingDraft?.visualAssets?.map((asset: string, i: number) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg group relative cursor-zoom-in">
            <img src={asset} alt="Visual Concept" className="w-full h-auto object-cover transition-transform group-hover:scale-105 duration-700" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        ))}

        <button 
          onClick={onVisualize}
          disabled={generatingVisual}
          className="w-full py-4 bg-black text-white rounded-xl text-[11px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg"
        >
          {generatingVisual ? (
            <>
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Rendering...</span>
            </>
          ) : (
            <>
              <span>✨ Visualize Luxury Concept</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RightPanelCreative;
