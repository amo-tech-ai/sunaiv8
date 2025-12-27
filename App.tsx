
import React, { useState, useEffect } from 'react';
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
import { Contact, Project, FocusState, FocusType, AuditLog, PipelineStage, ActionItem, Interaction, WorkflowDraft, Deal, ResearchResult, MarketReport, ProjectPlan } from './types';
import { NAV_ITEMS, MOCK_CONTACTS, MOCK_PROJECTS, NEXT_ACTIONS } from './constants';
import { generateWorkflowDraft, calculateBudgetProjections, deepResearchContact, conductMarketAnalysis, generateProjectPlan } from './services/geminiService';

const App: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState('Main');
  const [focus, setFocus] = useState<FocusState>({ type: null, id: null, data: null });
  const [history, setHistory] = useState<FocusState[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);
  
  // Persistent State
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('sun_contacts');
    return saved ? JSON.parse(saved) : MOCK_CONTACTS;
  });
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('sun_projects');
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });
  const [tasks, setTasks] = useState<ActionItem[]>(() => {
    const saved = localStorage.getItem('sun_tasks');
    return saved ? JSON.parse(saved) : NEXT_ACTIONS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('sun_audit');
    return saved ? JSON.parse(saved) : [];
  });

  // Orchestrator State
  const [orchestratorStatus, setOrchestratorStatus] = useState<string>('Idle');
  const [agents, setAgents] = useState<{
    research: 'Running' | 'Idle';
    planning: 'Running' | 'Idle';
    automation: 'Running' | 'Idle';
  }>({ research: 'Idle', planning: 'Idle', automation: 'Idle' });
  const [viewingReportId, setViewingReportId] = useState<string | null>(null);

  // Capture Location for Grounding
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, () => console.warn("Location permission denied. Grounding fallback to global."));
    }
  }, []);

  // Persistence Sync
  useEffect(() => localStorage.setItem('sun_contacts', JSON.stringify(contacts)), [contacts]);
  useEffect(() => localStorage.setItem('sun_projects', JSON.stringify(projects)), [projects]);
  useEffect(() => localStorage.setItem('sun_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('sun_audit', JSON.stringify(auditLogs)), [auditLogs]);

  const handleNavigate = (routeName: string) => {
    setActiveRoute(routeName);
    setFocus({ type: null, id: null, data: null });
  };

  const handleFocusAction = (type: FocusType, item: any) => {
    if (focus.id === item.id) {
      setFocus({ type: null, id: null, data: null });
    } else {
      const newFocus = { type, id: item.id, data: item };
      setFocus(newFocus);
      setHistory(prev => [newFocus, ...prev.filter(h => h.id !== item.id)].slice(0, 10));
    }
  };

  const handleDeepResearchLead = async (leadId: string) => {
    const contact = contacts.find(c => c.id === leadId);
    if (!contact) return;

    setContacts(prev => prev.map(c => c.id === leadId ? { ...c, isResearching: true } : c));
    setAgents(prev => ({ ...prev, research: 'Running' }));
    setOrchestratorStatus(`Researcher: Grounding data for ${contact.company}...`);

    const research = await deepResearchContact(contact);
    if (research) {
      const report = await conductMarketAnalysis(contact, userLocation);
      
      setContacts(prev => prev.map(c => {
        if (c.id === leadId) {
          const updatedResearch = { ...research, agentReport: report || undefined };
          const updated = { ...c, researchData: updatedResearch, isResearching: false };
          if (focus.id === leadId) setFocus({ ...focus, data: updated });
          return updated;
        }
        return c;
      }));

      // AUTO-HANDOFF TO PLANNER
      if (report) {
        setAgents(prev => ({ ...prev, research: 'Idle', planning: 'Running' }));
        setOrchestratorStatus("Planner: Drafting 4-week implementation roadmap...");
        const plan = await generateProjectPlan(contact, report);
        setContacts(prev => prev.map(c => {
          if (c.id === leadId) {
            const updated = { ...c, proposedPlan: plan || undefined, isPlanning: false };
            if (focus.id === leadId) setFocus({ ...focus, data: updated });
            return updated;
          }
          return c;
        }));
      }
    } else {
      setContacts(prev => prev.map(c => c.id === leadId ? { ...c, isResearching: false, isPlanning: false } : c));
    }

    setAgents({ research: 'Idle', planning: 'Idle', automation: 'Idle' });
    setOrchestratorStatus('Idle');
    handleAuditAction('Research & Planning Complete', contact.company);
  };

  const handleApprovePlan = (leadId: string) => {
    const contact = contacts.find(c => c.id === leadId);
    if (!contact || !contact.proposedPlan) return;

    // Transactional Commit
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

    // Advance Stage & Clear Proposal
    handleUpdateLeadStage(leadId, 'Proposal');
    setContacts(prev => prev.map(c => c.id === leadId ? { ...c, proposedPlan: undefined } : c));
    
    handleAuditAction('Roadmap Approved & Tasks Created', contact.company);
    alert(`4-week strategy committed for ${contact.company}. Tasks added to Execution Board.`);
  };

  const handleUpdateLeadStage = async (leadId: string, nextStage: PipelineStage) => {
    setContacts(prev => prev.map(c => {
      if (c.id === leadId) {
        const updated = { ...c, pipelineStage: nextStage };
        if (focus.id === leadId) setFocus({ ...focus, data: updated });
        return updated;
      }
      return c;
    }));
  };

  const handleBudgetUpdate = async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, isCalculating: true } : c));
    setAgents(prev => ({ ...prev, automation: 'Running' }));
    setOrchestratorStatus("Analyst: Executing Python logic for budget projections...");

    const budget = await calculateBudgetProjections(contact);
    
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        const updated = { ...c, budgetAnalysis: budget || undefined, isCalculating: false };
        if (focus.id === contactId) setFocus({ ...focus, data: updated });
        return updated;
      }
      return c;
    }));
    
    setAgents(prev => ({ ...prev, automation: 'Idle' }));
    setOrchestratorStatus('Idle');
    handleAuditAction('Budget Projection Generated (Code Exec)', contact.company);
  };

  const handleAddContact = (contactData: Partial<Contact>) => {
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
      interactions: [],
      deals: [],
      placements: [],
      ...contactData
    };
    setContacts(prev => [newContact, ...prev]);
  };

  const handleLogInteraction = (contactId: string, interaction: Interaction) => {
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        const updated = { ...c, interactions: [interaction, ...c.interactions], lastContact: 'Just now' };
        if (focus.id === contactId) setFocus({ ...focus, data: updated });
        return updated;
      }
      return c;
    }));
  };

  const handleAddDeal = (contactId: string, deal: Deal) => {
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        const updated = { ...c, deals: [deal, ...c.deals], dealValue: deal.value };
        if (focus.id === contactId) setFocus({ ...focus, data: updated });
        return updated;
      }
      return c;
    }));
  };

  const handleAddTask = (taskData: Partial<ActionItem>) => {
    const newTask: ActionItem = {
      id: `t-${Date.now()}`,
      title: taskData.title || 'Untitled Action',
      project: taskData.project || 'General',
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Backlog',
      linkedEntityId: taskData.linkedEntityId,
      linkedEntityType: taskData.linkedEntityType,
      ...taskData
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleAuditAction = (action: string, context: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      actor: 'Julian Smith',
      context
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const renderContent = () => {
    switch (activeRoute) {
      case 'Main': return <MainPanel onFocusAction={handleFocusAction} focus={focus} orchestratorStatus={orchestratorStatus} agents={agents} />;
      case 'Projects': return <ProjectsPanel projects={projects} focus={focus} onFocus={handleFocusAction} />;
      case 'Tasks': return <TasksPanel tasks={tasks} focus={focus} onFocus={handleFocusAction} />;
      case 'CRM': return <CRMPanel contacts={contacts} focus={focus} onFocus={handleFocusAction} onAddContact={handleAddContact} onLogInteraction={handleLogInteraction} onAddDeal={handleAddDeal} />;
      case 'Settings': return <SettingsPanel auditLogs={auditLogs} />;
      case 'AI Wizard': return <WizardPanel onAddLead={(l) => { setContacts([l, ...contacts]); setActiveRoute('CRM'); }} onAddProject={(p) => { setProjects([p, ...projects]); setActiveRoute('Projects'); }} />;
      case 'Client Dashboard': return <ClientDashboardPanel projects={projects} />;
      default: return <MainPanel onFocusAction={handleFocusAction} focus={focus} />;
    }
  };

  const activeReportContact = viewingReportId ? contacts.find(c => c.id === viewingReportId) : null;

  return (
    <div className="flex h-screen w-full bg-[#fafafa] selection:bg-black selection:text-white overflow-hidden">
      <LeftPanel activeRoute={activeRoute} onNavigate={handleNavigate} navItems={NAV_ITEMS} />
      <div className="flex-1 flex overflow-hidden relative">
        {renderContent()}
        {activeReportContact?.researchData?.agentReport && (
          <MarketReportView 
            contact={activeReportContact}
            report={activeReportContact.researchData.agentReport}
            onClose={() => setViewingReportId(null)}
            onExport={() => handleAuditAction('Intelligence Report Exported', activeReportContact.company)}
          />
        )}
      </div>
      <RightPanel 
        focus={focus} 
        history={history} 
        onFocusFromHistory={(h) => setFocus(h)}
        onAuditAction={handleAuditAction}
        onAddTask={handleAddTask}
        onUpdateLeadStage={handleUpdateLeadStage}
        onApplyEnrichment={() => {}}
        onTriggerEnrichment={() => {}}
        onApproveDraft={() => {}}
        onVisualUpdate={() => {}}
        onResearchUpdate={() => handleDeepResearchLead(focus.id!)}
        onMarketReportUpdate={() => {}}
        onBudgetUpdate={handleBudgetUpdate}
        onApprovePlan={() => handleApprovePlan(focus.id!)}
        onOpenMarketReport={(id) => setViewingReportId(id)}
      />
      <ContextStrip focus={focus} />
      <AssistantChatbot workspace={{ contacts, projects }} />
    </div>
  );
};

export default App;
