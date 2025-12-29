
import React from 'react';
import { WizardStep, WizardBlueprint } from '../../hooks/useWizard';

interface WizardNavigationProps {
  steps: WizardStep[];
  currentStepIndex: number;
  blueprintStatus: WizardBlueprint['status'];
  isSaving: boolean;
  stepLabels: Record<WizardStep, string>;
  onCancel: () => void;
  onStepClick: (index: number) => void;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  steps,
  currentStepIndex,
  blueprintStatus,
  isSaving,
  stepLabels,
  onCancel,
  onStepClick
}) => {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col p-8">
      <div className="mb-12">
        <button onClick={onCancel} className="text-[12px] text-gray-400 hover:text-black transition-colors mb-4 flex items-center">
          <span className="mr-1">←</span> Cancel
        </button>
        <h1 className="font-serif text-xl tracking-tight">Project Wizard</h1>
        <p className="text-[11px] text-gray-400 mt-1">AI-Assisted Onboarding</p>
      </div>

      <nav className="flex-1 space-y-1">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;
          
          return (
            <button
              key={step}
              onClick={() => isCompleted && onStepClick(idx)}
              disabled={(!isCompleted && idx !== currentStepIndex) || blueprintStatus === 'processing'}
              className={`w-full text-left py-3 px-3 rounded-lg flex items-center space-x-3 transition-all ${
                isActive 
                  ? 'bg-black text-white shadow-lg' 
                  : isCompleted 
                    ? 'text-gray-800 hover:bg-gray-50' 
                    : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border ${
                isActive ? 'border-white text-white' : isCompleted ? 'border-gray-800 text-gray-800' : 'border-gray-200'
              }`}>
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span className="text-[12px] font-medium uppercase tracking-wide">{stepLabels[step]}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100">
         <div className="flex items-center space-x-2 text-[10px] text-gray-400">
           <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-emerald-400 animate-pulse' : 'bg-gray-200'}`} />
           <span>{isSaving ? 'Autosaving...' : 'Draft Saved'}</span>
         </div>
      </div>
    </aside>
  );
};

export default WizardNavigation;
