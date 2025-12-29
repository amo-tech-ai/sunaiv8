
import { useState, useEffect, useCallback } from 'react';

export type WizardStep = 'basics' | 'scope' | 'constraints' | 'review' | 'processing' | 'proposal';

export interface WizardBlueprint {
  id: string;
  basics: {
    projectName: string;
    contactName: string;
    companyName: string;
    website?: string;
  };
  scope: {
    appType: string; // 'SaaS', 'Marketplace', etc.
    industry: string;
    goals: string;
    integrations: string[];
  };
  constraints: {
    budgetRange: number[]; // [min, max]
    timelineUrgency: 'Normal' | 'High' | 'Critical';
    deadline?: string;
    techStackPref: string[];
  };
  status: 'draft' | 'locked' | 'processing' | 'complete';
  artifacts?: any; // Place for AI outputs later
}

const INITIAL_BLUEPRINT: WizardBlueprint = {
  id: '',
  basics: { projectName: '', contactName: '', companyName: '' },
  scope: { appType: '', industry: '', goals: '', integrations: [] },
  constraints: { budgetRange: [10000, 50000], timelineUrgency: 'Normal', techStackPref: [] },
  status: 'draft'
};

const STEPS: WizardStep[] = ['basics', 'scope', 'constraints', 'review', 'processing', 'proposal'];
const STORAGE_KEY = 'sun_wizard_draft';

export function useWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.stepIndex || 0;
      }
    } catch (e) {}
    return 0;
  });

  const [blueprint, setBlueprint] = useState<WizardBlueprint>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.blueprint || { ...INITIAL_BLUEPRINT, id: `draft-${Date.now()}` };
      }
    } catch (e) {}
    return { ...INITIAL_BLUEPRINT, id: `draft-${Date.now()}` };
  });

  const [isSaving, setIsSaving] = useState(false);

  // Persistence Effect
  useEffect(() => {
    const saveState = () => {
      setIsSaving(true);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          blueprint,
          stepIndex: currentStepIndex
        }));
      } catch (e) {
        console.error("Failed to save wizard draft", e);
      }
      setTimeout(() => setIsSaving(false), 600);
    };

    const timer = setTimeout(saveState, 1000);
    return () => clearTimeout(timer);
  }, [blueprint, currentStepIndex]);

  const updateBlueprint = useCallback((section: keyof WizardBlueprint, data: any) => {
    setBlueprint(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const goToStep = useCallback((stepIndex: number) => {
    // Allow navigation if we are in 'complete' or 'proposal' or 'processing' states, 
    // or if simply moving back/validating.
    if (stepIndex <= currentStepIndex || stepIndex < 4 || blueprint.status === 'complete') { 
        setCurrentStepIndex(stepIndex);
    }
  }, [currentStepIndex, blueprint.status]);

  const resetWizard = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setBlueprint({ ...INITIAL_BLUEPRINT, id: `draft-${Date.now()}` });
    setCurrentStepIndex(0);
  }, []);

  return {
    currentStep: STEPS[currentStepIndex],
    currentStepIndex,
    totalSteps: STEPS.length,
    steps: STEPS,
    blueprint,
    updateBlueprint,
    nextStep,
    prevStep,
    goToStep,
    isSaving,
    resetWizard
  };
}
