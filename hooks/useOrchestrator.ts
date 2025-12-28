
import { useState } from 'react';

export type AgentStatus = 'Idle' | 'Running';

export function useOrchestrator() {
  const [orchestratorStatus, setOrchestratorStatus] = useState<string>('Idle');
  const [agents, setAgents] = useState<{
    research: AgentStatus;
    planning: AgentStatus;
    automation: AgentStatus;
  }>({ research: 'Idle', planning: 'Idle', automation: 'Idle' });
  const [viewingReportId, setViewingReportId] = useState<string | null>(null);

  return { 
    orchestratorStatus, 
    setOrchestratorStatus, 
    agents, 
    setAgents, 
    viewingReportId, 
    setViewingReportId 
  };
}
