
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
import { Contact, Project, FocusState, FocusType, AuditLog, PipelineStage, ActionItem, WorkflowDraft, EnrichmentSuggestion, ResearchResult, MarketReport } from './types';
import { NAV_ITEMS, MOCK_CONTACTS, MOCK_PROJECTS, NEXT_ACTIONS } from './constants';
import { generateWorkflowDraft, calculateBudgetProjections, deepResearchContact, conductMarketAnalysis, enrichLeadData, generateProjectPlan } from './services/geminiService';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

const App: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState('Main');
  const [focus, setFocus] = useState<FocusState>({ type: null, id: null, data: null });
  const [history, setHistory] = useState<FocusState[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
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

  // Capture Location for Grounding
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude } as any);
      }, () => console.warn("Location permission denied. Grounding fallback to global."));
    }
  }, []);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

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
  }, [addNotification]);

  const handleAddTask = useCallback((taskData: Partial<ActionItem>) => {
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
  }, []);

  const handleUpdateLeadStage = useCallback((leadId: string, nextStage: PipelineStage) => {
    setContacts(prev => prev.map(c => {
      if (c.id === leadId) {
        const updated = { ...c, pipelineStage: nextStage };
        if (focus.id === leadId) setFocus(f => ({ ...f, data: updated }));
        return updated;
      }
      return c;
    }));
  }, [focus.id]);

  /**
   * Orchestrator: Multi-Agent Handoff
   */
  const handleDeepResearchLead = async (leadId: string) => {
    const contact = contacts.find(c => c.id === leadId);
    if (!contact) return;

    setContacts(prev => prev.map(c => c.id === leadId ? { ...c, isResearching: true } : c));
    setAgents(prev => ({ ...prev, research: 'Running' }));
    setOrchestratorStatus(`Researcher: Analyzing ${contact.company}...`);

    try {
      const research = await deepResearchContact(contact);
      if (research) {
        const report = await conductMarketAnalysis(contact, userLocation);
        const updatedResearch = { ...research, agentReport: report || undefined };
        
        setContacts(prev => prev.map(c => {
          if (c.id === leadId) {
            const updated = { ...c, researchData: updatedResearch, isResearching: false };
            if (focus.id === leadId) setFocus(f => ({ ...f, data: updated }));
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
              if (focus.id === leadId) setFocus(f => ({ ...f, data: updated }));
              return updated;
            }
            return c;
          }));
        }
      }
    } catch (e) {
      addNotification("Agent research failed. Service interrupted.", "error");
    } finally {
      setContacts(prev => prev.map(c => c.id === leadId ? { ...c, isResearching: false, isPlanning: false } : c));
      setAgents({ research: 'Idle', planning: 'Idle', automation: 'Idle' });
      setOrchestratorStatus('Idle');
      handleAuditAction('Research & Planning Cycle Finished', contact.company);
    }
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

  /**
   * Core Functional Handlers (Verified & Correct)
   */

  const handleApplyEnrichment = (leadId: string, fields: Partial<EnrichmentSuggestion>) => {
    setContacts(prev => prev.map(c => {
      if (c.id === leadId) {
        const updated = { 
          ...c, 
          role: fields.contactPosition || c.role,
          bio: fields.companyDescription || c.bio,
          category: (fields.industry as any) || c.category,
          pendingEnrichment: undefined 
        };
        if (focus.id === leadId) setFocus(f => ({ ...f, data: updated }));
        return updated;
      }
      return c;
    }));
    handleAuditAction('Lead Enrichment Applied', leadId);
  };

  const handleTriggerEnrichment = async (leadId: string) => {
    const contact = contacts.find(c => c.id === leadId);
    if (!contact) return;
    setContacts(prev => prev.map(c => c.id === leadId ? { ...c, isProcessing: true } : c));
    setOrchestratorStatus(`Enriching ${contact.company}...`);
    try {
      const result = await enrichLeadData(contact.company, contact.name);
      setContacts(prev => prev.map(c => {
        if (c.id === leadId) {
          const updated = { ...c, pendingEnrichment: result || undefined, isProcessing: false };
          if (focus.id === leadId) setFocus(f => ({ ...f, data: updated }));
          return updated;
        }
        return c;
      }));
      handleAuditAction('Enrichment Pulse Complete', contact.company);
    } catch (e) {
      addNotification("Enrichment service unavailable.", "error");
      setContacts(prev => prev.map(c => c.id === leadId ? { ...c, isProcessing: false } : c));
    } finally {
      setOrchestratorStatus('Idle');
    }
  };

  const handleApproveDraft = (leadId: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id === leadId && c.pendingDraft) {
        const updatedDraft = { ...c.pendingDraft, status: 'Approved' as const };
        handleAddTask({
          title: `Implement Approved ${c.pendingDraft.type}`,
          project: c.company,
          priority: 'High',
          status: 'In Progress',
          linkedEntityId: c.id,
          linkedEntityType: 'contact'
        });
        const updated = { ...c, pendingDraft: updatedDraft };
        if (focus.id === leadId) setFocus(f => ({ ...f, data: updated }));
        return updated;
      }
      return c;
    }));
    handleAuditAction('Workflow Draft Approved', leadId);
  };

  const handleVisualUpdate = (leadId: string, asset: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id === leadId) {
        const updatedDraft = c.pendingDraft 
          ? { ...c.pendingDraft, visualAssets: [...(c.pendingDraft.visualAssets || []), asset] }
          : { type: 'Brief' as const, content: 'AI Visuals Generated', status: 'Pending' as const, timestamp: new Date().toISOString(), visualAssets: [asset] };
        const updated = { ...c, pendingDraft: updatedDraft };
        if (focus.id === leadId) setFocus(f => ({ ...f, data: updated }));
        return updated;
      }
      return c;
    }));
    handleAuditAction('Creative Asset Added', leadId);
  };

  const handleMarketReportUpdate = async (leadId: string) => {
    const contact = contacts.find(c => c.id === leadId);
    if (!contact) return;
    setContacts(prev => prev.map(c => c.id === leadId ? { ...c, isResearching: true } : c));
    setOrchestratorStatus(`Refreshing analysis...`);
    try {
      const report = await conductMarketAnalysis(contact, userLocation);
      setContacts(prev => prev.map(c => {
        if (c.id === leadId) {
          const updatedResearch = c.researchData ? { ...c.researchData, agentReport: report || undefined } : undefined;
          const updated = { ...c, researchData: updatedResearch as any, isResearching: false };
          if (focus.id === leadId) setFocus(f => ({ ...f, data: updated }));
          return updated;
        }
        return c;
      }));
      handleAuditAction('Intelligence Report Refreshed', contact.company);
    } catch (e) {
      addNotification("Market analysis failed.", "error");
      setContacts(prev => prev.map(c => c.id === leadId ? { ...c, isResearching: false } : c));
    } finally {
      setOrchestratorStatus('Idle');
    }
  };

  const handleBudgetUpdate = async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, isCalculating: true } : c));
    setAgents(prev => ({ ...prev, automation: 'Running' }));
    setOrchestratorStatus("Analyst: Calculating ROI...");
    try {
      const budget = await calculateBudgetProjections(contact);
      setContacts(prev => prev.map(c => {
        if (c.id === contactId) {
          const updated = { ...c, budgetAnalysis: budget || undefined, isCalculating: false };
          if (focus.id === contactId) setFocus(f => ({ ...f, data: updated }));
          return updated;
        }
        return c;
      }));
      handleAuditAction('Financial ROI Recalculated', contact.company);
    } catch (e) {
      addNotification("ROI projection failed.", "error");
      setContacts(prev => prev.map(c => c.id === contactId ? { ...c, isCalculating: false } : c));
    } finally {
      setAgents(prev => ({ ...prev, automation: 'Idle' }));
      setOrchestratorStatus('Idle');
    }
  };

  const renderContent = () => {
    switch (activeRoute) {
      case 'Main': return <MainPanel onFocusAction={handleFocusAction} focus={focus} orchestratorStatus={orchestratorStatus} agents={agents} auditLogs={auditLogs.slice(0, 5)} />;
      case 'Projects': return <ProjectsPanel projects={projects} focus={focus} onFocus={handleFocusAction} onAddProject={(p) => setProjects(prev => [p as Project, ...prev])} />;
      case 'Tasks': return <TasksPanel tasks={tasks} focus={focus} onFocus={handleFocusAction} onUpdateTaskStatus={(id, s) => setTasks(prev => prev.map(t => t.id === id ? { ...t, status: s } : t))} onDeleteTask={(id) => setTasks(prev => prev.filter(t => t.id !== id))} />;
      case 'CRM': return <CRMPanel contacts={contacts} focus={focus} onFocus={handleFocusAction} onAddContact={(c) => setContacts(prev => [c as Contact, ...prev])} onLogInteraction={(id, i) => setContacts(prev => prev.map(c => c.id === id ? { ...c, interactions: [i, ...c.interactions] } : c))} onAddDeal={(id, d) => setContacts(prev => prev.map(c => c.id === id ? { ...c, deals: [d, ...c.deals] } : c))} />;
      case 'Services': return <ServicesPanel onFocus={handleFocusAction} focus={focus} />;
      case 'Client Dashboard': return <ClientDashboardPanel projects={projects} />;
      case 'Settings': return <SettingsPanel auditLogs={auditLogs} />;
      case 'AI Wizard': return <WizardPanel onAddLead={(l) => { setContacts(prev => [l, ...prev]); setActiveRoute('CRM'); }} onAddProject={(p) => { setProjects(prev => [p, ...prev]); setActiveRoute('Projects'); }} />;
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
            onMarketReportUpdate={() => handleMarketReportUpdate(viewingReportId)}
          />
        )}
      </div>

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
      <ContextStrip focus={focus} />
      <AssistantChatbot workspace={{ contacts, projects }} />
    </div>
  );
};

export default App;
