import React, { useState, useMemo } from 'react';
import { Contact, FocusState, PipelineStage, ContactCategory, ContactStatus, Interaction, Deal } from '../types';
import { STATS } from '../constants';

interface CRMPanelProps {
  contacts: Contact[];
  onFocus: (type: 'contact', item: Contact) => void;
  focus: FocusState;
  onAddContact: (contact: Partial<Contact>) => void;
  onLogInteraction: (contactId: string, interaction: Interaction) => void;
  onAddDeal: (contactId: string, deal: Deal) => void;
}

const Sparkline: React.FC<{ data: number[] }> = ({ data }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const width = 120;
  const height = 30;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d - min) / range) * height
  }));
  const path = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={path} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const PipelineCard: React.FC<{ contact: Contact; isActive: boolean; onClick: () => void }> = ({ contact, isActive, onClick }) => {
  const isStale = contact.lastContact.includes('35d') || contact.lastContact.includes('1mo');

  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all cursor-pointer mb-3 select-none outline-none group ${
        isActive 
        ? 'bg-white border-black shadow-md ring-1 ring-black/5 scale-[1.02]' 
        : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-[13px] font-semibold text-gray-900 truncate pr-2 tracking-tight group-hover:text-black">{contact.company}</h4>
        <div className="flex space-x-1.5 items-center">
          {contact.isProcessing && <div className="w-2 h-2 rounded-full bg-blue-500 animate-spin" />}
          {contact.researchData && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />}
          {isStale && <div className="w-2 h-2 rounded-full bg-amber-400" />}
        </div>
      </div>
      <div className="mb-3">
        <p className="text-[12px] text-gray-900 font-medium leading-tight">{contact.name}</p>
        <p className="text-[11px] text-gray-400 font-serif italic tracking-tight">{contact.category}</p>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-gray-50">
        <span className="text-[11px] font-semibold text-gray-800 tabular-nums">{contact.dealValue || 'TBD'}</span>
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{contact.status}</span>
      </div>
    </div>
  );
};

