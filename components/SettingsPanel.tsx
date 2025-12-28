import React, { useState, useEffect } from 'react';
import { AuditLog } from '../types';

interface SettingsPanelProps {
  auditLogs: AuditLog[];
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ auditLogs }) => {
  const [hasPaidKey, setHasPaidKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasPaidKey(has);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setHasPaidKey(true);
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#fafafa] p-12 pb-32">
      <header className="mb-12">
        <h1 className="font-serif text-3xl mb-4 tracking-tight">Workspace Config</h1>
        <p className="text-[14px] text-gray-400">Configure your agency credentials, team access, and intelligence parameters.</p>
      </header>

      <div className="max-w-3xl space-y-12">
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">High-Fidelity Models</h2>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[14px] font-medium">Paid Project Key</h4>
                <p className="text-[12px] text-gray-400">Required for Veo video and 4K Pro Image generation.</p>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-[11px] text-blue-500 hover:underline mt-1 block">
                  Learn about Gemini API Billing →
                </a>
              </div>
              <button 
                onClick={handleSelectKey}
                className={`px-6 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
                  hasPaidKey ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-black text-white'
                }`}
              >
                {hasPaidKey ? 'Key Active' : 'Select Paid Key'}
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">AI Configuration</h2>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[14px] font-medium">Quiet AI Protocol</h4>
                <p className="text-[12px] text-gray-400">Intelligence only triggers on explicit human focus.</p>
              </div>
              <div className="w-10 h-5 bg-black rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-gray-50 pt-6">
              <div>
                <h4 className="text-[14px] font-medium">Reasoning Budget</h4>
                <p className="text-[12px] text-gray-400">Tokens reserved for deep strategic thinking.</p>
              </div>
              <span className="text-[13px] font-medium">4,000 tokens</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">Audit Log (Human-in-the-Loop)</h2>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {auditLogs.length === 0 ? (
              <p className="p-8 text-[13px] text-gray-400 font-serif italic text-center">No AI-assisted actions recorded yet.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[13px] font-medium text-gray-900">{log.action}</span>
                    <span className="text-[10px] text-gray-300 tabular-nums">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-gray-400">
                    <span className="font-bold text-gray-500">{log.actor}</span>
                    <span className="opacity-40">on</span>
                    <span className="italic">{log.context}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPanel;
