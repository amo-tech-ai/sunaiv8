
import React, { useState, useEffect, useCallback } from 'react';
import LeftPanel from './components/LeftPanel';
import MainPanel from './components/MainPanel';
import ProjectsPanel from './components/ProjectsPanel';
import ServicesPanel from './components/ServicesPanel';
import CRMPanel from './components/CRMPanel';
import TasksPanel from './components/TasksPanel';
import WizardPanel from './components/WizardPanel';
import SettingsPanel from './components/SettingsPanel';
import ClientDashboardPanel from './components/ClientDashboardPanel';
import RightPanel from './components/RightPanel';
import MarketReportView from './components/MarketReportView';
import ContextStrip from './components/ContextStrip';
import AssistantChatbot from './components/AssistantChatbot';
import ErrorBoundary from './components/ErrorBoundary';

// Custom Hooks
import { usePersistentState } from './hooks/usePersistentState';
import { useFocus } from './hooks/useFocus';
import { useOrchestrator } from './hooks/useOrchestrator';
import { useNotifications } from './hooks/useNotifications';

// Logic Services
import { updateContactInList, applyEnrichmentLogic, logInteractionLogic } from './services/contactService';
import { createNewTask, updateTaskStatusInList } from './services/taskService';
import { runDeepResearchOrchestration } from './services/orchestratorService';

// Types & Services
import { Contact, Project, AuditLog, PipelineStage, ActionItem, Interaction, Deal, EnrichmentSuggestion } from './types';
import { NAV_ITEMS, MOCK_CONTACTS, MOCK_PROJECTS, NEXT_ACTIONS } from './constants';
import { 
  calculateBudgetProjections, 
  conductMarketAnalysis, 
  enrichLeadData 
} from './services/geminiService';

