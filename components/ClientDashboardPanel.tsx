import React from 'react';
import { Project } from '../types';

interface ClientDashboardPanelProps {
  projects: Project[];
}

const ClientDashboardPanel: React.FC<ClientDashboardPanelProps> = ({ projects }) => {
  // Simulate a client view for Maison Laurent
  const clientProjects = projects.filter(p => p.client.includes('Maison Laurent'));

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#fafafa] p-12 pb-32">
      <header className="mb-12">
        <h1 className="font-serif text-3xl mb-4 tracking-tight">Client Portal</h1>
        <p className="text-[14px] text-gray-400">Maison Laurent · Global Partner View</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-2">Active Projects</span>
          <span className="text-2xl font-serif">{clientProjects.length.toString().padStart(2, '0')}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-2">Upcoming Deadlines</span>
          <span className="text-2xl font-serif">04</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-2">Intelligence Confidence</span>
          <span className="text-2xl font-serif text-emerald-500">92%</span>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">Current Engagements</h2>
        <div className="space-y-4">
          {clientProjects.map((p, i) => (
            <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-[16px] font-medium mb-1">{p.name}</h4>
                <p className="text-[13px] text-gray-400 font-serif italic">{p.phase} · {p.duration}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'On Track' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {p.status}
                </span>
                <button className="text-[12px] font-bold border-b border-black pb-0.5">View Assets</button>
              </div>
            </div>
          ))}
          {clientProjects.length === 0 && (
            <p className="p-8 text-[13px] text-gray-400 font-serif italic text-center bg-white border border-gray-100 rounded-2xl">No active engagements found for this partner.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">Strategic Documents</h2>
        <div className="grid grid-cols-2 gap-4">
          {['SS25 Creative Brief', 'Q1 Market Analysis', 'Logo Guidelines v3', 'Media Strategy'].map((doc, i) => (
            <div key={i} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer group">
              <span className="text-lg">📄</span>
              <span className="text-[13px] font-medium group-hover:text-black transition-colors">{doc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ClientDashboardPanel;