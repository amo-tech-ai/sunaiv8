
import React from 'react';
import { useWizard, WizardStep } from '../../hooks/useWizard';
import Step1Basics from './steps/Step1Basics';
import Step2Scope from './steps/Step2Scope';
import Step3Constraints from './steps/Step3Constraints';
import Step4Review from './steps/Step4Review';
import Step5Processing from './steps/Step5Processing';
import Step6Proposal from './steps/Step6Proposal';
import WizardNavigation from './WizardNavigation';
import WizardLiveBlueprint from './WizardLiveBlueprint';

interface WizardLayoutProps {
  onCancel: () => void;
  onComplete: (blueprint: any) => void;
}

const STEP_LABELS: Record<WizardStep, string> = {
  basics: 'Identity',
  scope: 'Project Scope',
  constraints: 'Feasibility',
  review: 'Review & Gate',
  processing: 'AI Architect',
  proposal: 'Proposal Ready'
};

const WizardLayout: React.FC<WizardLayoutProps> = ({ onCancel, onComplete }) => {
  const { 
    currentStep, 
    currentStepIndex, 
    steps, 
    blueprint, 
    updateBlueprint, 
    nextStep, 
    prevStep, 
    goToStep,
    isSaving,
    resetWizard
  } = useWizard();

  // Validate current step to enable "Next"
  const canProceed = () => {
    if (currentStep === 'basics') {
      return (blueprint.basics?.projectName?.length || 0) > 2 && (blueprint.basics?.companyName?.length || 0) > 2;
    }
    if (currentStep === 'scope') {
      // Ensure scope object and properties exist
      return !!blueprint.scope?.appType && !!blueprint.scope?.industry && (blueprint.scope?.goals?.length || 0) > 5;
    }
    if (currentStep === 'constraints') {
      // Constraints usually have defaults, so mostly valid unless we enforce something specific
      return (blueprint.constraints?.budgetRange?.[1] || 0) > 0;
    }
    return true; // Review step proceeds via specific button
  };

  const handleGateTrigger = () => {
    updateBlueprint('status', 'processing');
    nextStep(); // Move to Step 5 (Processing)
  };

  const handleProcessingComplete = () => {
    updateBlueprint('status', 'complete');
    nextStep(); // Move to Step 6 (Proposal)
  };

  const handleLaunch = () => {
    onComplete(blueprint);
    resetWizard();
  };

  const handleRefine = (feedback: string) => {
    // Append feedback to goals and restart processing
    const updatedGoals = `${blueprint.scope.goals}\n\n[Refinement Request]: ${feedback}`;
    updateBlueprint('scope', { goals: updatedGoals });
    updateBlueprint('status', 'processing');
    goToStep(4); // Go back to Step 5 (Processing is index 4)
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'basics':
        return <Step1Basics blueprint={blueprint} onUpdate={updateBlueprint} />;
      case 'scope':
        return <Step2Scope blueprint={blueprint} onUpdate={updateBlueprint} />;
      case 'constraints':
        return <Step3Constraints blueprint={blueprint} onUpdate={updateBlueprint} />;
      case 'review':
        return <Step4Review 
          blueprint={blueprint} 
          onUpdate={updateBlueprint} 
          onGenerate={handleGateTrigger}
          onEditStep={goToStep}
        />;
      case 'processing':
        return <Step5Processing 
          blueprint={blueprint} 
          onUpdate={updateBlueprint} 
          onComplete={handleProcessingComplete}
        />;
      case 'proposal':
        return <Step6Proposal 
          blueprint={blueprint} 
          onLaunch={handleLaunch}
          onRefine={handleRefine}
        />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-2xl border border-gray-100">
              {currentStepIndex + 1}
            </div>
            <h2 className="font-serif text-3xl text-gray-900">{STEP_LABELS[currentStep]}</h2>
            <p className="text-gray-400 max-w-md">Step content coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden">
      {/* LEFT PANEL: Navigation Stepper */}
      <WizardNavigation 
        steps={steps}
        currentStepIndex={currentStepIndex}
        blueprintStatus={blueprint.status}
        isSaving={isSaving}
        stepLabels={STEP_LABELS}
        onCancel={onCancel}
        onStepClick={goToStep}
      />

      {/* CENTER PANEL: Work Surface */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto pt-16 px-12 pb-12">
            {renderContent()}
        </div>

        {/* Footer Navigation - Hidden for Processing and Proposal steps as they have their own controls */}
        {currentStep !== 'review' && currentStep !== 'processing' && currentStep !== 'proposal' && (
          <div className="h-24 border-t border-gray-200 bg-white flex items-center justify-between px-12 shrink-0">
              <button 
                  onClick={prevStep} 
                  disabled={currentStepIndex === 0}
                  className="text-[12px] font-bold uppercase tracking-widest text-gray-400 hover:text-black disabled:opacity-30 transition-all"
              >
                  Back
              </button>
              <div className="flex items-center space-x-6">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Next Step</span>
                    <span className="text-[12px] font-bold text-gray-900">{steps[currentStepIndex + 1] ? STEP_LABELS[steps[currentStepIndex + 1]] : 'Finish'}</span>
                  </div>
                  <button 
                      onClick={nextStep}
                      disabled={!canProceed() || currentStepIndex === steps.length - 1}
                      className="bg-black text-white px-8 py-4 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
                  >
                      Continue →
                  </button>
              </div>
          </div>
        )}
      </main>

      {/* RIGHT PANEL: Live Blueprint */}
      <WizardLiveBlueprint blueprint={blueprint} />
    </div>
  );
};

export default WizardLayout;
