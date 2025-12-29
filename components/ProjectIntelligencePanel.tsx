
import React, { useState, useEffect } from 'react';
import { Project, ProjectIntelligence } from '../types';
import { generateProjectIntelligence } from '../services/ai/intelligenceAgent';

interface ProjectIntelligencePanelProps {
  project: Project;
  onClose: () => void;
  onCommitPlan: (items: any[]) => void;
}

type Tab = 'Agents' | 'Automations' | 'Workflows' | 'Journeys' | 'Examples';

const ProjectIntelligencePanel: React.FC<ProjectIntelligencePanelProps> = ({ project, onClose, onCommitPlan }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Agents');
  const [intel, setIntel] = useState<ProjectIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Pending actions queue (Items selected by user)
  const [pendingItems, setPendingItems] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    // Load intelligence (Real Gemini 3 Pro run)
    const load = async () => {
      // Check for cached intelligence first to avoid re-running expensive models
      if (project.intelligence) {
        setIntel(project.intelligence);
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await generateProjectIntelligence(project);
      
      if (isMounted) {
        if (result) {
          setIntel(result);
        } else {
          setError(true);
        }
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [project]);

  const toggleItem = (item: any, type: string) => {
    setPendingItems(prev => {
      const exists = prev.find((i: any) => i.id === item.id);
      if (exists) return prev.filter((i: any) => i.id !== item.id);
      return [...prev, { ...item, _type: type }];
    });
  };

  const isSelected = (id: string) => !!pendingItems.find(i => i.id === id);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    generateProjectIntelligence(project).then(res => {
      if (res) setIntel(res);
      else setError(true);
      setLoading(false);
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen bg-[#fafafa]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
        </div>
        <h2 className="font-serif text-2xl text-gray-900 mt-8 mb-2">Architecting Solution...</h2>
        <p className="text-[13px] text-gray-500 font-mono">Gemini 3 Pro is reasoning through {project.type} constraints.</p>
      </div>
    );
  }

  if (error || !intel) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen bg-[#fafafa]">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-2xl text-red-500">⚠️</div>
        <h2 className="font-serif text-2xl text-gray-900 mb-2">Analysis Failed</h2>
        <p className="text-[13px] text-gray-500 mb-8 max-w-md text-center">The intelligence agent encountered an issue while processing the blueprint. Please try again.</p>
        <div className="flex space-x-4">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg border border-gray-200 text-[12px] font-bold uppercase tracking-widest hover:bg-gray-50">Close</button>
          <button onClick={handleRetry} className="px-6 py-2.5 rounded-lg bg-black text-white text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800">Retry Agent</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-screen overflow-hidden bg-[#fafafa] animate-in fade-in duration-500">
      
      {/* CENTER: Intelligence Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Summary Strip */}
        <header className="bg-white border-b border-gray-200 px-10 py-6 flex-shrink-0 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="font-serif text-2xl text-gray-900">{project.name}</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                project.type === 'AI' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600'
              }`}>{project.type}</span>
            </div>
            <div className="flex space-x-6 text-[11px] text-gray-500 font-medium">
              <span>Model: <b className="text-gray-900">{intel.summary.deliveryModel}</b></span>
              <span>Complexity: <b className="text-gray-900">{intel.summary.complexity}</b></span>
              <span>Goal: <i className="font-serif text-gray-700">{intel.summary.primaryGoal}</i></span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors text-[12px] font-bold uppercase tracking-widest">
            Close View
          </button>
        </header>

        {/* Tab Navigation */}
        <div className="px-10 pt-8 pb-4 flex space-x-8 border-b border-gray-100 bg-[#fafafa]">
          {['Agents', 'Automations', 'Workflows', 'Journeys', 'Examples'].map((tab) => (
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

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {activeTab === 'Agents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {intel.agents.map((agent) => (
                <div key={agent.id} className={`bg-white p-6 rounded-xl border shadow-sm transition-all group ${isSelected(agent.id) ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-100 hover:shadow-md'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${isSelected(agent.id) ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                        {agent.confidence === 'High' ? '🤖' : '⚙️'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-[14px]">{agent.name}</h3>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{agent.role}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-1 rounded ${
                      agent.confidence === 'High' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {agent.confidence} Conf.
                    </span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <p className="text-[12px] text-gray-600 leading-relaxed"><span className="font-bold text-gray-400 text-[10px] uppercase mr-2">Why:</span>{agent.whyNeeded}</p>
                    <p className="text-[12px] text-gray-600 leading-relaxed"><span className="font-bold text-gray-400 text-[10px] uppercase mr-2">Output:</span>{agent.produces}</p>
                  </div>
                  <button 
                    onClick={() => toggleItem(agent, 'agent')}
                    className={`w-full py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
                      isSelected(agent.id) 
                        ? 'bg-black text-white' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    {isSelected(agent.id) ? 'Deploy Agent' : 'Add to Plan'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Automations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {intel.automations.map((auto) => (
                <div key={auto.id} className={`bg-white p-6 rounded-xl border shadow-sm relative overflow-hidden transition-all ${isSelected(auto.id) ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-100 hover:shadow-md'}`}>
                  {/* Risk Indicator Strip */}
                  {auto.riskLevel === 'High' && <div className="absolute top-0 right-0 w-1 h-full bg-red-400" />}
                  
                  {/* Trigger -> Action Flow */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500 font-mono mb-4">
                    <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">{auto.trigger}</span>
                    <span className="text-gray-300">➜</span>
                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">{auto.action}</span>
                  </div>
                  
                  {/* Outcome */}
                  <h3 className="font-serif text-[15px] text-gray-900 italic mb-2 leading-relaxed">"{auto.outcome}"</h3>
                  
                  {/* Footer: Risk & Enable */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                    <div className="flex items-center space-x-2">
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Risk</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        auto.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-600' : 
                        auto.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-600' : 
                        'bg-red-50 text-red-600'
                        }`}>
                        {auto.riskLevel}
                        </span>
                    </div>
                    <button 
                      onClick={() => toggleItem(auto, 'automation')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                        isSelected(auto.id) ? 'bg-black text-white shadow-md' : 'border border-gray-200 text-gray-500 hover:border-black hover:text-black'
                      }`}
                    >
                      {isSelected(auto.id) ? 'Selected' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Workflows' && (
            <div className="space-y-4">
              {intel.workflows.map((wf) => (
                <div key={wf.id} className={`bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between items-center group transition-all ${isSelected(wf.id) ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-100 hover:border-blue-200'}`}>
                  <div className="flex-1 mb-4 md:mb-0 w-full">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 text-[14px]">{wf.name}</h3>
                        <span className="text-[10px] text-gray-400 font-serif italic hidden sm:inline text-right max-w-[200px]">{wf.whenToUse}</span>
                    </div>
                    
                    {/* Visual Chain */}
                    <div className="flex items-center mt-4 space-x-1 overflow-x-auto pb-1 no-scrollbar">
                        <div className="flex items-center bg-gray-50 border border-gray-100 rounded px-3 py-1.5 text-[10px] text-gray-500 font-medium whitespace-nowrap">
                            Start
                        </div>
                        <div className="w-6 h-px bg-gray-200 shrink-0 relative">
                            <div className="absolute right-0 -top-[3px] w-0 h-0 border-t-[3px] border-t-transparent border-l-[4px] border-l-gray-200 border-b-[3px] border-b-transparent"></div>
                        </div>
                        <div className="flex items-center bg-blue-50 border border-blue-100 rounded px-3 py-1.5 text-[10px] text-blue-600 font-bold whitespace-nowrap">
                            {wf.stepCount} Steps
                        </div>
                        <div className="w-6 h-px bg-gray-200 shrink-0 relative">
                            <div className="absolute right-0 -top-[3px] w-0 h-0 border-t-[3px] border-t-transparent border-l-[4px] border-l-gray-200 border-b-[3px] border-b-transparent"></div>
                        </div>
                        <div className="flex items-center bg-emerald-50 border border-emerald-100 rounded px-3 py-1.5 text-[10px] text-emerald-600 font-bold whitespace-nowrap flex-shrink-0">
                            ✨ {wf.outputs}
                        </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 pl-0 md:pl-6 shrink-0">
                    <button 
                      onClick={() => toggleItem(wf, 'workflow')}
                      className={`px-6 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95 ${
                        isSelected(wf.id) ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white border border-gray-200 text-gray-500 hover:text-black hover:border-black'
                      }`}
                    >
                      {isSelected(wf.id) ? 'Included' : 'Include Workflow'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Journeys' && (
            <div className="space-y-6">
              {intel.journeys.map((journey) => (
                <div key={journey.id} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-[14px]">User Journey: {journey.actor}</h3>
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-bold border border-indigo-100">{journey.valueProp}</span>
                  </div>
                  <div className="relative pl-4 space-y-6 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-gray-200">
                    {journey.steps.map((step, i) => (
                      <div key={i} className="relative flex items-center">
                        <div className="absolute -left-[15px] w-2 h-2 rounded-full bg-white border-2 border-indigo-400" />
                        <span className="text-[12px] text-gray-600">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Examples' && (
            <div className="grid grid-cols-1 gap-6">
              {intel.examples.map((ex) => (
                <div key={ex.id} className="bg-gradient-to-br from-[#0a0a0f] to-[#1a1a2e] p-8 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold block mb-4 relative z-10">Real World Case</span>
                  <h3 className="font-serif text-xl mb-2 relative z-10">{ex.scenario}</h3>
                  <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-8 relative z-10">
                    <div>
                      <span className="block text-[10px] text-gray-500 uppercase mb-1">Architecture</span>
                      <p className="text-[12px] text-gray-300">{ex.built}</p>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-500 uppercase mb-1">Outcome</span>
                      <p className="text-[12px] text-emerald-300 font-bold">{ex.outcome}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* RIGHT: Blueprint Summary & Actions */}
      <aside className="w-80 border-l border-gray-200 bg-white flex flex-col z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-6">Blueprint Source</h2>
          <div className="space-y-4">
            <div>
              <span className="block text-[10px] text-gray-400 uppercase font-bold">Scope</span>
              <p className="text-[13px] text-gray-800 font-medium leading-snug mt-1">{project.description || "N/A"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] text-gray-400 uppercase font-bold">Duration</span>
                <span className="text-[13px] text-gray-800 font-medium">{project.duration}</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-400 uppercase font-bold">Phase</span>
                <span className="text-[13px] text-gray-800 font-medium">{project.phase}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <h2 className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-6">Pending Commit</h2>
          
          {pendingItems.length === 0 ? (
            <p className="text-[12px] text-gray-400 font-serif italic text-center py-8">
              Select items from the center panel to add them to the execution plan.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 group animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <span className="block text-[13px] font-bold text-gray-900 truncate max-w-[150px]">{item.name || item.trigger}</span>
                    <span className="block text-[9px] uppercase text-gray-400 tracking-wide">{item._type}</span>
                  </div>
                  <button 
                    onClick={() => toggleItem(item, item._type)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-8 border-t border-gray-100 bg-gray-50">
          <p className="text-[10px] text-gray-400 mb-4 text-center">AI proposes. You confirm.</p>
          <div className="space-y-3">
            <button 
              onClick={() => onCommitPlan(pendingItems)}
              disabled={pendingItems.length === 0}
              className="w-full py-4 bg-black text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:shadow-none"
            >
              Confirm {pendingItems.length} Actions
            </button>
            <button 
              onClick={() => setPendingItems([])}
              disabled={pendingItems.length === 0}
              className="w-full py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              Clear Selections
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ProjectIntelligencePanel;
