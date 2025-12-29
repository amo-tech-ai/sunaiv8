
import React, { useState } from 'react';
import { Project, ExecutionPlan } from '../types';
import { MOCK_EXECUTION_PLAN } from '../constants';
import { activateProjectAgents } from '../services/workflowEngine';

interface ExecutionPlanPanelProps {
  project: Project;
  onClose: () => void;
}

type Tab = 'Tasks' | 'Agents' | 'Automations' | 'Workflows' | 'Timeline';

const ExecutionPlanPanel: React.FC<ExecutionPlanPanelProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Tasks');
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [planStatus, setPlanStatus] = useState<'draft' | 'active' | 'paused' | 'completed'>(project.executionPlan?.status || 'draft');
  
  // Use existing plan or fallback to mock for this phase
  const plan: ExecutionPlan = project.executionPlan || { ...MOCK_EXECUTION_PLAN, projectId: project.id };

  const MOCK_LOGS = [
    "[10:00:01] System initialized.",
    "[10:00:02] Connected to workspace context.",
    "[10:00:05] Analyzing dependency graph...",
    "[10:00:08] No cyclic dependencies found.",
    "[10:00:12] Task 'Schema Design' marked as critical path."
  ];

  const handleActivate = async () => {
    setIsActivating(true);
    await activateProjectAgents(project);
    setPlanStatus('active');
    setIsActivating(false);
  };

  return (
    <div className="flex-1 flex h-screen overflow-hidden bg-[#fafafa] animate-in fade-in duration-500">
      
      {/* CENTER: Execution Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Summary Strip */}
        <header className="bg-white border-b border-gray-200 px-10 py-6 flex-shrink-0 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-4 mb-1">
              <h1 className="font-serif text-2xl text-gray-900">{project.name}</h1>
              <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold uppercase tracking-widest text-gray-600">v{plan.version}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                planStatus === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
              }`}>{planStatus}</span>
            </div>
            <div className="flex space-x-6 text-[11px] text-gray-500 font-medium">
              <span>Start: <b className="text-gray-900">{new Date(plan.startDate).toLocaleDateString()}</b></span>
              <span>Owner: <b className="text-gray-900">Julian Smith</b></span>
              <span>Risk: <span className={`font-bold ${plan.riskLevel === 'Low' ? 'text-emerald-500' : 'text-amber-500'}`}>{plan.riskLevel}</span></span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors text-[12px] font-bold uppercase tracking-widest">
            Close Plan
          </button>
        </header>

        {/* Plan Overview Card */}
        <div className="px-10 py-8 bg-[#fafafa]">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex justify-between items-start">
            <div>
              <h2 className="text-[14px] font-bold text-gray-900 mb-2">Execution Plan Overview</h2>
              <ul className="text-[12px] text-gray-500 space-y-1 list-disc pl-4 font-serif italic">
                <li>Goal: {project.description || "Execute project deliverables."}</li>
                <li>Duration: {project.duration}</li>
                <li>Strategy: Phased delivery with AI agent orchestration.</li>
              </ul>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:border-black transition-colors">View Blueprint</button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:border-black transition-colors">View Intel</button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-10 flex space-x-8 border-b border-gray-200 bg-[#fafafa]">
          {['Tasks', 'Agents', 'Automations', 'Workflows', 'Timeline'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as Tab)}
              className={`pb-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${
                activeTab === tab ? 'text-black border-black' : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-white">
          {activeTab === 'Tasks' && (
            <div className="space-y-3">
              {plan.tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-all group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${task.status === 'Done' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    <div>
                      <h4 className="text-[13px] font-medium text-gray-900">{task.title}</h4>
                      <p className="text-[11px] text-gray-400 font-serif italic">Assigned to: {task.collaborators?.[0]?.name || 'Unassigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded ${
                      task.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500'
                    }`}>{task.priority}</span>
                    <span className="text-[11px] text-gray-400 font-mono">{task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Agents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plan.activeAgents.map(agent => (
                <div key={agent.id} className={`p-6 border rounded-xl shadow-sm hover:shadow-md transition-all relative overflow-hidden ${expandedAgentId === agent.id ? 'border-black ring-1 ring-black/5 bg-gray-50' : 'border-gray-200 bg-white'}`}>
                  {(agent.status === 'working' || planStatus === 'active') && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-lg">
                        {agent.role === 'Orchestrator' ? '⚡' : agent.role === 'Planner' ? '📐' : agent.role === 'Controller' ? '🛡️' : '🔍'}
                      </div>
                      <div>
                        <h3 className="text-[14px] font-bold text-gray-900">{agent.name}</h3>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{agent.role}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded ${
                      (agent.status === 'working' || planStatus === 'active') ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'
                    }`}>{planStatus === 'active' ? 'working' : agent.status}</span>
                  </div>
                  
                  <div className="bg-white border border-gray-100 p-3 rounded-lg min-h-[60px] flex items-center shadow-inner">
                    <p className="text-[11px] font-mono text-gray-600">
                      {planStatus === 'active' ? 'Monitoring process stream...' : agent.currentTask || "Waiting for instructions..."}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200/60 flex justify-between items-center">
                    <button 
                      onClick={() => setExpandedAgentId(expandedAgentId === agent.id ? null : agent.id)}
                      className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                    >
                      {expandedAgentId === agent.id ? 'Hide Logs' : 'View Logs'}
                    </button>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-red-300 hover:text-red-500 transition-colors">
                      Deactivate
                    </button>
                  </div>

                  {expandedAgentId === agent.id && (
                    <div className="mt-4 bg-[#1e1e1e] p-4 rounded-lg font-mono text-[10px] text-green-400 h-32 overflow-y-auto animate-in fade-in slide-in-from-top-2 custom-scrollbar shadow-inner">
                      {MOCK_LOGS.map((log, i) => (
                        <div key={i} className="mb-1 opacity-80">{log}</div>
                      ))}
                      <div className="flex space-x-2 animate-pulse mt-2">
                        <span className="text-emerald-500">➜</span>
                        <span className="text-white">_</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Automations' && (
            <div className="space-y-3">
              {plan.automations.map(auto => (
                <div key={auto.id} className="flex items-center justify-between p-5 border border-gray-100 rounded-xl bg-white">
                  <div className="flex items-center space-x-6">
                    <div className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${auto.enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${auto.enabled ? 'left-5' : 'left-1'}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-[12px] font-medium text-gray-900">
                        <span>{auto.trigger}</span>
                        <span className="text-gray-300">→</span>
                        <span>{auto.action}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black">Edit Logic</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Workflows' && (
            <div className="space-y-4">
              {plan.workflows.map(wf => (
                <div key={wf.id} className="p-6 border border-gray-200 rounded-xl relative overflow-hidden group hover:border-gray-300 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-[14px] font-bold text-gray-900">{wf.name}</h3>
                      <p className="text-[11px] text-gray-400 font-serif italic">{wf.stepCount} Steps · {wf.status}</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-50 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                      {wf.status === 'active' ? 'Pause' : 'Run'}
                    </button>
                  </div>
                  {/* Visual Chain Placeholder */}
                  <div className="flex items-center space-x-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div className="h-px w-8 bg-gray-200" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="h-px w-8 bg-gray-200" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Timeline' && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-4">Gantt View</span>
              <p className="text-[13px] text-gray-500 font-serif italic max-w-md">
                Timeline visualization uses the full-screen Resource Timeline component. 
              </p>
            </div>
          )}
        </div>
      </main>

      {/* RIGHT: Control & Safety */}
      <aside className="w-80 border-l border-gray-200 bg-white flex flex-col z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-6">Controller Gate</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-medium text-gray-600">Agents Active</span>
              <span className="text-[11px] font-bold text-gray-900">{planStatus === 'active' ? plan.activeAgents.length : plan.activeAgents.filter(a => a.status !== 'idle').length} / {plan.activeAgents.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-medium text-gray-600">Automations</span>
              <span className="text-[11px] font-bold text-gray-900">{plan.automations.filter(a => a.enabled).length} Enabled</span>
            </div>
          </div>

          <div className="space-y-3">
            {planStatus === 'active' ? (
                <button 
                    onClick={() => setPlanStatus('paused')}
                    className="w-full py-4 bg-amber-500 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2"
                >
                    <span>⏸</span> <span>Pause Plan</span>
                </button>
            ) : (
                <button 
                    onClick={handleActivate}
                    disabled={isActivating}
                    className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-wait"
                >
                    {isActivating ? (
                        <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Booting...</span>
                        </>
                    ) : (
                        <><span>▶</span> <span>Activate Plan</span></>
                    )}
                </button>
            )}
            
            <button className="w-full py-3 bg-white border border-gray-200 text-gray-500 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:border-black hover:text-black transition-all">
              Stop All
            </button>
            <p className="text-[9px] text-center text-gray-400 font-medium mt-2">Actions here affect live systems.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <h2 className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-6">Live Audit Log</h2>
          <div className="space-y-4">
            {plan.auditLog.map(log => (
              <div key={log.id} className="pb-4 border-b border-gray-50 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-gray-900">{log.action}</span>
                  <span className="text-[9px] text-gray-400 font-mono">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="flex items-center space-x-1 text-[10px]">
                  <span className="text-gray-500">by</span>
                  <span className="font-bold text-blue-600">{log.actor}</span>
                </div>
              </div>
            ))}
            {plan.auditLog.length === 0 && (
              <p className="text-[11px] text-gray-400 font-serif italic text-center py-4">No actions recorded yet.</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ExecutionPlanPanel;
