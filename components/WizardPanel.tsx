import React, { useState } from 'react';
import { Contact, Project, PipelineStage, ProjectType } from '../types';
import { enrichLeadData } from '../services/geminiService';

type WizardType = 'project' | 'lead';

interface WizardPanelProps {
  onAddLead: (lead: Contact) => void;
  onAddProject: (project: Project) => void;
}

const WizardPanel: React.FC<WizardPanelProps> = ({ onAddLead, onAddProject }) => {
  const [wizardType, setWizardType] = useState<WizardType>('project');
  const [step, setStep] = useState(0); 
  const [formData, setFormData] = useState<any>({});
  const [enrichUrl, setEnrichUrl] = useState('');
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichedFields, setEnrichedFields] = useState<string[]>([]);
  const totalSteps = 4;

  const handleComplete = () => {
    if (wizardType === 'lead') {
      const newLead: Contact = {
        id: `c-${Date.now()}`,
        name: formData.contactName || 'New Contact',
        company: formData.companyName || 'New Company',
        role: formData.role || 'Stakeholder',
        lastContact: 'Today',
        status: 'Lead',
        category: (formData.category as any) || 'Designer',
        engagementType: formData.interest || 'General',
        dealValue: formData.value || '$25k',
        score: 75,
        pipelineStage: 'Discovery',
        bio: formData.bio || 'Recently added via onboarding wizard.',
        interactions: [],
        deals: [],
        placements: []
      };
      onAddLead(newLead);
    } else {
      const newProject: Project = {
        id: `p-${Date.now()}`,
        name: formData.projectName || 'New Engagement',
        client: formData.clientName || 'Existing Client',
        type: (formData.type as ProjectType) || 'Web',
        phase: 'Kickoff',
        duration: `${formData.duration || 8} weeks`,
        status: 'On Track',
        description: formData.description || 'Project initiated via AI wizard.'
      };
      onAddProject(newProject);
    }
  };

  const handleEnrich = async () => {
    if (!enrichUrl.trim()) return;
    setIsEnriching(true);
    setEnrichedFields([]);
    
    const query = `${enrichUrl} ${formData.companyName || ''}`.trim();
    const result = await enrichLeadData(query, formData.contactName);
    
    if (result) {
      const newFields: string[] = [];
      const updatedData = { ...formData };

      if (result.industry) {
        updatedData.industry = result.industry;
        newFields.push('industry');
      }
      if (result.companyDescription) {
        updatedData.bio = `${result.industry ? `[${result.industry}] ` : ''}${result.companyDescription}`;
        newFields.push('bio');
      }
      if (result.keyFocus) {
        updatedData.interest = result.keyFocus;
        newFields.push('interest');
      }
      if (result.suggestedValue) {
        updatedData.value = result.suggestedValue;
        newFields.push('value');
      }
      if (result.contactPosition) {
        updatedData.role = result.contactPosition;
        newFields.push('role');
      }

      setFormData(updatedData);
      setEnrichedFields(newFields);
      
      setTimeout(() => {
        setStep(3);
        setIsEnriching(false);
      }, 800);
    } else {
      setIsEnriching(false);
    }
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
          <h2 className="font-serif text-3xl text-center mb-8">What are we initiating?</h2>
          <div className="grid grid-cols-2 gap-6">
            <button 
              onClick={() => { setWizardType('project'); setStep(1); }}
              className="p-8 border border-gray-100 rounded-2xl hover:border-black hover:shadow-xl transition-all group text-left"
            >
              <span className="text-2xl mb-4 block">🏗️</span>
              <h3 className="font-medium text-lg mb-2">New Engagement</h3>
              <p className="text-sm text-gray-400">Launch a structured project for an existing client.</p>
            </button>
            <button 
              onClick={() => { setWizardType('lead'); setStep(1); }}
              className="p-8 border border-gray-100 rounded-2xl hover:border-black hover:shadow-xl transition-all group text-left"
            >
              <span className="text-2xl mb-4 block">🤝</span>
              <h3 className="font-medium text-lg mb-2">CRM Opportunity</h3>
              <p className="text-sm text-gray-400">Capture a potential lead and analyze buying intent.</p>
            </button>
          </div>
        </div>
      );
    }

    if (wizardType === 'lead') {
      switch(step) {
        case 1:
          return (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl">Stakeholder Identification</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold block mb-2">Company Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 outline-none focus:border-black" 
                    placeholder="e.g. Acme Corp" 
                    value={formData.companyName || ''}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold block mb-2">Primary Contact</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 outline-none focus:border-black" 
                    placeholder="Jane Doe" 
                    value={formData.contactName || ''}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  />
                </div>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl">Intelligence Enrichment</h2>
              <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl space-y-4">
                <p className="text-[13px] text-gray-500 font-serif italic">Provide a URL or LinkedIn profile. Gemini will research the company's industry, position, and background to pre-fill the next steps.</p>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 outline-none focus:border-black pr-10" 
                    placeholder="https://linkedin.com/in/... or company.com" 
                    value={enrichUrl}
                    onChange={(e) => setEnrichUrl(e.target.value)}
                  />
                  {isEnriching && (
                    <div className="absolute right-3 top-3.5">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={handleEnrich}
                    disabled={isEnriching || !enrichUrl}
                    className="bg-black text-white px-6 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    {isEnriching ? 'Researching...' : 'Enable AI Enrichment'}
                  </button>
                </div>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-2xl">Refine Parameters</h2>
                {enrichedFields.length > 0 && (
                  <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 uppercase font-bold tracking-tighter">AI Enriched</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold block mb-2">
                    Estimated Value {enrichedFields.includes('value') && '✨'}
                  </label>
                  <input 
                    type="text" 
                    className={`w-full bg-white border rounded-lg p-3 transition-colors ${enrichedFields.includes('value') ? 'border-emerald-200 bg-emerald-50/10' : 'border-gray-200'}`} 
                    placeholder="$50k" 
                    value={formData.value || ''}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold block mb-2">
                    Role / Position {enrichedFields.includes('role') && '✨'}
                  </label>
                  <input 
                    type="text" 
                    className={`w-full bg-white border rounded-lg p-3 transition-colors ${enrichedFields.includes('role') ? 'border-emerald-200 bg-emerald-50/10' : 'border-gray-200'}`} 
                    placeholder="e.g. CTO" 
                    value={formData.role || ''}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold block mb-2">
                  Category
                </label>
                <select 
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 outline-none focus:border-black"
                  value={formData.category || 'Designer'}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Designer">Designer</option>
                  <option value="Buyer">Buyer</option>
                  <option value="Press">Press</option>
                  <option value="Sponsor">Sponsor</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold block mb-2">
                  Context, Industry & Background {enrichedFields.includes('bio') && '✨'}
                </label>
                <textarea 
                   className={`w-full bg-white border rounded-lg p-3 outline-none h-32 text-[13px] leading-relaxed transition-colors ${enrichedFields.includes('bio') ? 'border-emerald-200 bg-emerald-50/10' : 'border-gray-200'}`} 
                   placeholder="Brief background on the company and contact experience..."
                   value={formData.bio || ''}
                   onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            </div>
          );
        case 4:
          return (
            <div className="space-y-6 text-center">
              <h2 className="font-serif text-2xl">Ready for Pipeline</h2>
              <div className="max-w-md mx-auto">
                <p className="text-[14px] text-gray-500 font-serif italic mb-8 line-clamp-4">
                  {formData.bio ? `"${formData.bio}"` : '"New lead ready for strategic discovery."'}
                </p>
              </div>
              <div className="p-4 bg-emerald-50 text-emerald-700 text-[12px] rounded-lg inline-block mx-auto border border-emerald-100">
                Lead will be added to the Discovery stage.
              </div>
            </div>
          );
      }
    }

    // Project Wizard
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl">Client & Strategy</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold block mb-2">Client Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 outline-none focus:border-black" 
                  placeholder="e.g. Maison Laurent" 
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold block mb-2">Project Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 outline-none focus:border-black" 
                  placeholder="e.g. Q4 Digital Transformation" 
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl">Scope & Services</h2>
            <div className="grid grid-cols-2 gap-4">
              {['AI', 'Web App', 'E-commerce', 'Web'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setFormData({...formData, type: s})}
                  className={`p-4 border rounded-xl transition-all text-left ${formData.type === s ? 'border-black ring-1 ring-black/5 bg-white' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                >
                  <span className="block text-[14px] font-medium">{s}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl">Timeline & Investment</h2>
            <div className="flex space-x-6">
              <div className="flex-1">
                <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold block mb-2">Duration (Weeks)</label>
                <input 
                  type="number" 
                  className="w-full bg-white border border-gray-200 rounded-lg p-3" 
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
              <div className="flex-1">
                <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold block mb-2">Budget Range</label>
                <select className="w-full bg-white border border-gray-200 rounded-lg p-3">
                  <option>$25k - $50k</option>
                  <option>$50k - $100k</option>
                  <option>$100k+</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl">AI Summary Review</h2>
            <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl font-serif italic text-gray-600 leading-relaxed">
              "Based on the input, this {formData.type || 'project'} requires a {formData.duration || 'standard'} week high-impact strategy phase followed by digital production."
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-12 bg-[#fafafa]">
      <div className="max-w-2xl w-full">
        {step > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-end mb-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold">Step {step} of {totalSteps}</span>
              <span className="text-[13px] font-medium">{wizardType === 'project' ? 'Engagement Setup' : 'Lead Capture'}</span>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-500 ease-out"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="min-h-[400px] flex flex-col justify-center">
          {renderStep()}
        </div>

        {step > 0 && (
          <div className="flex justify-between mt-12">
            <button 
              onClick={() => step === 1 ? setStep(0) : setStep(s => Math.max(1, s - 1))}
              className="text-[12px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button 
              onClick={() => step === totalSteps ? handleComplete() : setStep(s => Math.min(totalSteps, s + 1))}
              className="bg-black text-white px-8 py-3 rounded-lg text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
            >
              {step === totalSteps ? 'Complete' : 'Next Step'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WizardPanel;