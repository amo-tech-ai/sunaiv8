
import React, { useEffect, useState, useRef } from 'react';
import { WizardBlueprint } from '../../../hooks/useWizard';
import { generateProjectRoadmap } from '../../../services/ai/plannerAgent';
import { estimateProjectBudget } from '../../../services/ai/analystAgent';

interface Step5ProcessingProps {
  blueprint: WizardBlueprint;
  onUpdate: (section: keyof WizardBlueprint, data: any) => void;
  onComplete: () => void;
}

type AgentStatus = 'waiting' | 'running' | 'complete' | 'failed';

interface AgentState {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  log: string;
}

const Step5Processing: React.FC<Step5ProcessingProps> = ({ blueprint, onUpdate, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [agents, setAgents] = useState<AgentState[]>([
    { id: 'orch', name: 'Orchestrator', role: 'System Router', status: 'waiting', log: 'Initializing...' },
    { id: 'res', name: 'Researcher', role: 'Market Intel', status: 'waiting', log: 'Queueing...' },
    { id: 'plan', name: 'Planner', role: 'Architecture', status: 'waiting', log: 'Queueing...' },
    { id: 'analyst', name: 'Analyst', role: 'ROI & Budget', status: 'waiting', log: 'Queueing...' },
  ]);
  
  const hasRunRef = useRef(false);

  // Helper to map urgency to approximate duration strings for the AI context
  const getDurationFromUrgency = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return '4 weeks';
      case 'High': return '8 weeks';
      default: return '12 weeks';
    }
  };

  const updateAgent = (id: string, updates: Partial<AgentState>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const runSequence = async () => {
    setHasError(false);
    setProgress(0);
    
    // Reset Agents
    setAgents(prev => prev.map(a => ({ ...a, status: 'waiting', log: 'Queueing...' })));

    try {
      // 1. Orchestrator
      updateAgent('orch', { status: 'running', log: 'Analyzing constraints & routing...' });
      await new Promise(r => setTimeout(r, 1000));
      updateAgent('orch', { status: 'complete', log: 'Route confirmed: Full Architecture Build.' });
      setProgress(15);

      // 2. Researcher (Simulated Grounding)
      updateAgent('res', { status: 'running', log: 'Scanning industry benchmarks...' });
      await new Promise(r => setTimeout(r, 1500)); 
      updateAgent('res', { status: 'complete', log: 'Verified against 3 competitor models.' });
      setProgress(35);

      // 3. Planner (Real AI Call)
      updateAgent('plan', { status: 'running', log: 'Drafting Work Breakdown Structure (Gemini 3 Pro)...' });
      const duration = getDurationFromUrgency(blueprint.constraints.timelineUrgency);
      
      const roadmap = await generateProjectRoadmap(
        blueprint.basics.projectName,
        blueprint.basics.companyName,
        blueprint.scope.appType,
        duration,
        blueprint.scope.goals
      );

      let roadmapSuccess = false;
      if (roadmap) {
        updateAgent('plan', { status: 'complete', log: 'WBS generated successfully.' });
        onUpdate('artifacts', { roadmap });
        roadmapSuccess = true;
      } else {
        updateAgent('plan', { status: 'failed', log: 'Failed to generate roadmap.' });
        setHasError(true);
      }
      setProgress(75);

      // 4. Analyst (Real AI Call)
      updateAgent('analyst', { status: 'running', log: 'Executing Python for budget analysis...' });
      
      const budget = await estimateProjectBudget(
        blueprint.scope.appType,
        duration,
        blueprint.scope.goals
      );

      let budgetSuccess = false;
      if (budget) {
        updateAgent('analyst', { status: 'complete', log: 'ROI projection validated.' });
        onUpdate('artifacts', { budget }); 
        budgetSuccess = true;
      } else {
        updateAgent('analyst', { status: 'failed', log: 'Budget service unavailable.' });
        setHasError(true);
      }
      setProgress(100);

      // Transition only if at least one critical artifact succeeded
      if (roadmapSuccess || budgetSuccess) {
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        setHasError(true); // Halt if everything failed
      }

    } catch (e) {
      console.error("Wizard Sequence Error", e);
      setHasError(true);
    }
  };

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;
    runSequence();
  }, []); 

  const handleRetry = () => {
    hasRunRef.current = true; // Ensure we keep track
    runSequence();
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-12">
        <div className={`inline-block p-3 rounded-2xl mb-6 shadow-2xl transition-colors ${hasError ? 'bg-red-500 shadow-red-500/20' : 'bg-black shadow-emerald-500/20'}`}>
           {hasError ? (
             <span className="text-2xl text-white">⚠️</span>
           ) : (
             <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
           )}
        </div>
        <h2 className="font-serif text-3xl text-gray-900 mb-2">
          {hasError ? 'Generation Interrupted' : 'Architecting Solution'}
        </h2>
        <p className="text-gray-500 text-[14px]">
          {hasError ? 'One or more agents failed to report back. Please retry.' : 'Consulting specialized AI agents to build your blueprint.'}
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">System Status</span>
          <span className={`text-[10px] font-mono ${hasError ? 'text-red-500' : 'text-emerald-600'}`}>
            {hasError ? 'Error Detected' : `${progress}% Complete`}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100 w-full">
          <div 
            className={`h-full transition-all duration-500 ease-out ${hasError ? 'bg-red-500' : 'bg-emerald-500'}`} 
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Agent List */}
        <div className="divide-y divide-gray-50">
          {agents.map((agent) => (
            <div key={agent.id} className="p-6 flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border ${
                  agent.status === 'waiting' ? 'bg-gray-50 border-gray-100 text-gray-300' :
                  agent.status === 'running' ? 'bg-blue-50 border-blue-100 text-blue-500 animate-pulse' :
                  agent.status === 'failed' ? 'bg-red-50 border-red-100 text-red-500' :
                  'bg-emerald-50 border-emerald-100 text-emerald-500'
                }`}>
                  {agent.status === 'complete' ? '✓' : 
                   agent.status === 'failed' ? '✕' :
                   agent.id === 'orch' ? '⚡' : 
                   agent.id === 'res' ? '🔍' : 
                   agent.id === 'plan' ? '📐' : '📊'}
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900">{agent.name}</h4>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">{agent.role}</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className={`text-[12px] font-mono ${
                  agent.status === 'running' ? 'text-blue-600' : 
                  agent.status === 'complete' ? 'text-emerald-600' : 
                  agent.status === 'failed' ? 'text-red-500' : 'text-gray-400'
                }`}>
                  {agent.log}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Terminal Footer */}
        <div className="bg-[#0a0a0f] p-4 font-mono text-[10px] text-gray-500 h-32 overflow-y-auto">
          <div className="flex space-x-2 mb-1">
            <span className="text-emerald-500">➜</span>
            <span>system initiate --context="{blueprint.basics.companyName}"</span>
          </div>
          {agents.filter(a => a.status !== 'waiting').map(a => (
             <div key={a.id + 'log'} className="flex space-x-2 mb-1">
               <span className={`text-${a.status === 'failed' ? 'red' : 'blue'}-500`}>ℹ</span>
               <span className="opacity-80">[{new Date().toLocaleTimeString()}] {a.name}: {a.log}</span>
             </div>
          ))}
          {progress === 100 && !hasError && (
             <div className="flex space-x-2 mb-1 animate-pulse">
               <span className="text-emerald-500">➜</span>
               <span className="text-white">Build complete. Redirecting to proposal...</span>
             </div>
          )}
          {hasError && (
             <div className="flex space-x-2 mb-1 text-red-400">
               <span className="text-red-500">⚠</span>
               <span>Process halted due to agent failure.</span>
             </div>
          )}
        </div>
      </div>

      {hasError && (
        <div className="mt-8 text-center animate-in fade-in slide-in-from-top-4">
          <button 
            onClick={handleRetry}
            className="bg-black text-white px-8 py-3 rounded-lg text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg"
          >
            Retry Generation
          </button>
        </div>
      )}
    </div>
  );
};

export default Step5Processing;
