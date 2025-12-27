
import { ActionItem, Activity, Contact, DashboardStats, Collaborator, Project, Service } from './types';

export const COLLABORATORS: Record<string, Collaborator> = {
  js: { id: 'js', name: 'Julian Smith' },
  aa: { id: 'aa', name: 'Amara Akoto' },
  lm: { id: 'lm', name: 'Leo Meyer' },
};

export const STATS: DashboardStats = {
  activeProjects: 6,
  openTasks: 24,
  activeClients: 12,
  networkSize: 1420,
  networkGrowth: [1100, 1150, 1220, 1280, 1350, 1420]
};

export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'AI Support Chatbot', client: 'Luxury E-commerce Brand', type: 'AI', phase: 'Training', duration: '6 weeks', status: 'On Track', description: 'Advanced customer support agent with RAG integration.' },
  { id: 'p2', name: 'SaaS Dashboard Platform', client: 'Fintech Startup', type: 'Web App', phase: 'Development', duration: '12 weeks', status: 'On Track', description: 'Real-time financial analytics dashboard.' },
  { id: 'p3', name: 'Shopify Headless Store', client: 'Premium Retail Brand', type: 'E-commerce', phase: 'Staging', duration: '10 weeks', status: 'At Risk', description: 'Custom Hydrogen-based storefront.' },
];

export const MOCK_SERVICES: Service[] = [
  { id: 's1', category: 'Strategy', name: 'Brand Positioning', description: 'Defining the core ethos and market placement.', price: 'From $35k', duration: '6-8 weeks' },
  { id: 's2', category: 'Creative', name: 'Campaign Direction', description: 'Visual storytelling and thematic development.', price: 'From $50k', duration: '8-12 weeks' },
];

export const MOCK_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Sophie Beaumont',
    role: 'Head of Digital',
    company: 'Luxe Commerce Group',
    lastContact: '2d ago',
    status: 'Active',
    category: 'Designer',
    engagementType: 'AI Chatbot',
    dealValue: '$45k',
    score: 72,
    pipelineStage: 'Discovery',
    completeness: 85,
    bio: 'Looking to automate high-volume support tickets for their boutique luxury line.',
    interactions: [
      { id: 'i1', date: '2024-05-10', type: 'Meeting', note: 'Initial SS25 strategy session.', outcome: 'Positive' },
      { id: 'i2', date: '2024-05-15', type: 'RSVP', note: 'Confirmed for Private Viewing event.' }
    ],
    deals: [
      { id: 'd1', title: 'SS25 Launch Support', value: '$45k', stage: 'Discovery', closeDate: '2024-06-30', linkedCampaign: 'SS25 Heritage' }
    ],
    placements: ['Vogue Business', 'WWD']
  },
  {
    id: 'c2',
    name: 'Marcus Thorne',
    role: 'Fashion Editor',
    company: 'Vogue France',
    lastContact: '35d ago',
    status: 'Active',
    category: 'Press',
    engagementType: 'Editorial Integration',
    dealValue: '$12k',
    score: 88,
    pipelineStage: 'Proposal',
    completeness: 60,
    bio: 'Key editorial contact for the European market.',
    interactions: [
      { id: 'i3', date: '2024-04-20', type: 'Call', note: 'Briefing on upcoming client roster.' }
    ],
    deals: [],
    placements: ['Paris Fashion Week Feature']
  },
  {
    id: 'c3',
    name: 'Unknown Lead',
    role: 'Lead Buyer',
    company: 'Harrods London',
    lastContact: '1w ago',
    status: 'Lead',
    category: 'Buyer',
    pipelineStage: 'Discovery',
    completeness: 30,
    bio: 'Inbound inquiry from contact form regarding showroom access.',
    interactions: [],
    deals: [],
    placements: []
  }
];

export const NEXT_ACTIONS: ActionItem[] = [
  {
    id: '1',
    title: 'Review project requirements',
    project: 'Maison Laurent SS25',
    priority: 'High',
    description: 'Finalize the creative brief for the upcoming Spring/Summer 2025 campaign.',
    collaborators: [COLLABORATORS.js, COLLABORATORS.aa],
    // Fix: Removed 'timeline' and 'phase' as they are not properties of ActionItem interface
    status: 'Backlog'
  }
];

export const RECENT_ACTIVITY: Activity[] = [
  { id: 'a1', title: 'Project brief approved', project: 'Maison Laurent', time: '2h ago' }
];

export const NAV_ITEMS = [
  { name: 'Home', active: false },
  { name: 'Main', active: true },
  { name: 'Projects', active: false },
  { name: 'Tasks', active: false },
  { name: 'Services', active: false },
  { name: 'CRM', active: true },
  { name: 'Client Dashboard', active: false },
];
