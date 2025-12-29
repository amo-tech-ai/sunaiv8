
import React from 'react';
import { WizardBlueprint } from '../../../hooks/useWizard';

interface Step4ReviewProps {
  blueprint: WizardBlueprint;
  onUpdate: (section: keyof WizardBlueprint, data: any) => void;
  onGenerate: () => void;
  onEditStep: (stepIdx: number) => void;
}

const Step4Review: React.FC<Step4ReviewProps> = ({ blueprint, onGenerate, onEditStep }) => {
  
  const handleLockAndGenerate = () => {
    onGenerate();
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-10 text-center">
        <div className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 rounded-full mb-4">
           <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700">Controller Gate</span>
        </div>
        <h2 className="font-serif text-3xl text-gray-900 mb-2">Review & Authorize</h2>
        <p className="text-gray-500 text-[14px]">Confirm the prompt before initializing the AI Architect Swarm.</p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Identity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
          <button 
            onClick={() => onEditStep(0)}
            className="absolute top-6 right-6 text-[10px] uppercase font-bold text-gray-300 hover:text-black transition-colors"
          >
            Edit
          </button>
          <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-4">01. Identity</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-[10px] text-gray-400 uppercase">Project</span>
              <span className="text-[14px] font-medium text-gray-900">{blueprint.basics.projectName}</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-400 uppercase">Client</span>
              <span className="text-[14px] font-medium text-gray-900">{blueprint.basics.companyName}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Scope */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
          <button 
            onClick={() => onEditStep(1)}
            className="absolute top-6 right-6 text-[10px] uppercase font-bold text-gray-300 hover:text-black transition-colors"
          >
            Edit
          </button>
          <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-4">02. Scope Definition</h3>
          <div className="space-y-4">
            <div className="flex space-x-4">
               <span className="px-3 py-1 bg-gray-100 rounded text-[12px] font-bold text-gray-600">{blueprint.scope.appType}</span>
               <span className="px-3 py-1 bg-gray-100 rounded text-[12px] font-bold text-gray-600">{blueprint.scope.industry}</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-400 uppercase mb-1">Primary Objective</span>
              <p className="text-[13px] text-gray-600 font-serif italic leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                "{blueprint.scope.goals}"
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Constraints */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
          <button 
            onClick={() => onEditStep(2)}
            className="absolute top-6 right-6 text-[10px] uppercase font-bold text-gray-300 hover:text-black transition-colors"
          >
            Edit
          </button>
          <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-4">03. Feasibility Constraints</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
                <span className="block text-[10px] text-gray-400 uppercase mb-1">Budget Cap</span>
                <span className="text-[16px] font-serif font-bold text-gray-900">${blueprint.constraints.budgetRange[1].toLocaleString()}</span>
             </div>
             <div>
                <span className="block text-[10px] text-gray-400 uppercase mb-1">Timeline</span>
                <span className={`text-[12px] font-bold px-2 py-1 rounded inline-block ${
                  blueprint.constraints.timelineUrgency === 'Critical' ? 'bg-red-50 text-red-600' : 
                  blueprint.constraints.timelineUrgency === 'High' ? 'bg-amber-50 text-amber-600' : 
                  'bg-blue-50 text-blue-600'
                }`}>
                  {blueprint.constraints.timelineUrgency} Velocity
                </span>
             </div>
             <div>
                <span className="block text-[10px] text-gray-400 uppercase mb-1">Stack</span>
                <span className="text-[12px] text-gray-600">
                  {blueprint.constraints.techStackPref && blueprint.constraints.techStackPref.length > 0 
                    ? blueprint.constraints.techStackPref.join(', ') 
                    : 'Open Recommendation'}
                </span>
             </div>
          </div>
        </div>

        {/* Action Gate */}
        <div className="pt-8">
          <button 
            onClick={handleLockAndGenerate}
            className="w-full py-5 bg-black text-white rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl active:scale-[0.99] group"
          >
            <span className="text-xl">🔒</span>
            <span className="text-[13px] font-bold uppercase tracking-widest">Lock Blueprint & Generate Architecture</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <p className="text-center text-[11px] text-gray-400 mt-4">
            This will trigger the Researcher, Planner, and Analyst agents.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step4Review;
