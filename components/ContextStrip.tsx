
import React from 'react';
import { FocusState } from '../types';

interface ContextStripProps {
  focus: FocusState;
}

const ContextStrip: React.FC<ContextStripProps> = ({ focus }) => {
  if (focus.type === null || !focus.data) return null;

  const title = focus.type === 'task' ? focus.data.project : focus.data.company;
  const secondary = focus.type === 'task' ? (focus.data.phase || 'General') : `Status: ${focus.data.status}`;
  const tertiary = focus.type === 'task' ? focus.data.timeline : `Last Contact: ${focus.data.lastContact}`;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white border border-gray-200 px-6 py-3 rounded-full shadow-lg flex items-center space-x-6 z-50 animate-in fade-in slide-in-from-bottom-4 backdrop-blur-sm bg-white/90">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${focus.type === 'task' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
        <span className="text-[13px] font-medium text-gray-800">
          {title}
        </span>
      </div>
      <div className="h-4 w-[1px] bg-gray-200" />
      <span className="text-[12px] text-gray-500">
        {secondary}
      </span>
      <div className="h-1 w-1 rounded-full bg-gray-200" />
      <span className="text-[12px] text-gray-400 font-serif italic">
        {tertiary}
      </span>
    </div>
  );
};

export default ContextStrip;
