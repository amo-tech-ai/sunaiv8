
import React from 'react';
import { ActiveAgent } from '../types';

interface AgentTeamViewProps {
  agents: {
    research: string;
    planning: string;
    automation: string;
  };
}

const AgentCard: React.FC<{ 
  role: string; 
  status: string; 
  icon: string; 
  description: string;
}> = ({ role, status, icon, description }) => {
  const isActive = status === 'Running';
  
  return (
    <div className={`relative p-5 rounded-2xl border transition-all duration-500 overflow-hidden group ${
      isActive 
        ? 'bg-white border-blue-100 shadow-lg shadow-blue-500/5' 
        : 'bg-white border-gray-100 hover:border-gray-200'
    }`}>
      {/* Active Pulse Background */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent animate-[shimmer_2s_infinite]" />
      )}

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors ${
          isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-400'
        }`}>
          {icon}
        </div>
        <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest flex items-center space-x-1 ${
          isActive ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'
        }`}>
          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
          <span>{status}</span>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-[13px] font-bold text-gray-900 mb-1">{role}</h3>
        <p className="text-[11px] text-gray-500 font-serif italic leading-relaxed">
          {isActive ? description : "Standing by for assignment."}
        </p>
      </div>

      {/* Terminal Line (Mock) */}
      {isActive && (
        <div className="mt-4 pt-3 border-t border-blue-50">
          <div className="flex items-center space-x-2 text-[9px] font-mono text-blue-400">
            <span>➜</span>
            <span className="truncate">Processing context stream...</span>
          </div>
        </div>
      )}
    </div>
  );
};

const AgentTeamView: React.FC<AgentTeamViewProps> = ({ agents }) => {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold">Active Workforce</h2>
        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold border border-emerald-100">
          Gemini 3 Pro Network
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AgentCard 
          role="Researcher Agent" 
          status={agents.research} 
          icon="🔍"
          description="Scanning competitor URLs and market trends."
        />
        <AgentCard 
          role="Planner Agent" 
          status={agents.planning} 
          icon="📐"
          description="Drafting milestones and dependency chains."
        />
        <AgentCard 
          role="Analyst Agent" 
          status={agents.automation} 
          icon="⚡"
          description="Calculating ROI and budget projections."
        />
      </div>
    </section>
  );
};

export default AgentTeamView;
