import React from 'react';
import { Project, FocusState } from '../types';

interface ProjectsPanelProps {
  projects: Project[];
  onFocus: (type: 'project', item: Project) => void;
  focus: FocusState;
}

const ProjectRow: React.FC<{ project: Project; isActive: boolean; onClick: () => void }> = ({ project, isActive, onClick }) => {
  const badgeColors = {
    'AI': 'bg-purple-50 text-purple-600',
    'Web App': 'bg-blue-50 text-blue-600',
    'E-commerce': 'bg-emerald-50 text-emerald-600',
    'Web': 'bg-gray-50 text-gray-600'
  };

  return (
    <div 
      onClick={onClick}
      className={`group flex items-center justify-between py-4 px-6 border border-transparent rounded-lg cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-white border-gray-200 shadow-sm ring-1 ring-gray-100' : 'hover:bg-gray-50/50'
      }`}
    >
      <div className="flex-1 flex items-center space-x-4">
        <div className={`w-1.5 h-1.5 rounded-full ${
          project.status === 'On Track' ? 'bg-emerald-500' : 
          project.status === 'At Risk' ? 'bg-amber-500' : 'bg-gray-300'
        }`} />
        <div>
          <h4 className="text-[15px] font-medium text-gray-900 leading-tight mb-0.5">{project.name}</h4>
          <p className="text-[13px] text-gray-400 font-serif italic">{project.client}</p>
        </div>
      </div>
      <div className="flex items-center space-x-8 text-[12px]">
        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded font-bold ${badgeColors[project.type] || 'bg-gray-100'}`}>
          {project.type}
        </span>
        <div className="w-24">
          <span className="text-gray-400 uppercase tracking-tighter text-[9px] block mb-0.5">Duration</span>
          <span className="text-gray-700 font-medium">{project.duration}</span>
        </div>
      </div>
    </div>
  );
};

const ProjectsPanel: React.FC<ProjectsPanelProps> = ({ projects, onFocus, focus }) => {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#fafafa] p-12 pb-32">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl mb-4 tracking-tight">Projects</h1>
          <p className="text-[14px] text-gray-400">
            {projects.length} total engagements · {projects.filter(p => p.status === 'At Risk').length} at risk
          </p>
        </div>
        <button className="bg-black text-white px-6 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-sm">
          Create Project
        </button>
      </header>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">✧</div>
          <p className="text-[14px] text-gray-500 font-serif italic mb-6">No projects yet. Start your first AI or web engagement.</p>
          <button className="text-[11px] uppercase tracking-widest font-bold border-b border-black pb-1">Create project</button>
        </div>
      ) : (
        <div className="space-y-1">
          {projects.map((project) => (
            <ProjectRow 
              key={project.id} 
              project={project} 
              isActive={focus.id === project.id}
              onClick={() => onFocus('project', project)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPanel;