
import React from 'react';
import { WizardBlueprint } from '../../../hooks/useWizard';

interface Step2ScopeProps {
  blueprint: WizardBlueprint;
  onUpdate: (section: keyof WizardBlueprint, data: any) => void;
}

const APP_TYPES = [
  { 
    id: 'SaaS', 
    label: 'SaaS Platform', 
    desc: 'Multi-tenant web application',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
    )
  },
  { 
    id: 'Marketplace', 
    label: 'Marketplace', 
    desc: 'Two-sided commerce platform',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
    )
  },
  { 
    id: 'Internal Tool', 
    label: 'Internal Tool', 
    desc: 'Admin dashboard or workflow',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
    )
  },
  { 
    id: 'AI Wrapper', 
    label: 'AI Wrapper', 
    desc: 'LLM-based product or agent',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
    )
  },
];

const INDUSTRIES = [
  'E-commerce & Retail', 'Fintech & Banking', 'Healthcare & Medtech', 
  'Real Estate & Proptech', 'SaaS / B2B', 'Media & Entertainment', 'Other'
];

const COMMON_INTEGRATIONS = [
  'Stripe', 'OpenAI', 'Salesforce', 'Slack', 
  'Google Maps', 'SendGrid', 'Twilio', 'HubSpot', 'Supabase'
];

const Step2Scope: React.FC<Step2ScopeProps> = ({ blueprint, onUpdate }) => {
  
  const toggleIntegration = (item: string) => {
    const current = blueprint.scope.integrations || [];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    onUpdate('scope', { integrations: updated });
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl text-gray-900 mb-2">What are we building?</h2>
        <p className="text-gray-500 text-[14px]">Define the core architecture.</p>
      </div>

      <div className="space-y-12">
        {/* App Type Selection */}
        <section>
          <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-4 text-center">
            Application Topology
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {APP_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => onUpdate('scope', { appType: type.id })}
                className={`p-6 rounded-2xl border text-left transition-all duration-300 group hover:-translate-y-1 ${
                  blueprint.scope.appType === type.id
                    ? 'bg-black border-black text-white shadow-xl'
                    : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className={`mb-4 ${blueprint.scope.appType === type.id ? 'text-emerald-400' : 'text-gray-400 group-hover:text-black'}`}>
                  {type.icon}
                </div>
                <h3 className="font-bold text-[14px] mb-1">{type.label}</h3>
                <p className={`text-[11px] ${blueprint.scope.appType === type.id ? 'text-gray-400' : 'text-gray-400'}`}>
                  {type.desc}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Industry & Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section className="space-y-6">
             <div className="group">
                <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2">
                  Target Industry
                </label>
                <select
                  value={blueprint.scope.industry}
                  onChange={(e) => onUpdate('scope', { industry: e.target.value })}
                  className="w-full bg-transparent border-b border-gray-200 py-2 outline-none focus:border-black text-[15px] font-medium appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Sector...</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
             </div>

             <div className="group">
                <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2">
                  Preferred Integrations
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_INTEGRATIONS.map(item => (
                    <button
                      key={item}
                      onClick={() => toggleIntegration(item)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                        blueprint.scope.integrations?.includes(item)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
             </div>
          </section>

          <section className="group">
            <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2 group-focus-within:text-black transition-colors">
              Primary Success Metric
            </label>
            <textarea
              value={blueprint.scope.goals}
              onChange={(e) => onUpdate('scope', { goals: e.target.value })}
              placeholder="What does success look like? e.g. 'MVP launch in 4 weeks to validate market fit.'"
              className="w-full h-32 bg-gray-50 rounded-xl p-4 text-[14px] leading-relaxed border border-transparent focus:border-gray-200 outline-none resize-none transition-all placeholder-gray-400"
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Step2Scope;
