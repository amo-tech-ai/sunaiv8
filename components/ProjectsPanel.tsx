
import React, { useState } from 'react';
import { Project, FocusState } from '../types';
import ProjectTimeline from './ProjectTimeline';
import ResourceTimeline from './ResourceTimeline';

interface ProjectsPanelProps {
  projects: Project[];
  onFocus: (type: 'project', item: Project) => void;
  focus: FocusState;
  onAddProject: (p: Partial<Project>) => void;
  onNavigate?: (route: string) => void;
  onOpenIntelligence?: (project: Project) => void; // Added prop
}

const ProjectRow: React.FC<{ 
  project: Project; 
  isActive: boolean; 
  isExpanded: boolean;
  onClick: () => void;
  onToggleTimeline: (e: React.MouseEvent) => void;
  onOpenIntelligence?: () => void;
}> = ({ project, isActive, isExpanded, onClick, onToggleTimeline, onOpenIntelligence }) => {
  const badgeColors = {
    'AI': 'bg-purple-50 text-purple-600',
    'Web App': 'bg-blue-50 text-blue-600',
    'E-commerce': 'bg-emerald-50 text-emerald-600',
    'Web': 'bg-gray-50 text-gray-600'
  };

  const getStatusColor = () => {
    if (project.analysis) {
      if (project.analysis.riskScore > 70) return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
      if (project.analysis.riskScore > 30) return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
      return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    }
    return project.status === 'On Track' 
      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
      : project.status === 'At Risk' 
        ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' 
        : 'bg-gray-300';
  };

  return (
    <div className="mb-2">
      <div 
        onClick={onClick}
        className={`group flex items-center justify-between py-4 px-6 border rounded-lg cursor-pointer transition-all duration-200 relative z-10 ${
          isActive || isExpanded 
            ? 'bg-white border-gray-200 shadow-sm ring-1 ring-gray-100' 
            : 'bg-transparent border-transparent hover:bg-gray-50/50'
        }`}
      >
        <div className="flex-1 flex items-center space-x-6">
          <div className="flex items-center space-x-3 w-32 shrink-0">
            <div className="relative">
              <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${getStatusColor()}`} />
              {project.analysis && project.analysis.riskScore > 70 && (
                <div className="absolute -inset-1 bg-red-500 rounded-full animate-ping opacity-20" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest truncate leading-tight">{project.phase}</span>
              {project.analysis && (
                <span className={`text-[9px] font-bold mt-0.5 ${project.analysis.riskScore > 70 ? 'text-red-500' : 'text-gray-400'}`}>
                  Risk: {project.analysis.riskScore}
                </span>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-[15px] font-medium text-gray-900 leading-tight mb-0.5">{project.name}</h4>
            <p className="text-[13px] text-gray-400 font-serif italic">{project.client}</p>
          </div>
        </div>
        <div className="flex items-center space-x-8 text-[12px]">
          {/* Intelligence Trigger */}
          <button 
            onClick={(e) => { e.stopPropagation(); onOpenIntelligence && onOpenIntelligence(); }}
            className="hidden group-hover:flex items-center space-x-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-[9px] font-bold uppercase tracking-widest border border-purple-100 hover:bg-purple-100 transition-all"
          >
            <span>✨ View Intelligence</span>
          </button>

          {project.team && project.team.length > 0 && (
            <div className="flex -space-x-2">
              {project.team.map((m) => (
                <div 
                  key={m.id} 
                  title={m.name}
                  className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500 ring-2 ring-white"
                >
                  {m.name.split(' ').map(n => n[0]).join('')}
                </div>
              ))}
            </div>
          )}
          <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded font-bold ${badgeColors[project.type] || 'bg-gray-100'}`}>
            {project.type}
          </span>
          <div className="w-24 text-right">
            <span className="text-gray-400 uppercase tracking-tighter text-[9px] block mb-0.5">Duration</span>
            <span className="text-gray-700 font-medium">{project.duration}</span>
          </div>
          <button 
            onClick={onToggleTimeline}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-black text-white rotate-90' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            title="View Timeline"
          >
            →
          </button>
        </div>
      </div>
      
      {/* Expanded Timeline Section */}
      {isExpanded && (
        <div className="bg-white border-x border-b border-gray-100 rounded-b-lg -mt-2 pt-4 shadow-sm animate-in slide-in-from-top-2 duration-300">
          <ProjectTimeline project={project} />
        </div>
      )}
    </div>
  );
};

const ProjectsPanel: React.FC<ProjectsPanelProps> = ({ projects, onFocus, focus, onAddProject, onNavigate, onOpenIntelligence }) => {
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const handleToggleTimeline = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    setExpandedProjectId(prev => prev === projectId ? null : projectId);
  };

  const handleCreateProject = () => {
    if (onNavigate) {
      onNavigate('AI Wizard');
    }
  };

  return (
    <div className="flex-1 h-screen overflow-hidden flex flex-col bg-[#fafafa]">
      <header className="p-12 pb-6 flex-shrink-0">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="font-serif text-3xl mb-4 tracking-tight">Active Engagements</h1>
            <p className="text-[14px] text-gray-400">
              {projects.length} total engagements · {projects.filter(p => p.status === 'At Risk' || (p.analysis && p.analysis.riskScore > 50)).length} at risk
            </p>
          </div>
          <button 
            onClick={handleCreateProject}
            className="bg-black text-white px-6 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
          >
            + New Project
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-6 border-b border-gray-100">
          <button 
            onClick={() => setViewMode('list')}
            className={`text-[12px] uppercase tracking-[0.2em] font-bold pb-3 border-b-2 transition-all ${
              viewMode === 'list' ? 'text-black border-black' : 'text-gray-300 border-transparent hover:text-gray-500'
            }`}
          >
            Portfolio List
          </button>
          <button 
            onClick={() => setViewMode('timeline')}
            className={`text-[12px] uppercase tracking-[0.2em] font-bold pb-3 border-b-2 transition-all ${
              viewMode === 'timeline' ? 'text-black border-black' : 'text-gray-300 border-transparent hover:text-gray-500'
            }`}
          >
            Resource Timeline
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-12 pb-32">
        {viewMode === 'list' ? (
          projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">✧</div>
              <p className="text-[14px] text-gray-500 font-serif italic mb-6">No projects yet.</p>
            </div>
          ) : (
            <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {projects.map((project) => (
                <ProjectRow 
                  key={project.id} 
                  project={project} 
                  isActive={focus.id === project.id}
                  isExpanded={expandedProjectId === project.id}
                  onClick={() => onFocus('project', project)}
                  onToggleTimeline={(e) => handleToggleTimeline(e, project.id)}
                  onOpenIntelligence={() => onOpenIntelligence && onOpenIntelligence(project)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="h-full pb-8 animate-in fade-in duration-500">
            <ResourceTimeline 
              projects={projects} 
              onFocus={(p) => onFocus('project', p)}
              activeProjectId={focus.id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPanel;
