
import { Contact, ResearchResult, MarketReport, ProjectPlan, FocusState } from '../types';
import { deepResearchContact, conductMarketAnalysis, generateProjectPlan } from './geminiService';

interface OrchestratorCallbacks {
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  setAgents: React.Dispatch<React.SetStateAction<any>>;
  setOrchestratorStatus: (status: string) => void;
  setFocus: React.Dispatch<React.SetStateAction<FocusState>>;
  addNotification: (msg: string, type?: 'info' | 'success' | 'error') => void;
  handleAuditAction: (action: string, context: string) => void;
}

/**
 * Manages the sequential handoff between Research, Market Analysis, and Project Planning agents.
 */
export const runDeepResearchOrchestration = async (
  leadId: string,
  contacts: Contact[],
  userLocation: { lat: number; lng: number } | undefined,
  focus: FocusState,
  callbacks: OrchestratorCallbacks
) => {
  const contact = contacts.find(c => c.id === leadId);
  if (!contact) return;

  // 1. Research Initiation
  callbacks.setContacts(prev => prev.map(c => c.id === leadId ? { ...c, isResearching: true } : c));
  callbacks.setAgents(prev => ({ ...prev, research: 'Running' }));
  callbacks.setOrchestratorStatus(`Researcher: Analyzing ${contact.company}...`);

  try {
    // 2. Deep Web Research
    const research = await deepResearchContact(contact);
    if (!research) throw new Error("Research agent returned empty results.");

    // 3. Market Analysis (Search + Maps Grounding)
    const report = await conductMarketAnalysis(contact, userLocation);
    const updatedResearch: ResearchResult = { ...research, agentReport: report || undefined };
    
    callbacks.setContacts(prev => prev.map(c => {
      if (c.id === leadId) {
        const updated = { ...c, researchData: updatedResearch, isResearching: false };
        if (focus.id === leadId) callbacks.setFocus(f => ({ ...f, data: updated }));
        return updated;
      }
      return c;
    }));

    // 4. Planner Agent (Roadmap Generation)
    if (report) {
      callbacks.setAgents(prev => ({ ...prev, research: 'Idle', planning: 'Running' }));
      callbacks.setOrchestratorStatus(`Planner: Synthesizing roadmap...`);
      const plan = await generateProjectPlan(contact, report);
      
      callbacks.setContacts(prev => prev.map(c => {
        if (c.id === leadId) {
          const updated = { ...c, proposedPlan: plan || undefined, isPlanning: false };
          if (focus.id === leadId) callbacks.setFocus(f => ({ ...f, data: updated }));
          return updated;
        }
        return c;
      }));
    }

    callbacks.handleAuditAction('Research & Planning Cycle Finished', contact.company);
    callbacks.addNotification(`Intelligence cycle complete for ${contact.company}`, 'success');

  } catch (e) {
    console.error("Orchestration Error:", e);
    callbacks.addNotification("Agent orchestration interrupted.", "error");
  } finally {
    callbacks.setContacts(prev => prev.map(c => c.id === leadId ? { ...c, isResearching: false, isPlanning: false } : c));
    callbacks.setAgents({ research: 'Idle', planning: 'Idle', automation: 'Idle' });
    callbacks.setOrchestratorStatus('Idle');
  }
};
