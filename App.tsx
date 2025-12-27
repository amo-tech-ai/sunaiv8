
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

  // UI State
  const [orchestratorStatus, setOrchestratorStatus] = useState<string>('Idle');
  const [agents, setAgents] = useState<{
    research: 'Running' | 'Idle';
    planning: 'Running' | 'Idle';
    automation: 'Running' | 'Idle';
  }>({ research: 'Idle', planning: 'Idle', automation: 'Idle' });
  const [viewingReportId, setViewingReportId] = useState<string | null>(null);

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

  /**
   * Orchestrator: Multi-Agent Handoff
   */
  const handleDeepResearchLead = async (leadId: string) => {
    const contact = contacts.find(c => c.id === leadId);
    if (!contact) return;

    setContacts(prev => prev.map(c => c.id === leadId ? { ...c, isResearching: true } : c));
    setAgents(prev => ({ ...prev, research: 'Running' }));
    setOrchestratorStatus(`Researcher: Analyzing ${contact.company}...`);

    const research = await deepResearchContact(contact);
    if (research) {
      const report = await conductMarketAnalysis(contact, userLocation);
      const updatedResearch = { ...research, agentReport: report || undefined };
      
      setContacts(prev => prev.map(c => {
        if (c.id === leadId) {
          const updated = { ...c, researchData: updatedResearch, isResearching: false };
          if (focus.id === leadId) setFocus({ ...focus, data: updated });
          return updated;
        }
        return c;
      }));

      if (report) {
        setAgents(prev => ({ ...prev, research: 'Idle', planning: 'Running' }));
        setOrchestratorStatus(`Planner: Synthesizing roadmap...`);
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
    setContacts(prev => prev.map(c => c.id === leadId ? { ...c, proposedPlan: undefined } : c));
    handleAuditAction('Roadmap Approved', contact.company);
  };

  const handleUpdateLeadStage = (leadId: string, nextStage: PipelineStage) => {
    setContacts(prev => prev.map(c => {
      if (c.id === leadId) {
        const updated = { ...c, pipelineStage: nextStage };
        if (focus.id === leadId) setFocus({ ...focus, data: updated });
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
      dueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...taskData
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (focus.id === taskId) setFocus({ type: null, id: null, data: null });
  };

  const handleUpdateTaskStatus = (taskId: string, status: ActionItem['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    if (focus.id === taskId) setFocus(prev => ({ ...prev, data: { ...prev.data, status } }));
  };

  const handleAddProject = (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: `p-${Date.now()}`,
      name: projectData.name || 'Untitled Project',
      client: projectData.client || 'Unknown Client',
      type: projectData.type || 'Web',
      phase: 'Discovery',
      duration: '8 weeks',
      status: 'On Track',
      ...projectData
    };
    setProjects(prev => [newProject, ...prev]);
    handleAuditAction('Project Created', newProject.name);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    setFocus({ type: null, id: null, data: null });
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
      case 'Main': return <MainPanel onFocusAction={handleFocusAction} focus={focus} orchestratorStatus={orchestratorStatus} agents={agents} auditLogs={auditLogs.slice(0, 5)} />;
      case 'Projects': return <ProjectsPanel projects={projects} focus={focus} onFocus={handleFocusAction} onAddProject={handleAddProject} />;
      case 'Tasks': return <TasksPanel tasks={tasks} focus={focus} onFocus={handleFocusAction} onUpdateTaskStatus={handleUpdateTaskStatus} onDeleteTask={handleDeleteTask} />;
      case 'CRM': return <CRMPanel contacts={contacts} focus={focus} onFocus={handleFocusAction} onAddContact={(c) => setContacts([c as Contact, ...contacts])} onLogInteraction={() => {}} onAddDeal={() => {}} />;
      case 'Settings': return <SettingsPanel auditLogs={auditLogs} />;
      case 'AI Wizard': return <WizardPanel onAddLead={(l) => { setContacts([l, ...contacts]); setActiveRoute('CRM'); }} onAddProject={(p) => { setProjects([p, ...projects]); setActiveRoute('Projects'); }} />;
      default: return <MainPanel onFocusAction={handleFocusAction} focus={focus} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#fafafa] selection:bg-black selection:text-white overflow-hidden">
      <LeftPanel activeRoute={activeRoute} onNavigate={handleNavigate} navItems={NAV_ITEMS} />
      <div className="flex-1 flex overflow-hidden relative">
        {renderContent()}
        {viewingReportId && contacts.find(c => c.id === viewingReportId)?.researchData?.agentReport && (
          <MarketReportView 
            contact={contacts.find(c => c.id === viewingReportId)!}
            report={contacts.find(c => c.id === viewingReportId)!.researchData!.agentReport!}
            onClose={() => setViewingReportId(null)}
            onGenerateTasks={(titles) => titles.forEach(t => handleAddTask({ title: t, project: 'AI Strategy', priority: 'Medium' }))}
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
        onBudgetUpdate={() => {}}
        onApprovePlan={() => handleApprovePlan(focus.id!)}
        onOpenMarketReport={(id) => setViewingReportId(id)}
        onDeleteEntity={(id) => focus.type === 'contact' ? handleDeleteContact(id) : focus.type === 'task' ? handleDeleteTask(id) : null}
      />
      <ContextStrip focus={focus} />
      <AssistantChatbot workspace={{ contacts, projects }} />
    </div>
  );
};

export default App;
