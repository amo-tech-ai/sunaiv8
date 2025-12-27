
import React from 'react';
import { ActionItem, Contact, FocusState, Collaborator } from '../types';
import { NEXT_ACTIONS, RECENT_ACTIVITY, STATS, MOCK_CONTACTS } from '../constants';

interface MainPanelProps {
  onFocusAction: (type: 'task' | 'contact', item: ActionItem | Contact) => void;
  focus: FocusState;
  orchestratorStatus?: string;
  agents?: {
    research: 'Running' | 'Idle';
    planning: 'Running' | 'Idle';
    automation: 'Running' | 'Idle';
  };
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

const ContactRow: React.FC<{ 
  contact: Contact; 
  isActive: boolean; 
  onClick: () => void 
}> = ({ contact, isActive, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between py-3 px-6 border border-transparent rounded-lg cursor-pointer transition-all duration-200 ${
      isActive ? 'bg-white border-gray-200 shadow-sm ring-1 ring-gray-100' : 'hover:bg-gray-50/50'
    }`}
  >
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-500 overflow-hidden">
          {contact.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${contact.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
      </div>
      <div>
        <h4 className="text-[14px] font-medium text-gray-900 leading-none mb-1">{contact.name}</h4>
        <div className="flex items-center space-x-2">
          <p className="text-[12px] text-gray-400">{contact.role}</p>
          {(contact.isResearching || contact.isPlanning) && (
            <span className="text-[9px] text-blue-500 font-bold uppercase tracking-tighter animate-pulse">
              {contact.isResearching ? 'Researching...' : 'Planning...'}
            </span>
          )}
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-3">
      {contact.researchData && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />}
    </div>
  </div>
);

const MainPanel: React.FC<MainPanelProps> = ({ onFocusAction, focus, orchestratorStatus, agents }) => {
  const enrichmentNeeded = MOCK_CONTACTS.filter(c => (c.completeness || 0) < 70);

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-[#fafafa] p-12 pb-32 scroll-smooth">
      {/* Agent Status Ticker */}
      <div className="mb-10 flex items-center space-x-12 border-b border-gray-100 pb-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-3 flex-shrink-0">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300">Agents running:</span>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className={`w-1.5 h-1.5 rounded-full ${agents?.research === 'Running' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-200'}`} />
          <span className={`text-[11px] font-bold ${agents?.research === 'Running' ? 'text-black' : 'text-gray-300'}`}>Research</span>
          {agents?.research === 'Running' && <span className="text-[9px] text-emerald-500 font-medium italic">Analyzing market data</span>}
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className={`w-1.5 h-1.5 rounded-full ${agents?.planning === 'Running' ? 'bg-blue-500 animate-pulse' : 'bg-gray-200'}`} />
          <span className={`text-[11px] font-bold ${agents?.planning === 'Running' ? 'text-black' : 'text-gray-300'}`}>Planning</span>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className={`w-1.5 h-1.5 rounded-full bg-gray-200`} />
          <span className={`text-[11px] font-bold text-gray-200`}>Automation</span>
        </div>
        
        {orchestratorStatus && orchestratorStatus !== 'Idle' && (
          <div className="ml-auto text-[11px] text-gray-400 font-serif italic whitespace-nowrap">
            "{orchestratorStatus}"
          </div>
        )}
      </div>

      <header className="mb-12">
        <div className="flex justify-between items-start mb-8">
           <h1 className="font-serif text-3xl tracking-tight">Dashboard</h1>
        </div>
        
        <div className="flex space-x-3">
          <StatPill label="Active Projects" value={STATS.activeProjects} />
          <StatPill label="Open Tasks" value={STATS.openTasks} />
          <StatPill label="Active Clients" value={STATS.activeClients} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <section className="mb-16">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">Next Actions</h2>
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

          {enrichmentNeeded.length > 0 && (
            <section className="mb-16">
              <h2 className="text-[11px] uppercase tracking-[0.2em] text-blue-500 font-bold mb-6">Strategic Opportunities (AI)</h2>
              <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-6">
                <p className="text-[13px] text-blue-700 font-serif italic mb-4">
                  Intelligence Agent has identified {enrichmentNeeded.length} leads with shallow context. 
                  Enriching these will unlock higher accuracy intent scoring.
                </p>
                <div className="space-y-3">
                  {enrichmentNeeded.slice(0, 2).map(c => (
                    <div key={c.id} className="flex justify-between items-center bg-white p-3 px-4 rounded-xl border border-blue-100 shadow-sm">
                      <span className="text-[13px] font-medium">{c.company}</span>
                      <button 
                        onClick={() => onFocusAction('contact', c)}
                        className="text-[10px] uppercase font-bold text-blue-500 tracking-widest border-b border-blue-200 pb-0.5"
                      >
                        Enrich Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section>
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">Recent Activity</h2>
            <div className="max-w-2xl">
              <ul className="space-y-8">
                {RECENT_ACTIVITY.map((activity) => (
                  <li key={activity.id} className="flex items-start justify-between relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-200">
                    <div>
                      <p className="text-[14px] text-gray-800 font-medium leading-none mb-1.5 tracking-tight">{activity.title}</p>
                      <p className="text-[12px] text-gray-400 font-serif italic">{activity.project}</p>
                    </div>
                    <span className="text-[11px] text-gray-400 tabular-nums">{activity.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div>
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">Key Contacts</h2>
            <div className="space-y-1">
              {MOCK_CONTACTS.map((contact) => (
                <ContactRow 
                  key={contact.id}
                  contact={contact}
                  isActive={focus.id === contact.id}
                  onClick={() => onFocusAction('contact', contact)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default MainPanel;
