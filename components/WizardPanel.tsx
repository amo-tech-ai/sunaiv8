
import React from 'react';
import { Contact, Project, ActionItem } from '../types';
import WizardLayout from './wizard/WizardLayout';
import { WizardBlueprint } from '../hooks/useWizard';

interface WizardPanelProps {
  onAddLead: (lead: Contact) => void;
  onAddProject: (project: Project) => void;
  onAddTasks: (tasks: Partial<ActionItem>[]) => void;
  contacts: Contact[];
}

const WizardPanel: React.FC<WizardPanelProps> = ({ onAddLead, onAddProject, onAddTasks, contacts }) => {
  
  const handleWizardComplete = (blueprint: WizardBlueprint) => {
    // 1. Create Project
    const roadmap = blueprint.artifacts?.roadmap;
    // Calculate total duration from WBS
    const duration = roadmap?.wbs?.reduce((acc: number, p: any) => {
        // Simple heuristic: sum duration integers found in strings "2 weeks" -> 2
        const weeks = parseInt(p.duration) || 0;
        return acc + weeks;
    }, 0) || 8;

    const newProject: Project = {
      id: blueprint.id || `p-${Date.now()}`,
      name: blueprint.basics.projectName || 'Untitled Project',
      client: blueprint.basics.companyName || 'Unknown Client',
      type: (blueprint.scope.appType as any) || 'Web App',
      phase: 'Discovery',
      duration: `${duration} weeks`,
      status: 'On Track',
      startDate: new Date().toISOString(),
      description: blueprint.scope.goals,
      milestones: roadmap?.milestones || [], 
      wbs: roadmap?.wbs,
      team: [], 
      isAnalyzing: false,
    };

    onAddProject(newProject);

    // 2. Create Tasks from WBS
    const tasksToCreate: Partial<ActionItem>[] = [];
    if (roadmap?.wbs) {
        roadmap.wbs.forEach((phase: any) => {
            if (phase.tasks) {
                phase.tasks.forEach((task: any) => {
                    tasksToCreate.push({
                        title: task.title,
                        description: task.description,
                        project: newProject.name,
                        priority: task.effort === 'High' ? 'High' : 'Medium',
                        status: 'Backlog',
                        linkedEntityId: newProject.id,
                        linkedEntityType: 'project'
                    });
                });
            }
        });
    }

    if (tasksToCreate.length > 0) {
        onAddTasks(tasksToCreate);
    }

    // 3. Create Contact (Lead) if requested, preventing duplicates
    const safeCompanyName = (blueprint.basics.companyName || '').trim().toLowerCase();
    const existingContact = contacts.find(c => c.company.toLowerCase().trim() === safeCompanyName);
    
    if (!existingContact && blueprint.basics.companyName) {
      const newContact: Contact = {
          id: `c-${Date.now()}`,
          name: blueprint.basics.contactName || 'Primary Contact',
          company: blueprint.basics.companyName,
          role: 'Client',
          category: 'Startup', 
          status: 'Active',
          pipelineStage: 'Discovery',
          lastContact: 'Just now',
          bio: `Project owner for ${blueprint.basics.projectName}`,
          interactions: [],
          deals: [],
          placements: []
      };
      onAddLead(newContact);
    } else {
      console.log(`[Wizard] Contact already exists or name invalid. Skipping.`);
    }
  };

  const handleCancel = () => {
    // Navigate back to main dashboard
    window.location.hash = '#/'; // Or utilize parent routing logic if available
  };

  return (
    <div className="absolute inset-0 z-10 bg-white">
      <WizardLayout 
        onCancel={handleCancel}
        onComplete={handleWizardComplete}
      />
    </div>
  );
};

export default WizardPanel;
