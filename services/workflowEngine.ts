
import { ActiveAgent, AutomationRule, RecAgent, RecAutomation, Project } from "../types";

/**
 * Workflow Engine
 * Handles the operationalization of AI-generated intelligence.
 * Converts "Recommended" items into "Active" system entities.
 */

export const deployAgent = (agent: RecAgent, project: Project): ActiveAgent => {
  return {
    id: `aa-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: agent.name,
    role: agent.role,
    projectId: project.id,
    status: 'Active',
    deployedAt: new Date().toISOString()
  };
};

export const registerAutomation = (automation: RecAutomation, project: Project): AutomationRule => {
  return {
    id: `ar-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    projectId: project.id,
    trigger: automation.trigger,
    action: automation.action,
    status: 'Active'
  };
};

/**
 * Simulates the "Execution" phase where recommended items become real database records.
 * In a real backend, this would call Supabase to insert rows into `agents` and `automations` tables.
 */
export const executeIntelligencePlan = async (
  items: any[], 
  project: Project
): Promise<{ agents: ActiveAgent[], automations: AutomationRule[], tasks: any[] }> => {
  
  const deployedAgents: ActiveAgent[] = [];
  const registeredAutomations: AutomationRule[] = [];
  const generatedTasks: any[] = [];

  for (const item of items) {
    if (item._type === 'agent') {
      deployedAgents.push(deployAgent(item, project));
    } else if (item._type === 'automation') {
      registeredAutomations.push(registerAutomation(item, project));
    } else {
      // Workflows, Journeys, etc become Tasks for now
      generatedTasks.push({
        title: `Implement: ${item.name || item.scenario || 'Workflow'}`,
        description: `Source: Project Intelligence. \nDetails: ${item.outputs || item.built || item.valueProp}`,
        project: project.name,
        priority: 'Medium',
        status: 'Backlog',
        linkedEntityId: project.id,
        linkedEntityType: 'project'
      });
    }
  }

  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    agents: deployedAgents,
    automations: registeredAutomations,
    tasks: generatedTasks
  };
};

/**
 * Simulates waking up the agent swarm for a specific project.
 */
export const activateProjectAgents = async (project: Project): Promise<void> => {
  // In a real system, this would trigger Edge Functions.
  console.log(`[WorkflowEngine] Activating swarm for project: ${project.name}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  return;
};
