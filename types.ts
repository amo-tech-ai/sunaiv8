
export type Priority = 'High' | 'Medium' | 'Low';
export type FocusType = 'task' | 'project' | 'contact' | 'service' | 'agent_report' | null;
export type ProjectStatus = 'On Track' | 'At Risk' | 'Complete';
export type ProjectType = 'AI' | 'Web App' | 'E-commerce' | 'Web';
export type PipelineStage = 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed';

export type ContactCategory = 'Designer' | 'Buyer' | 'Press' | 'Sponsor' | 'Enterprise' | 'Startup';
export type ContactStatus = 'Active' | 'Lead' | 'Archive';

export interface Collaborator {
  id: string;
  name: string;
}

export interface EnrichmentSuggestion {
  industry?: string;
  companyDescription?: string;
  keyFocus?: string;
  suggestedValue?: string;
  contactPosition?: string;
}

export interface Activity {
  id: string;
  title: string;
  project: string;
  time: string;
}

export interface DashboardStats {
  activeProjects: number;
  openTasks: number;
  activeClients: number;
  networkSize: number;
  networkGrowth: number[];
}

export interface Service {
  id: string;
  category: string;
  name: string;
  description: string;
  price: string;
  duration: string;
}

export interface MarketReport {
  industryOverview: string;
  competitorAnalysis: { name: string; tactic: string; weakness: string }[];
  painPoints: string[];
  suggestedAutomations: { workflow: string; benefit: string; complexity: string }[];
  localIntelligence?: string; 
}

export interface WBSTask {
  title: string;
  description: string;
  effort: 'Low' | 'Medium' | 'High';
}

export interface WBSPhase {
  name: string;
  duration: string;
  tasks: WBSTask[];
}

export interface Milestone {
  week: string;
  title: string;
  description: string;
  effort: 'Low' | 'Medium' | 'High';
}

export interface ProjectPlan {
  milestones: Milestone[];
  wbs?: WBSPhase[];
  reasoning: string;
  dependencies: string[];
  assumptions: string[];
}

export interface ResourceSwap {
  collaboratorName: string;
  currentRole: string;
  suggestedMove: string;
  impact: string;
}

export interface ProjectAnalysis {
  riskScore: number; // 0-100
  riskSummary: string;
  bottlenecks: string[];
  resourceOptimization: ResourceSwap[];
  mitigationSteps: string[];
}

export interface BudgetAnalysis {
  totalEstimatedCost: number;
  roiProjection: number;
  breakdown: { item: string; cost: number }[];
  reasoning: string;
}

export interface ResearchResult {
  summary: string;
  marketPosition: string;
  locationContext?: string;
  recentNews: string[];
  sources: { title: string; uri: string }[];
  agentReport?: MarketReport;
}

export interface Interaction {
  id: string;
  date: string;
  type: 'Meeting' | 'Demo' | 'Call' | 'RSVP' | 'Email' | 'Media Placement';
  note: string;
  outcome?: string;
}

export interface Deal {
  id: string;
  title: string;
  value: string;
  stage: PipelineStage;
  closeDate: string;
  linkedCampaign?: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  lastContact: string;
  status: ContactStatus;
  category: ContactCategory;
  engagementType?: string;
  dealValue?: string;
  score?: number;
  bio?: string;
  collaborators?: Collaborator[];
  pipelineStage?: PipelineStage;
  pendingEnrichment?: EnrichmentSuggestion;
  pendingDraft?: WorkflowDraft;
  proposedPlan?: ProjectPlan;
  researchData?: ResearchResult;
  budgetAnalysis?: BudgetAnalysis;
  isProcessing?: boolean;
  isResearching?: boolean;
  isCalculating?: boolean;
  isPlanning?: boolean;
  interactions: Interaction[];
  deals: Deal[];
  placements: string[];
  completeness?: number;
}

export interface FocusState {
  type: FocusType;
  id: string | null;
  data: any | null;
}

export interface AIInsight {
  summary: string;
  risk?: string;
  suggestion: string;
  confidence: 'high' | 'medium' | 'low';
  signals: string[];
  suggestedTasks?: string[];
  reasoningTrace?: string;
  forecast?: {
    probability: number;
    reasoning: string;
    nextBestAction: string;
  };
}

export interface WorkflowDraft {
  type: 'Proposal' | 'Brief' | 'Contract' | 'Milestones';
  content: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
  visualAssets?: string[];
}

export interface ActionItem {
  id: string;
  title: string;
  project: string;
  priority: Priority;
  description?: string;
  status: 'Backlog' | 'In Progress' | 'Review' | 'Done';
  linkedEntityId?: string;
  linkedEntityType?: 'contact' | 'project';
  dueDate?: string;
  collaborators?: Collaborator[];
  dependencies?: string[];
}

// --- PROJECT INTELLIGENCE TYPES ---

export interface RecAgent {
  id: string;
  name: string;
  role: string;
  whyNeeded: string;
  produces: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface RecAutomation {
  id: string;
  trigger: string;
  action: string;
  outcome: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface RecWorkflow {
  id: string;
  name: string;
  stepCount: number;
  outputs: string;
  whenToUse: string;
}

export interface RecJourney {
  id: string;
  actor: string;
  steps: string[];
  valueProp: string;
}

export interface RecExample {
  id: string;
  scenario: string;
  built: string;
  outcome: string;
}

export interface ProjectIntelligence {
  summary: {
    complexity: 'Low' | 'Medium' | 'High';
    deliveryModel: 'MVP' | 'Phased' | 'Full';
    primaryGoal: string;
  };
  agents: RecAgent[];
  automations: RecAutomation[];
  workflows: RecWorkflow[];
  journeys: RecJourney[];
  examples: RecExample[];
}

// --- EXECUTION TYPES ---

export interface ActiveAgent {
  id: string;
  name: string;
  role: string;
  projectId: string;
  status: 'Active' | 'Paused';
  deployedAt: string;
}

export interface AutomationRule {
  id: string;
  projectId: string;
  trigger: string;
  action: string;
  status: 'Active' | 'Inactive';
}

export interface Project {
  id: string;
  name: string;
  client: string;
  type: ProjectType;
  phase: string;
  duration: string;
  status: ProjectStatus;
  startDate?: string;
  description?: string;
  milestones?: Milestone[];
  wbs?: WBSPhase[];
  team?: Collaborator[];
  analysis?: ProjectAnalysis;
  isAnalyzing?: boolean;
  intelligence?: ProjectIntelligence; // Cached intelligence
  
  // Execution Artifacts
  activeAgents?: ActiveAgent[];
  automationRules?: AutomationRule[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  context: string;
}
