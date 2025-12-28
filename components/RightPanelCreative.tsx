import React, { useState, useEffect } from 'react';
import { FocusState } from '../types';
import { generateVideoBrief } from '../services/ai/videoAgent';
import { GoogleGenAI } from "@google/genai";

interface RightPanelCreativeProps {
  focus: FocusState;
  generatingVisual: boolean;
  onVisualize: () => void;
  onVideoGenerated?: (videoUrl: string) => void;
}

const RightPanelCreative: React.FC<RightPanelCreativeProps> = ({ 
  focus, generatingVisual, onVisualize, onVideoGenerated 
}) => {
  const [hasPaidKey, setHasPaidKey] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoStatus, setVideoStatus] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasPaidKey(has);
      }
    };
    checkKey();
  }, []);

  if (focus.type !== 'contact') return null;

  const handleGenerateVideo = async () => {
    if (!hasPaidKey && (window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setHasPaidKey(true);
    }
    
    setGeneratingVideo(true);
    const url = await generateVideoBrief(
      `Luxury branding for ${focus.data.company}. Focus on ${focus.data.category} minimalism.`,
      setVideoStatus
    );
    
    if (url) {
      setVideoUrl(url);
      if (onVideoGenerated) onVideoGenerated(url);
    }
    setGeneratingVideo(false);
  };

  const handleProImage = async () => {
    if (!hasPaidKey && (window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setHasPaidKey(true);
    }
    // High-res pro image logic
    onVisualize();
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-10">
      <header>
        <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Creative Suite</h3>
        <p className="text-[12px] text-gray-500 font-serif italic mb-6">Pro-tier cinematic assets and luxury prototypes.</p>
      </header>

      <div className="space-y-8">
        {/* Video Gallery */}
        {videoUrl && (
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-xl bg-black aspect-video relative group">
            <video src={videoUrl} controls className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <span className="text-[8px] uppercase font-bold text-white bg-black/40 px-2 py-1 rounded backdrop-blur-md">Veo Generation</span>
            </div>
          </div>
        )}

        {/* Image Gallery */}
        <div className="grid grid-cols-1 gap-4">
          {focus.data?.pendingDraft?.visualAssets?.map((asset: string, i: number) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg group relative cursor-zoom-in">
              <img src={asset} alt="Visual Concept" className="w-full h-auto object-cover transition-transform group-hover:scale-105 duration-700" />
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-[8px] uppercase font-bold text-white bg-black/60 px-2 py-1 rounded backdrop-blur-md">Artifact #{i+1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <button 
            onClick={handleGenerateVideo}
            disabled={generatingVideo}
            className="w-full py-4 bg-black text-white rounded-xl text-[11px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 flex flex-col items-center justify-center shadow-lg group"
          >
            {generatingVideo ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2" />
                <span className="text-[9px] animate-pulse">{videoStatus}</span>
              </>
            ) : (
              <>
                <span className="group-hover:scale-110 transition-transform mb-1">🎬</span>
                <span>Craft Cinematic Veo Film</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-3">
             <button 
               onClick={handleProImage}
               disabled={generatingVisual}
               className="py-3 bg-white border border-gray-200 text-gray-900 rounded-xl text-[10px] uppercase font-bold tracking-widest hover:border-black transition-all flex items-center justify-center space-x-2"
             >
               <span>✨ Pro 4K Image</span>
             </button>
             <button 
               onClick={onVisualize}
               disabled={generatingVisual}
               className="py-3 bg-gray-50 text-gray-400 rounded-xl text-[10px] uppercase font-bold tracking-widest hover:text-black transition-all flex items-center justify-center space-x-2"
             >
               <span>Draft Flash Concept</span>
             </button>
          </div>
        </div>

        {!hasPaidKey && (
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <p className="text-[11px] text-blue-600 font-serif italic text-center">
              Note: Veo and Pro models require a paid API project.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanelCreative;
