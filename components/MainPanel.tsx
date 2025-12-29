
import React from 'react';
import { ActionItem, Contact, FocusState, Collaborator, AuditLog } from '../types';
import { NEXT_ACTIONS, RECENT_ACTIVITY, STATS, MOCK_CONTACTS } from '../constants';
import AgentTeamView from './AgentTeamView';

interface MainPanelProps {
  onFocusAction: (type: 'task' | 'contact', item: ActionItem | Contact) => void;
  focus: FocusState;
  orchestratorStatus?: string;
  agents?: {
    research: 'Running' | 'Idle';
    planning: 'Running' | 'Idle';
    automation: 'Running' | 'Idle';
  };
  auditLogs?: AuditLog[];
}

const AvatarStack: React.FC<{ users?: Collaborator[] }> = ({ users }) => {
  if (!users || users.length === 0) return null;
  return (
    <div className="flex -space-x-2 overflow-hidden">
      {users.map((user) => (
        <div 
          key={user.id} 
          title={user.name}
          className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400"
        >
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
      ))}
    </div>
  );
};

const StatPill: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center space-x-2 px-4 py-1.5 bg-white border border-gray-200 rounded-full text-[13px] hover:border-gray-300 transition-colors cursor-default shadow-sm">
    <span className="text-gray-400 font-medium">{label}:</span>
    <span className="text-black font-semibold">{value}</span>
  </div>
);

const ActionRow: React.FC<{ 
  item: ActionItem; 
  isActive: boolean; 
  onClick: () => void 
}> = ({ item, isActive, onClick }) => (
  <div 
    onClick={onClick}
    className={`group flex items-center justify-between py-4 px-6 border border-transparent rounded-lg cursor-pointer transition-all duration-200 ${
      isActive ? 'bg-white border-gray-200 shadow-sm ring-1 ring-gray-100' : 'hover:bg-gray-50/50'
    }`}
  >
    <div className="flex-1">
      <h4 className="text-[15px] font-medium text-gray-900 leading-tight mb-0.5">{item.title}</h4>
      <p className="text-[13px] text-gray-400 font-serif italic">{item.project}</p>
    </div>
    <div className="flex items-center space-x-6">
      <AvatarStack users={item.collaborators} />
      <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold min-w-[60px] text-center ${
        item.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'
      }`}>
        {item.priority}
      </span>
    </div>
  </div>
);

const MainPanel: React.FC<MainPanelProps> = ({ onFocusAction, focus, orchestratorStatus, agents, auditLogs }) => {
  // Default agent state if not provided
  const agentState = agents || { research: 'Idle', planning: 'Idle', automation: 'Idle' };

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-[#fafafa] p-12 pb-32 scroll-smooth">
      {/* Orchestrator Status Ticker */}
      <div className="mb-10 flex items-center space-x-6 border-b border-gray-100 pb-6 sticky top-0 bg-[#fafafa] z-20 pt-2">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${orchestratorStatus && orchestratorStatus !== 'Idle' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Orchestrator</span>
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <span className="text-[11px] font-serif italic text-gray-500 truncate">
          {orchestratorStatus !== 'Idle' ? orchestratorStatus : "System operational. Monitoring inputs."}
        </span>
      </div>

      <header className="mb-12">
        <h1 className="font-serif text-3xl tracking-tight mb-8">Dashboard</h1>
        <div className="flex space-x-3">
          <StatPill label="Active Projects" value={STATS.activeProjects} />
          <StatPill label="Open Tasks" value={STATS.openTasks} />
          <StatPill label="Active Clients" value={STATS.activeClients} />
        </div>
      </header>

      {/* Agents Visualization */}
      <AgentTeamView agents={agentState} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <section className="mb-16">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">Immediate Priorities</h2>
            <div className="space-y-1">
              {NEXT_ACTIONS.map((item) => (
                <ActionRow 
                  key={item.id} 
                  item={item} 
                  isActive={focus.id === item.id}
                  onClick={() => onFocusAction('task', item)} 
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">Recent Intelligence Approval Feed</h2>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              {auditLogs && auditLogs.length > 0 ? (
                auditLogs.map(log => (
                  <div key={log.id} className="p-4 border-b border-gray-50 last:border-0 flex justify-between items-center group">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-[12px] font-bold">✓</div>
                      <div>
                        <p className="text-[13px] font-medium text-gray-900">{log.action}</p>
                        <p className="text-[11px] text-gray-400 font-serif italic">{log.context}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-300 font-mono">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))
              ) : (
                <p className="p-12 text-center text-[13px] text-gray-400 font-serif italic">Human-in-the-loop approvals will appear here.</p>
              )}
            </div>
          </section>
        </div>

        <div>
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">CRM Snapshot</h2>
            <div className="space-y-3">
              {MOCK_CONTACTS.slice(0, 5).map((contact) => (
                <div 
                  key={contact.id}
                  onClick={() => onFocusAction('contact', contact)}
                  className={`flex items-center space-x-4 p-3 rounded-xl cursor-pointer transition-all ${focus.id === contact.id ? 'bg-white border border-gray-100 shadow-sm' : 'hover:bg-gray-50'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-medium text-gray-900">{contact.company}</h4>
                    <p className="text-[11px] text-gray-400">{contact.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default MainPanel;