const CRMPanel: React.FC<CRMPanelProps> = ({ contacts, onFocus, focus, onAddContact, onLogInteraction, onAddDeal }) => {
  const [view, setView] = useState<'board' | 'detail'>('board');
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [filters, setFilters] = useState<{ category: ContactCategory | 'All'; status: ContactStatus | 'All' }>({ category: 'All', status: 'All' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);

  // Form states
  const [newContact, setNewContact] = useState<Partial<Contact>>({ name: '', company: '', category: 'Designer', status: 'Active' });
  const [newLog, setNewLog] = useState<Partial<Interaction>>({ type: 'Meeting', note: '', date: new Date().toISOString().split('T')[0] });
  const [newDeal, setNewDeal] = useState<Partial<Deal>>({ title: '', value: '', stage: 'Discovery', closeDate: '' });

  const columns: PipelineStage[] = ['Discovery', 'Proposal', 'Negotiation', 'Closed'];

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const catMatch = filters.category === 'All' || c.category === filters.category;
      const statusMatch = filters.status === 'All' || c.status === filters.status;
      return catMatch && statusMatch;
    });
  }, [contacts, filters]);

  const handleOpenContact = (contact: Contact) => {
    setActiveContact(contact);
    setView('detail');
    onFocus('contact', contact);
  };

  const submitAddContact = () => {
    onAddContact(newContact);
    setIsAddModalOpen(false);
    setNewContact({ name: '', company: '', category: 'Designer', status: 'Active' });
  };

  const submitLogInteraction = () => {
    if (activeContact) {
      onLogInteraction(activeContact.id, { ...newLog, id: Date.now().toString() } as Interaction);
      setIsLogModalOpen(false);
      setNewLog({ type: 'Meeting', note: '', date: new Date().toISOString().split('T')[0] });
    }
  };

  const submitAddDeal = () => {
    if (activeContact && newDeal.title) {
      onAddDeal(activeContact.id, { ...newDeal, id: Date.now().toString() } as Deal);
      setIsDealModalOpen(false);
      setNewDeal({ title: '', value: '', stage: 'Discovery', closeDate: '' });
    }
  };

  return (
    <div className="flex-1 h-screen overflow-hidden flex flex-col bg-[#fafafa]">
      {/* Header */}
      <header className="p-12 pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl mb-4 tracking-tight">
            {view === 'board' ? 'CRM Pipeline' : activeContact?.company}
          </h1>
          <div className="flex space-x-6">
            <button 
              onClick={() => { setView('board'); setActiveContact(null); }}
              className={`text-[12px] uppercase tracking-[0.2em] font-bold pb-1 border-b-2 transition-all ${view === 'board' ? 'text-black border-black' : 'text-gray-300 border-transparent hover:text-gray-500'}`}
            >
              Pipeline Board
            </button>
            {activeContact && (
              <button className="text-[12px] uppercase tracking-[0.2em] font-bold pb-1 border-b-2 text-black border-black transition-all">
                Profile Details
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-12 mb-6">
           <div className="flex flex-col items-end">
             <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Network Growth</span>
             <Sparkline data={STATS.networkGrowth} />
           </div>
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="bg-black text-white px-6 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-sm"
           >
             Add Contact
           </button>
        </div>
      </header>

      {/* Board View */}
      {view === 'board' ? (
        <>
          <div className="px-12 mb-8 flex space-x-4">
             <select 
               className="bg-white border border-gray-100 rounded-lg px-4 py-2 text-[12px] font-bold outline-none focus:border-black"
               value={filters.category}
               onChange={(e) => setFilters({...filters, category: e.target.value as any})}
             >
               <option value="All">All Categories</option>
               {['Designer', 'Buyer', 'Press', 'Sponsor', 'Enterprise', 'Startup'].map(c => <option key={c} value={c}>{c}</option>)}
             </select>
             <select 
               className="bg-white border border-gray-100 rounded-lg px-4 py-2 text-[12px] font-bold outline-none focus:border-black"
               value={filters.status}
               onChange={(e) => setFilters({...filters, status: e.target.value as any})}
             >
               <option value="All">All Statuses</option>
               {['Active', 'Lead', 'Archive'].map(s => <option key={s} value={s}>{s}</option>)}
             </select>
          </div>

          <div className="flex-1 overflow-x-auto p-12 pt-0 flex space-x-8 scroll-smooth pb-24">
            {columns.map((col) => {
              const stageLeads = filteredContacts.filter(c => c.pipelineStage === col);
              return (
                <div key={col} className="w-72 flex-shrink-0 flex flex-col">
                  <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400">{col}</h3>
                    <span className="text-[10px] text-gray-300 font-bold">{stageLeads.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-1">
                    {stageLeads.map((contact) => (
                      <PipelineCard 
                        key={contact.id} 
                        contact={contact} 
                        isActive={focus.id === contact.id}
                        onClick={() => handleOpenContact(contact)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : activeContact ? (
        <div className="flex-1 overflow-y-auto p-12 pt-0 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="max-w-5xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                 <div className="lg:col-span-2 space-y-12">
                    <section>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">Relationship History</h3>
                        <button 
                          onClick={() => setIsLogModalOpen(true)}
                          className="text-[10px] uppercase font-bold text-blue-600 hover:text-blue-800"
                        >
                          + Log Interaction
                        </button>
                      </div>
                      <div className="space-y-4">
                        {activeContact.interactions.map((int, i) => (
                          <div key={i} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex justify-between items-start mb-2">
                               <span className="text-[10px] uppercase font-bold text-blue-500 tracking-widest">{int.type}</span>
                               <span className="text-[11px] text-gray-300 tabular-nums">{int.date}</span>
                             </div>
                             <p className="text-[13px] text-gray-800 font-medium mb-1">{int.note}</p>
                             {int.outcome && <p className="text-[11px] text-emerald-500 font-bold uppercase tracking-tighter">Outcome: {int.outcome}</p>}
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-6">Recent Placements & Media</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {activeContact.placements.map((p, i) => (
                          <div key={i} className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center space-x-3 group cursor-pointer hover:bg-white transition-all">
                             <span className="text-lg">📰</span>
                             <span className="text-[13px] font-medium group-hover:text-blue-600">{p}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                 </div>

                 <div className="space-y-12">
                    <section>
                       <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">Deals Pipeline</h3>
                        <button 
                          onClick={() => setIsDealModalOpen(true)}
                          className="text-[10px] uppercase font-bold text-blue-600 hover:text-blue-800"
                        >
                          + Create Deal
                        </button>
                       </div>
                       <div className="space-y-4">
                          {activeContact.deals.map((deal, i) => (
                            <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                               <h4 className="text-[14px] font-bold mb-1">{deal.title}</h4>
                               <p className="text-[11px] text-gray-400 font-serif italic mb-3">{deal.linkedCampaign || 'Global Strategy'}</p>
                               <div className="flex justify-between items-center text-[12px] font-bold">
                                  <span>{deal.value}</span>
                                  <span className="text-gray-300 tracking-tighter uppercase">{deal.stage}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </section>
                 </div>
              </div>
           </div>
        </div>
      ) : null}

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-8">
           <div className="bg-white rounded-3xl w-full max-w-lg p-10 shadow-2xl animate-in zoom-in duration-300">
              <h2 className="font-serif text-2xl mb-8">New Relationship Intake</h2>
              <div className="space-y-6 mb-10">
                 <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">Company Name</label>
                    <input 
                      type="text" 
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-black text-lg font-serif"
                      value={newContact.company}
                      onChange={e => setNewContact({...newContact, company: e.target.value})}
                      placeholder="e.g. Maison Laurent"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">Contact Name</label>
                       <input 
                         type="text" 
                         className="w-full border-b border-gray-200 py-2 outline-none focus:border-black text-[14px]"
                         value={newContact.name}
                         onChange={e => setNewContact({...newContact, name: e.target.value})}
                         placeholder="Full Name"
                       />
                    </div>
                    <div>
                       <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">Category</label>
                       <select 
                         className="w-full border-b border-gray-200 py-2 outline-none focus:border-black text-[14px] bg-transparent"
                         value={newContact.category}
                         onChange={e => setNewContact({...newContact, category: e.target.value as any})}
                       >
                          {['Designer', 'Buyer', 'Press', 'Sponsor', 'Enterprise', 'Startup'].map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                 </div>
              </div>
              <div className="flex space-x-4">
                 <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 text-[12px] font-bold uppercase text-gray-400 hover:text-black transition-colors">Cancel</button>
                 <button onClick={submitAddContact} className="flex-1 py-3 bg-black text-white rounded-xl text-[12px] font-bold uppercase tracking-widest shadow-lg">Save Contact</button>
              </div>
           </div>
        </div>
      )}

      {/* Add Deal Modal */}
      {isDealModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-8">
           <div className="bg-white rounded-3xl w-full max-w-lg p-10 shadow-2xl animate-in zoom-in duration-300">
              <h2 className="font-serif text-2xl mb-8">Create New Opportunity</h2>
              <div className="space-y-6 mb-10">
                 <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">Deal Title</label>
                    <input 
                      type="text" 
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-black text-[14px]"
                      value={newDeal.title}
                      onChange={e => setNewDeal({...newDeal, title: e.target.value})}
                      placeholder="e.g. Q4 Platform Retainer"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">Value</label>
                       <input 
                         type="text" 
                         className="w-full border-b border-gray-200 py-2 outline-none focus:border-black text-[14px]"
                         value={newDeal.value}
                         onChange={e => setNewDeal({...newDeal, value: e.target.value})}
                         placeholder="$45,000"
                       />
                    </div>
                    <div>
                       <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">Est. Close Date</label>
                       <input 
                         type="date" 
                         className="w-full border-b border-gray-200 py-2 outline-none focus:border-black text-[14px]"
                         value={newDeal.closeDate}
                         onChange={e => setNewDeal({...newDeal, closeDate: e.target.value})}
                       />
                    </div>
                 </div>
              </div>
              <div className="flex space-x-4">
                 <button onClick={() => setIsDealModalOpen(false)} className="flex-1 py-3 text-[12px] font-bold uppercase text-gray-400 hover:text-black transition-colors">Cancel</button>
                 <button onClick={submitAddDeal} className="flex-1 py-3 bg-black text-white rounded-xl text-[12px] font-bold uppercase tracking-widest shadow-lg">Activate Deal</button>
              </div>
           </div>
        </div>
      )}

      {/* Log Interaction Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-8">
           <div className="bg-white rounded-3xl w-full max-w-lg p-10 shadow-2xl animate-in zoom-in duration-300">
              <h2 className="font-serif text-2xl mb-8">Log Relationship Update</h2>
              <div className="space-y-6 mb-10">
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">Date</label>
                       <input 
                         type="date" 
                         className="w-full border-b border-gray-200 py-2 outline-none focus:border-black text-[14px]"
                         value={newLog.date}
                         onChange={e => setNewLog({...newLog, date: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">Interaction Type</label>
                       <select 
                         className="w-full border-b border-gray-200 py-2 outline-none focus:border-black text-[14px] bg-transparent"
                         value={newLog.type}
                         onChange={e => setNewLog({...newLog, type: e.target.value as any})}
                       >
                          {['Meeting', 'Demo', 'Call', 'RSVP', 'Email'].map(t => <option key={t} value={t}>{t}</option>)}
                       </select>
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">Outcome & Notes</label>
                    <textarea 
                      className="w-full border border-gray-100 rounded-xl p-4 outline-none focus:border-black text-[13px] h-32"
                      value={newLog.note}
                      onChange={e => setNewLog({...newLog, note: e.target.value})}
                      placeholder="What was the strategic takeaway?"
                    />
                 </div>
              </div>
              <div className="flex space-x-4">
                 <button onClick={() => setIsLogModalOpen(false)} className="flex-1 py-3 text-[12px] font-bold uppercase text-gray-400 hover:text-black transition-colors">Cancel</button>
                 <button onClick={submitLogInteraction} className="flex-1 py-3 bg-black text-white rounded-xl text-[12px] font-bold uppercase tracking-widest shadow-lg">Record Log</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CRMPanel;