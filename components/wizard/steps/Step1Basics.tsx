
import React, { useState } from 'react';
import { WizardBlueprint } from '../../../hooks/useWizard';

interface Step1BasicsProps {
  blueprint: WizardBlueprint;
  onUpdate: (section: keyof WizardBlueprint, data: any) => void;
}

const Step1Basics: React.FC<Step1BasicsProps> = ({ blueprint, onUpdate }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleWebsiteBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.length > 4) {
      setIsScanning(true);
      // Mock "Retriever Agent" scanning the site
      setTimeout(() => setIsScanning(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="font-serif text-3xl text-gray-900 mb-2">Let's start with the basics.</h2>
        <p className="text-gray-500 text-[14px]">Who are we building for?</p>
      </div>

      <div className="space-y-8">
        {/* Project Name */}
        <div className="group">
          <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2 group-focus-within:text-black transition-colors">
            Project Name
          </label>
          <input
            type="text"
            value={blueprint.basics.projectName}
            onChange={(e) => onUpdate('basics', { projectName: e.target.value })}
            placeholder="e.g. Athena Dashboard"
            className="w-full text-2xl font-serif border-b border-gray-200 py-2 outline-none focus:border-black bg-transparent placeholder-gray-200 transition-all"
            autoFocus
          />
        </div>

        {/* Client / Company */}
        <div className="group">
          <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2 group-focus-within:text-black transition-colors">
            Client / Company
          </label>
          <input
            type="text"
            value={blueprint.basics.companyName}
            onChange={(e) => onUpdate('basics', { companyName: e.target.value })}
            placeholder="e.g. Acme Corp"
            className="w-full text-lg border-b border-gray-200 py-2 outline-none focus:border-black bg-transparent placeholder-gray-300 transition-all"
          />
        </div>

        {/* Website & Scanner */}
        <div className="group relative">
          <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2 group-focus-within:text-black transition-colors">
            Existing Website (Optional)
          </label>
          <div className="relative">
            <input
              type="url"
              value={blueprint.basics.website || ''}
              onChange={(e) => onUpdate('basics', { website: e.target.value })}
              onBlur={handleWebsiteBlur}
              placeholder="https://..."
              className="w-full text-lg border-b border-gray-200 py-2 outline-none focus:border-black bg-transparent placeholder-gray-300 transition-all pr-12"
            />
            {isScanning && (
              <div className="absolute right-0 top-2 flex items-center space-x-2 text-emerald-500 animate-pulse">
                <span className="text-[10px] font-bold uppercase tracking-widest">Scanning</span>
                <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            We'll scan this to auto-detect industry and brand voice later.
          </p>
        </div>
        
        {/* Contact Name (Optional) */}
        <div className="group">
          <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2 group-focus-within:text-black transition-colors">
            Point of Contact
          </label>
          <input
            type="text"
            value={blueprint.basics.contactName}
            onChange={(e) => onUpdate('basics', { contactName: e.target.value })}
            placeholder="e.g. Jane Doe"
            className="w-full text-lg border-b border-gray-200 py-2 outline-none focus:border-black bg-transparent placeholder-gray-300 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default Step1Basics;
