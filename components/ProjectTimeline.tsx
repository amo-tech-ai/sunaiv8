
import React, { useEffect, useState } from 'react';
import { Project, Milestone } from '../types';

interface ProjectTimelineProps {
  project: Project;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ project }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  if (!project.milestones || project.milestones.length === 0) {
    return (
      <div className="p-8 border-t border-gray-100 bg-gray-50/30 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Timeline Not Generated</span>
        <p className="text-[13px] text-gray-500 font-serif italic">Use the Planner Agent to generate a roadmap for this project.</p>
      </div>
    );
  }

  const effortColors = {
    'Low': 'bg-gray-200 border-gray-300',
    'Medium': 'bg-blue-200 border-blue-300',
    'High': 'bg-emerald-200 border-emerald-300'
  };

  return (
    <div className="w-full overflow-x-auto p-8 pt-4 pb-12 border-t border-gray-100 bg-gray-50/20 custom-scrollbar">
      <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-8 sticky left-0">Project Roadmap</h3>
      
      <div className="relative min-w-[800px] flex items-start space-x-12 px-4">
        {/* Connection Line */}
        <div className="absolute top-[19px] left-0 right-0 h-[2px] bg-gray-100 -z-10">
          <div 
            className={`h-full bg-emerald-500/20 transition-all duration-[1500ms] ease-out ${animate ? 'w-full' : 'w-0'}`}
          />
        </div>

        {project.milestones.map((milestone, index) => (
          <div 
            key={index} 
            className={`relative flex flex-col items-center group transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            {/* Node */}
            <div className={`w-10 h-10 rounded-full border-2 bg-white flex items-center justify-center mb-6 shadow-sm z-10 transition-transform group-hover:scale-110 ${effortColors[milestone.effort]}`}>
              <span className="text-[10px] font-bold text-gray-700">{index + 1}</span>
            </div>

            {/* Content */}
            <div className="text-center w-40">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">{milestone.week}</span>
              <h4 className="text-[13px] font-medium text-gray-900 mb-2 leading-tight">{milestone.title}</h4>
              <p className="text-[11px] text-gray-500 font-serif italic leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                {milestone.description}
              </p>
            </div>

            {/* Connector Dot */}
            <div className={`absolute top-[48px] w-0.5 h-4 bg-gray-200 group-hover:h-8 group-hover:bg-emerald-300 transition-all duration-300 -z-10`} />
          </div>
        ))}
        
        {/* End Node */}
        <div className={`relative flex flex-col items-center transition-all duration-1000 delay-[1000ms] ${animate ? 'opacity-100' : 'opacity-0'}`}>
           <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mb-6 shadow-lg">
              <span className="text-[14px] text-white">🏁</span>
           </div>
           <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Launch</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
