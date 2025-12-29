
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

// Marketing Components
import LandingPage from './components/marketing/LandingPage';
import ServicesPage from './components/marketing/ServicesPage';
import AgentsPage from './components/marketing/AgentsPage';
import CaseStudiesPage from './components/marketing/CaseStudiesPage';
import AboutPage from './components/marketing/AboutPage';

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
import { Contact, Project, AuditLog, PipelineStage, ActionItem, Interaction, Deal, EnrichmentSuggestion, ProjectAnalysis } from './types';
import { NAV_ITEMS, MOCK_CONTACTS, MOCK_PROJECTS, NEXT_ACTIONS } from './constants';
import { 
  calculateBudgetProjections, 
  enrichLeadData,
  generateWorkflowDraft
} from './services/geminiService';

const App: React.FC = () => {
  // Navigation & Location
  const [activeRoute, setActiveRoute] = useState('Home');
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

  // Mode Detection: Marketing vs Dashboard
  const isMarketingMode = useMemo(() => {
    const marketingRoutes = ['Home', 'Public Services', 'AI Agents', 'Work', 'Booking', 'About'];
    return marketingRoutes.includes(activeRoute);
  }, [activeRoute]);

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
    // Smooth scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleAddTasks = useCallback((tasksData: Partial<ActionItem>[]) => {
    const newTasks = tasksData.map(t => createNewTask(t));
    setTasks(prev => [...newTasks, ...prev]);
    handleAuditAction('Batch Task Creation', `${newTasks.length} tasks added`);
  }, [setTasks, handleAuditAction]);

  const handleUpdateTask = useCallback((taskId: string, updates: Partial<ActionItem>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  }, [setTasks]);

  const handleLinkTasks = useCallback((dependentId: string, blockerId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === dependentId) {
        const current = t.dependencies || [];
        if (!current.includes(blockerId)) {
          return { ...t, dependencies: [...current, blockerId] };
        }
      }
      return t;
    }));
    handleAuditAction('Task Dependency Linked', `Task ${dependentId} blocked by ${blockerId}`);
  }, [setTasks, handleAuditAction]);

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

  const handleBudgetUpdate = async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    setContacts(prev => updateContactInList(prev, contactId, { isCalculating: true }, focus, setFocus));
    setOrchestratorStatus("Running ROI Analysis...");
    setAgents(prev => ({ ...prev, automation: 'Running' }));
    
    try {
      const result = await calculateBudgetProjections(contact);
      setContacts(prev => updateContactInList(prev, contactId, { budgetAnalysis: result || undefined, isCalculating: false }, focus, setFocus));
      handleAuditAction('Budget Projection Pulse', contact.company);
    } catch (e) {
      addNotification("ROI projection service failed.", "error");
      setContacts(prev => updateContactInList(prev, contactId, { isCalculating: false }, focus, setFocus));
    } finally {
      setOrchestratorStatus('Idle');
      setAgents(prev => ({ ...prev, automation: 'Idle' }));
    }
  };

  const handleProjectAnalysisUpdate = (projectId: string, analysis: ProjectAnalysis) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updated = { ...p, analysis };
        if (focus.id === projectId) setFocus(f => ({ ...f, data: updated }));
        return updated;
      }
      return p;
    }));
  };

  const renderDashboardContent = () => {
    switch (activeRoute) {
      case 'Main': 
        return <MainPanel onFocusAction={updateFocus} focus={focus} orchestratorStatus={orchestratorStatus} agents={agents} auditLogs={auditLogs.slice(0, 5)} />;
      case 'Projects': 
        return <ProjectsPanel projects={projects} focus={focus} onFocus={updateFocus} onAddProject={(p) => setProjects(prev => [p as Project, ...prev])} onNavigate={handleNavigate} />;
      case 'Tasks': 
        return <TasksPanel tasks={tasks} focus={focus} onFocus={updateFocus} onUpdateTaskStatus={(id, s) => setTasks(prev => updateTaskStatusInList(prev, id, s))} onUpdateTask={handleUpdateTask} onDeleteTask={(id) => setTasks(prev => prev.filter(t => t.id !== id))} onLinkTasks={handleLinkTasks} />;
      case 'CRM': 
        return <CRMPanel contacts={contacts} focus={focus} onFocus={updateFocus} onAddContact={handleAddContact} onLogInteraction={(id, i) => setContacts(prev => logInteractionLogic(prev, id, i, focus, setFocus))} onAddDeal={(id, d) => setContacts(prev => updateContactInList(prev, id, { deals: [d, ...(prev.find(c => c.id === id)?.deals || [])], dealValue: d.value }, focus, setFocus))} />;
      case 'Services': 
        return <ServicesPanel onFocus={updateFocus} focus={focus} />;
      case 'Client Dashboard': 
        return <ClientDashboardPanel projects={projects} />;
      case 'Settings': 
        return <SettingsPanel auditLogs={auditLogs} />;
      case 'AI Wizard': 
        return <WizardPanel 
          onAddLead={(l) => { setContacts(prev => [l, ...prev]); setActiveRoute('CRM'); }} 
          onAddProject={(p) => { setProjects(prev => [p, ...prev]); setActiveRoute('Projects'); }} 
          onAddTasks={handleAddTasks}
        />;
      default: 
        return <MainPanel onFocusAction={updateFocus} focus={focus} />;
    }
  };

  const renderMarketingContent = () => {
    switch (activeRoute) {
      case 'Home': return <LandingPage onNavigate={handleNavigate} />;
      case 'Public Services': return <ServicesPage onNavigate={handleNavigate} />;
      case 'AI Agents': return <AgentsPage onNavigate={handleNavigate} />;
      case 'Work': return <CaseStudiesPage onNavigate={handleNavigate} />;
      case 'Booking': return <WizardPanel onAddLead={(l) => { setContacts(prev => [l, ...prev]); handleNavigate('Main'); }} onAddProject={(p) => { setProjects(prev => [p, ...prev]); handleNavigate('Projects'); }} onAddTasks={handleAddTasks} />;
      case 'About': return <AboutPage onNavigate={handleNavigate} />;
      default: return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ErrorBoundary name="Agency Platform Root">
      <div className={`flex flex-col md:flex-row h-screen w-full bg-[#fafafa] selection:bg-black selection:text-white overflow-hidden ${isMarketingMode ? 'overflow-y-auto' : ''}`}>
        
        {/* Conditional Layout Switching */}
        {!isMarketingMode ? (
          <>
            <LeftPanel activeRoute={activeRoute} onNavigate={handleNavigate} navItems={NAV_ITEMS} />
            <div className="flex-1 flex overflow-hidden relative">
              {renderDashboardContent()}
              {viewingReportId && contacts.find(c => c.id === viewingReportId)?.researchData?.agentReport && (
                <MarketReportView 
                  contact={contacts.find(c => c.id === viewingReportId)!}
                  report={contacts.find(c => c.id === viewingReportId)!.researchData!.agentReport!}
                  onClose={() => setViewingReportId(null)}
                  onGenerateTasks={(titles) => titles.forEach(t => handleAddTask({ title: t, project: 'AI Strategy', priority: 'Medium' }))}
                  onMarketReportUpdate={() => runDeepResearchOrchestration(viewingReportId, contacts, userLocation, focus, { setContacts, setAgents, setOrchestratorStatus, setFocus, addNotification, handleAuditAction })}
                />
              )}
            </div>
            <RightPanel 
              focus={focus} history={history} 
              onFocusFromHistory={(h) => setFocus(h)}
              onAuditAction={handleAuditAction} onAddTask={handleAddTask}
              onUpdateLeadStage={handleUpdateLeadStage} onApplyEnrichment={handleApplyEnrichment}
              onTriggerEnrichment={handleTriggerEnrichment} onApproveDraft={() => {}}
              onVisualUpdate={(id, a) => setContacts(prev => updateContactInList(prev, id, { pendingDraft: { type: 'Brief', content: 'Visual Asset Added', status: 'Pending', timestamp: new Date().toISOString(), visualAssets: [a] } }, focus, setFocus))}
              onResearchUpdate={() => handleDeepResearchLead(focus.id!)}
              onMarketReportUpdate={() => runDeepResearchOrchestration(focus.id!, contacts, userLocation, focus, { setContacts, setAgents, setOrchestratorStatus, setFocus, addNotification, handleAuditAction })}
              onBudgetUpdate={handleBudgetUpdate} onApprovePlan={() => handleApprovePlan(focus.id!)}
              onOpenMarketReport={(id) => setViewingReportId(id)}
              onDeleteEntity={(id) => focus.type === 'contact' ? setContacts(prev => prev.filter(c => c.id !== id)) : focus.type === 'task' ? setTasks(prev => prev.filter(t => t.id !== id)) : null}
              onProjectAnalysisUpdate={handleProjectAnalysisUpdate}
              projects={projects}
            />
            <ContextStrip focus={focus} />
            <AssistantChatbot workspace={{ contacts, projects }} />
          </>
        ) : (
          <div className="w-full">
            {renderMarketingContent()}
          </div>
        )}

        {/* Global Notifications */}
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
      </div>
    </ErrorBoundary>
  );
};

export default App;