const App: React.FC = () => {
  // Navigation & Location
  const [activeRoute, setActiveRoute] = useState('Main');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);

  // Hook-managed State
  const [contacts, setContacts] = usePersistentState<Contact[]>('sun_contacts', MOCK_CONTACTS);
  const [projects, setProjects] = usePersistentState<Project[]>('sun_projects', MOCK_PROJECTS);
  const [tasks, setTasks] = usePersistentState<ActionItem[]>('sun_tasks', NEXT_ACTIONS);
  const [auditLogs, setAuditLogs] = usePersistentState<AuditLog[]>('sun_audit', []);
  
  const { focus, setFocus, history, updateFocus } = useFocus();
  const { notifications, addNotification } = useNotifications();
  const { 
    orchestratorStatus, setOrchestratorStatus, 
    agents, setAgents, 
    viewingReportId, setViewingReportId 
  } = useOrchestrator();

  // Location Capture
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.warn("Location permission denied. Grounding fallback to global.")
      );
    }
  }, []);

  // Global Actions
  const handleNavigate = (routeName: string) => {
    setActiveRoute(routeName);
    updateFocus(null, null);
  };

  const handleAuditAction = useCallback((action: string, context: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      actor: 'Julian Smith',
      context
    };
    setAuditLogs(prev => [newLog, ...prev]);
    addNotification(`${action}: ${context}`, 'success');
  }, [addNotification, setAuditLogs]);

  const handleAddTask = useCallback((taskData: Partial<ActionItem>) => {
    const newTask = createNewTask(taskData);
    setTasks(prev => [newTask, ...prev]);
  }, [setTasks]);

  // Fix: Implemented handleAddContact to avoid using createNewTask for contacts and resolve type mismatch
  const handleAddContact = useCallback((contactData: Partial<Contact>) => {
    const newContact: Contact = {
      id: `c-${Date.now()}`,
      name: contactData.name || 'Unknown Contact',
      role: 'New Lead',
      company: contactData.company || 'Unknown Entity',
      lastContact: 'Just now',
      status: contactData.status || 'Active',
      category: contactData.category || 'Designer',
      pipelineStage: 'Discovery',
      score: 50,
      bio: 'New relationship captured via Dashboard intake.',
      interactions: [],
      deals: [],
      placements: [],
      ...contactData
    };
    setContacts(prev => [newContact, ...prev]);
    handleAuditAction('Contact Intake', `Added new ${newContact.category}: ${newContact.company}`);
  }, [handleAuditAction, setContacts]);

  const handleUpdateLeadStage = useCallback((leadId: string, nextStage: PipelineStage) => {
    setContacts(prev => updateContactInList(prev, leadId, { pipelineStage: nextStage }, focus, setFocus));
  }, [focus, setContacts, setFocus]);

  // Orchestrator Actions (Agentic Workflows)
  const handleDeepResearchLead = async (leadId: string) => {
    await runDeepResearchOrchestration(leadId, contacts, userLocation, focus, {
      setContacts, setAgents, setOrchestratorStatus, setFocus, addNotification, handleAuditAction
    });
  };

  const handleApprovePlan = (leadId: string) => {
    const contact = contacts.find(c => c.id === leadId);
    if (!contact || !contact.proposedPlan) return;

    contact.proposedPlan.milestones.forEach(m => {
      handleAddTask({
        title: `${m.week}: ${m.title}`,
        project: contact.company,
        priority: m.effort === 'High' ? 'High' : 'Medium',
        description: m.description,
        status: 'Backlog',
        linkedEntityId: contact.id,
        linkedEntityType: 'contact'
      });
    });

    handleUpdateLeadStage(leadId, 'Proposal');
    setContacts(prev => updateContactInList(prev, leadId, { proposedPlan: undefined }, focus, setFocus));
    handleAuditAction('Roadmap Approved', contact.company);
  };

  const handleApplyEnrichment = (leadId: string, fields: Partial<EnrichmentSuggestion>) => {
    setContacts(prev => applyEnrichmentLogic(prev, leadId, fields, focus, setFocus));
    handleAuditAction('Lead Enrichment Applied', leadId);
  };

  const handleTriggerEnrichment = async (leadId: string) => {
    const contact = contacts.find(c => c.id === leadId);
    if (!contact) return;
    setContacts(prev => updateContactInList(prev, leadId, { isProcessing: true }, focus, setFocus));
    setOrchestratorStatus(`Enriching ${contact.company}...`);
    try {
      const result = await enrichLeadData(contact.company, contact.name);
      setContacts(prev => updateContactInList(prev, leadId, { pendingEnrichment: result || undefined, isProcessing: false }, focus, setFocus));
      handleAuditAction('Enrichment Pulse Complete', contact.company);
    } catch (e) {
      addNotification("Enrichment service unavailable.", "error");
      setContacts(prev => updateContactInList(prev, leadId, { isProcessing: false }, focus, setFocus));
    } finally {
      setOrchestratorStatus('Idle');
    }
  };

  const handleApproveDraft = (leadId: string) => {
    setContacts(prev => {
      const contact = prev.find(c => c.id === leadId);
      if (contact?.pendingDraft) {
        handleAddTask({
          title: `Implement Approved ${contact.pendingDraft.type}`,
          project: contact.company,
          priority: 'High',
          status: 'In Progress',
          linkedEntityId: contact.id,
          linkedEntityType: 'contact'
        });
        return updateContactInList(prev, leadId, { 
          pendingDraft: { ...contact.pendingDraft, status: 'Approved' } 
        }, focus, setFocus);
      }
      return prev;
    });
    handleAuditAction('Workflow Draft Approved', leadId);
  };

  const handleVisualUpdate = (leadId: string, asset: string) => {
    setContacts(prev => {
      const contact = prev.find(c => c.id === leadId);
      const updatedDraft = contact?.pendingDraft 
        ? { ...contact.pendingDraft, visualAssets: [...(contact.pendingDraft.visualAssets || []), asset] }
        : { type: 'Brief' as const, content: 'AI Visuals Generated', status: 'Pending' as const, timestamp: new Date().toISOString(), visualAssets: [asset] };
      return updateContactInList(prev, leadId, { pendingDraft: updatedDraft }, focus, setFocus);
    });
    handleAuditAction('Creative Asset Added', leadId);
  };

  const handleMarketReportUpdate = async (leadId: string) => {
    const contact = contacts.find(c => c.id === leadId);
    if (!contact) return;
    setContacts(prev => updateContactInList(prev, leadId, { isResearching: true }, focus, setFocus));
    setOrchestratorStatus(`Refreshing analysis...`);
    try {
      const report = await conductMarketAnalysis(contact, userLocation);
      setContacts(prev => {
        const contact = prev.find(c => c.id === leadId);
        const updatedResearch = contact?.researchData ? { ...contact.researchData, agentReport: report || undefined } : undefined;
        return updateContactInList(prev, leadId, { researchData: updatedResearch as any, isResearching: false }, focus, setFocus);
      });
      handleAuditAction('Intelligence Report Refreshed', contact.company);
    } catch (e) {
      addNotification("Market analysis failed.", "error");
      setContacts(prev => updateContactInList(prev, leadId, { isResearching: false }, focus, setFocus));
    } finally {
      setOrchestratorStatus('Idle');
    }
  };

  const handleBudgetUpdate = async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    setContacts(prev => updateContactInList(prev, contactId, { isCalculating: true }, focus, setFocus));
    setAgents(prev => ({ ...prev, automation: 'Running' }));
    setOrchestratorStatus("Analyst: Calculating ROI...");
    try {
      const budget = await calculateBudgetProjections(contact);
      setContacts(prev => updateContactInList(prev, contactId, { budgetAnalysis: budget || undefined, isCalculating: false }, focus, setFocus));
      handleAuditAction('Financial ROI Recalculated', contact.company);
    } catch (e) {
      addNotification("ROI projection failed.", "error");
      setContacts(prev => updateContactInList(prev, contactId, { isCalculating: false }, focus, setFocus));
    } finally {
      setAgents(prev => ({ ...prev, automation: 'Idle' }));
      setOrchestratorStatus('Idle');
    }
  };

  const renderContent = () => {
    switch (activeRoute) {
      case 'Main': 
        return (
          <ErrorBoundary name="Dashboard Home">
            <MainPanel onFocusAction={updateFocus} focus={focus} orchestratorStatus={orchestratorStatus} agents={agents} auditLogs={auditLogs.slice(0, 5)} />
          </ErrorBoundary>
        );
      case 'Projects': 
        return (
          <ErrorBoundary name="Engagement Portfolio">
            <ProjectsPanel projects={projects} focus={focus} onFocus={updateFocus} onAddProject={(p) => setProjects(prev => [p as Project, ...prev])} />
          </ErrorBoundary>
        );
      case 'Tasks': 
        return (
          <ErrorBoundary name="Action Board">
            <TasksPanel 
              tasks={tasks} focus={focus} onFocus={updateFocus} 
              onUpdateTaskStatus={(id, s) => setTasks(prev => updateTaskStatusInList(prev, id, s))} 
              onDeleteTask={(id) => setTasks(prev => prev.filter(t => t.id !== id))} 
            />
          </ErrorBoundary>
        );
      case 'CRM': 
        return (
          <ErrorBoundary name="CRM Engine">
            <CRMPanel 
              contacts={contacts} focus={focus} onFocus={updateFocus} 
              onAddContact={handleAddContact} 
              onLogInteraction={(id, i) => setContacts(prev => logInteractionLogic(prev, id, i, focus, setFocus))} 
              onAddDeal={(id, d) => setContacts(prev => updateContactInList(prev, id, { deals: [d, ...(prev.find(c => c.id === id)?.deals || [])], dealValue: d.value }, focus, setFocus))} 
            />
          </ErrorBoundary>
        );
      case 'Services': 
        return (
          <ErrorBoundary name="Service Catalog">
            <ServicesPanel onFocus={updateFocus} focus={focus} />
          </ErrorBoundary>
        );
      case 'Client Dashboard': 
        return (
          <ErrorBoundary name="Client Portal">
            <ClientDashboardPanel projects={projects} />
          </ErrorBoundary>
        );
      case 'Settings': 
        return (
          <ErrorBoundary name="Workspace Settings">
            <SettingsPanel auditLogs={auditLogs} />
          </ErrorBoundary>
        );
      case 'AI Wizard': 
        return (
          <ErrorBoundary name="Intake Wizard">
            <WizardPanel onAddLead={(l) => { setContacts(prev => [l, ...prev]); setActiveRoute('CRM'); }} onAddProject={(p) => { setProjects(prev => [p, ...prev]); setActiveRoute('Projects'); }} />
          </ErrorBoundary>
        );
      default: 
        return (
          <ErrorBoundary name="Generic Content Wrapper">
            <MainPanel onFocusAction={updateFocus} focus={focus} />
          </ErrorBoundary>
        );
    }
  };

  return (
    <ErrorBoundary name="Agency Platform Root">
      <div className="flex h-screen w-full bg-[#fafafa] selection:bg-black selection:text-white overflow-hidden">
        <LeftPanel activeRoute={activeRoute} onNavigate={handleNavigate} navItems={NAV_ITEMS} />
        
        <div className="flex-1 flex overflow-hidden relative">
          {renderContent()}
          {viewingReportId && contacts.find(c => c.id === viewingReportId)?.researchData?.agentReport && (
            <ErrorBoundary name="Intelligence Report Viewer">
              <MarketReportView 
                contact={contacts.find(c => c.id === viewingReportId)!}
                report={contacts.find(c => c.id === viewingReportId)!.researchData!.agentReport!}
                onClose={() => setViewingReportId(null)}
                onGenerateTasks={(titles) => titles.forEach(t => handleAddTask({ title: t, project: 'AI Strategy', priority: 'Medium' }))}
                onMarketReportUpdate={() => handleMarketReportUpdate(viewingReportId)}
              />
            </ErrorBoundary>
          )}
        </div>

        {/* Global Notifications - Non-intrusive Overlay */}
        <div className="fixed top-8 right-8 z-[200] flex flex-col space-y-4 pointer-events-none">
          {notifications.map(n => (
            <div key={n.id} className={`px-6 py-4 rounded-2xl shadow-2xl border pointer-events-auto animate-in slide-in-from-right-12 duration-300 ${
              n.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
              n.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' :
              'bg-white border-gray-100 text-gray-800'
            }`}>
              <p className="text-[13px] font-medium">{n.message}</p>
            </div>
          ))}
        </div>

        <ErrorBoundary name="Context Intelligence Panel">
          <RightPanel 
            focus={focus} 
            history={history} 
            onFocusFromHistory={(h) => setFocus(h)}
            onAuditAction={handleAuditAction}
            onAddTask={handleAddTask}
            onUpdateLeadStage={handleUpdateLeadStage}
            onApplyEnrichment={handleApplyEnrichment}
            onTriggerEnrichment={handleTriggerEnrichment}
            onApproveDraft={handleApproveDraft}
            onVisualUpdate={handleVisualUpdate}
            onResearchUpdate={() => handleDeepResearchLead(focus.id!)}
            onMarketReportUpdate={handleMarketReportUpdate}
            onBudgetUpdate={handleBudgetUpdate}
            onApprovePlan={() => handleApprovePlan(focus.id!)}
            onOpenMarketReport={(id) => setViewingReportId(id)}
            onDeleteEntity={(id) => focus.type === 'contact' ? setContacts(prev => prev.filter(c => c.id !== id)) : focus.type === 'task' ? setTasks(prev => prev.filter(t => t.id !== id)) : null}
          />
        </ErrorBoundary>
        
        <ContextStrip focus={focus} />
        
        <ErrorBoundary name="AI Workspace Assistant">
          <AssistantChatbot workspace={{ contacts, projects }} />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default App;
