
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
import { Contact, Project, FocusState, FocusType, AuditLog, PipelineStage, ActionItem, Interaction, WorkflowDraft, Deal, ResearchResult, MarketReport, BudgetAnalysis, ProjectAnalysis } from './types';
import { NAV_ITEMS, MOCK_CONTACTS, MOCK_PROJECTS, NEXT_ACTIONS } from './constants';
import { generateWorkflowDraft, calculateBudgetProjections } from './services/geminiService';

const App: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState('Main');
  const [focus, setFocus] = useState<FocusState>({ type: null, id: null, data: null });
  const [history, setHistory] = useState<FocusState[]>([]);
  
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
  const [isAnyAgentActive, setIsAnyAgentActive] = useState(false);
  const [viewingReportId, setViewingReportId] = useState<string | null>(null);

  // Persistence Sync
  useEffect(() => {
    localStorage.setItem('sun_contacts', JSON.stringify(contacts));
  }, [contacts]);
  useEffect(() => {
    localStorage.setItem('sun_projects', JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem('sun_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('sun_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

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
      bio: 'New relationship captured via Dashboard intake.',
      interactions: [],
      deals: [],
      placements: [],
      ...contactData
    };
    setContacts(prev => [newContact, ...prev]);
    handleAuditAction('Contact Intake', `Added new ${newContact.category}: ${newContact.company}`);
  };

  const handleLogInteraction = (contactId: string, interaction: Interaction) => {
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        const updated = { 
          ...c, 
          interactions: [interaction, ...c.interactions],
          lastContact: 'Just now',
          score: Math.min(100, (c.score || 50) + 5)
        };
        if (focus.id === contactId) setFocus({ ...focus, data: updated });
        return updated;
      }
      return c;
    }));
    handleAuditAction('Interaction Logged', `Recorded ${interaction.type} for ${contactId}`);
  };

  const handleAddDeal = (contactId: string, deal: Deal) => {
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        const updated = {
          ...c,
          deals: [deal, ...c.deals],
          dealValue: deal.value 
        };
        if (focus.id === contactId) setFocus({ ...focus, data: updated });
        return updated;
      }
      return c;
    }));
    handleAuditAction('Deal Created', `New opportunity: ${deal.title} for ${contactId}`);
  };

  const handleVisualUpdate = (contactId: string, asset: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        const existingDraft = c.pendingDraft || { type: 'Brief', content: 'Visual assets generated.', status: 'Pending', timestamp: new Date().toISOString() };
        const updatedDraft: WorkflowDraft = {
          ...existingDraft,
          visualAssets: [...(existingDraft.visualAssets || []), asset]
        };
        const updated = { ...c, pendingDraft: updatedDraft };
        if (focus.id === contactId) setFocus({ ...focus, data: updated });
        return updated;
      }
      return c;
    }));
  };

  const handleResearchUpdate = (contactId: string, research: ResearchResult) => {
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        const updated = { ...c, researchData: research };
        if (focus.id === contactId) setFocus({ ...focus, data: updated });
        return updated;
      }
      return c;
    }));
  };

  const handleMarketReportUpdate = (contactId: string, report: MarketReport) => {
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        const updatedResearch = c.researchData ? { ...c.researchData, agentReport: report } : { summary: 'Report Attached', marketPosition: 'Analyzed', recentNews: [], sources: [], agentReport: report };
        const updated = { ...c, researchData: updatedResearch };
        if (focus.id === contactId) setFocus({ ...focus, data: updated });
        return updated;
      }
      return c;
    }));
  };

  const handleBudgetUpdate = async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, isCalculating: true } : c));
    setOrchestratorStatus("Running Code Execution...");
    setIsAnyAgentActive(true);

    const budget = await calculateBudgetProjections(contact);
    
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        const updated = { ...c, budgetAnalysis: budget || undefined, isCalculating: false };
        if (focus.id === contactId) setFocus({ ...focus, data: updated });
        return updated;
      }
      return c;
    }));
    
    setIsAnyAgentActive(false);
    setOrchestratorStatus('Idle');
    handleAuditAction('Budget Projection (Code Execution)', contact.company);
  };

  const handleUpdateLeadStage = async (leadId: string, nextStage: PipelineStage) => {
    setContacts(prev => prev.map(c => {
      if (c.id === leadId) {
        const isTriggerStage = nextStage === 'Proposal' || nextStage === 'Negotiation';
        return { ...c, pipelineStage: nextStage, isProcessing: isTriggerStage };
      }
      return c;
    }));

    if (nextStage === 'Proposal' || nextStage === 'Negotiation') {
      const targetLead = contacts.find(c => c.id === leadId);
      if (targetLead) {
        setOrchestratorStatus(`Drafting ${nextStage}...`);
        setIsAnyAgentActive(true);
        const draft = await generateWorkflowDraft(targetLead, nextStage);
        setContacts(prev => prev.map(c => {
          if (c.id === leadId) {
            const updated = { ...c, pendingDraft: draft, isProcessing: false };
            if (focus.id === leadId) setFocus({ ...focus, data: updated });
            return updated;
          }
          return c;
        }));
        setIsAnyAgentActive(false);
        setOrchestratorStatus('Idle');
        handleAuditAction(`Automation Triggered: ${nextStage} Drafting`, targetLead.company);
      }
    }
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

  const handleProjectAnalysisUpdate = (projectId: string, analysis: ProjectAnalysis) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updated = { ...p, analysis };
        if (focus.id === projectId) setFocus({ ...focus, data: updated });
        return updated;
      }
      return p;
    }));
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
      case 'Main': return <MainPanel onFocusAction={handleFocusAction} focus={focus} orchestratorStatus={orchestratorStatus} isAnyAgentActive={isAnyAgentActive} />;
      case 'Projects': return <ProjectsPanel projects={projects} focus={focus} onFocus={handleFocusAction} onAddProject={(p) => setProjects([p as Project, ...projects])} />;
      case 'Tasks': return <TasksPanel tasks={tasks} focus={focus} onFocus={handleFocusAction} />;
      case 'CRM': return <CRMPanel contacts={contacts} focus={focus} onFocus={handleFocusAction} onAddContact={handleAddContact} onLogInteraction={handleLogInteraction} onAddDeal={handleAddDeal} />;
      case 'Settings': return <SettingsPanel auditLogs={auditLogs} />;
      case 'AI Wizard': return <WizardPanel onAddLead={(l) => { setContacts([l, ...contacts]); setActiveRoute('CRM'); }} onAddProject={(p) => { setProjects([p, ...projects]); setActiveRoute('Projects'); }} />;
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
            onGenerateTasks={(taskTitles) => {
              taskTitles.forEach(t => handleAddTask({ title: t, project: activeReportContact.company, priority: 'Medium', status: 'Backlog', linkedEntityId: activeReportContact.id, linkedEntityType: 'contact' }));
              handleAuditAction('Roadmap Generated from Report', activeReportContact.company);
            }}
          />
        )}
      </div>
      <RightPanel 
        focus={focus} 
        history={history} 
        projects={projects}
        onFocusFromHistory={(h) => setFocus(h)}
        onAuditAction={handleAuditAction}
        onAddTask={handleAddTask}
        onUpdateLeadStage={handleUpdateLeadStage}
        onApplyEnrichment={() => {}}
        onTriggerEnrichment={() => {}}
        onApproveDraft={() => {}}
        onVisualUpdate={handleVisualUpdate}
        onResearchUpdate={handleResearchUpdate}
        onMarketReportUpdate={handleMarketReportUpdate}
        onBudgetUpdate={handleBudgetUpdate}
        onOpenMarketReport={(id) => setViewingReportId(id)}
        onProjectAnalysisUpdate={handleProjectAnalysisUpdate}
        onDeleteEntity={(id) => {
          if (focus.type === 'contact') setContacts(prev => prev.filter(c => c.id !== id));
          if (focus.type === 'project') setProjects(prev => prev.filter(p => p.id !== id));
          if (focus.type === 'task') setTasks(prev => prev.filter(t => t.id !== id));
          setFocus({ type: null, id: null, data: null });
        }}
      />
      <ContextStrip focus={focus} />
      <AssistantChatbot workspace={{ contacts, projects }} />
    </div>
  );
};

export default App;
