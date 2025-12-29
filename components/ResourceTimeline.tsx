
import React, { useRef, useMemo, useEffect } from 'react';
import { Project } from '../types';

interface ResourceTimelineProps {
  projects: Project[];
  onFocus: (project: Project) => void;
  activeProjectId: string | null;
}

interface Conflict {
  projectIds: string[];
  members: string[];
}

const Avatar: React.FC<{ name: string; size?: string; highlight?: boolean }> = ({ name, size = 'w-6 h-6', highlight }) => (
  <div className={`${size} rounded-full bg-white border ${highlight ? 'border-amber-400 ring-1 ring-amber-400' : 'border-gray-100'} shadow-sm flex items-center justify-center text-[8px] font-bold text-gray-500 z-10 relative`}>
    {name.split(' ').map(n => n[0]).join('')}
  </div>
);

const ResourceTimeline: React.FC<ResourceTimelineProps> = ({ projects, onFocus, activeProjectId }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Timeline Settings
  const weeksToShow = 12;
  const weekWidth = 160; 
  const totalWidth = weeksToShow * weekWidth;
  
  // Start date: 2 weeks ago to show some history context
  const startDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14 - d.getDay()); // Start ~2 weeks ago Sunday
    return d;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      // Scroll to "Today" minus some padding (approx 2 weeks in)
      scrollRef.current.scrollLeft = 100;
    }
  }, []);

  // Helper to calculate position based on dates
  const getPosition = (projectDateStr?: string, durationWeeks: number = 8) => {
    if (!projectDateStr) return { left: 0, width: 0, startWeek: 0, endWeek: 0 };
    
    const projStart = new Date(projectDateStr);
    const diffTime = projStart.getTime() - startDate.getTime();
    const diffWeeks = diffTime / (1000 * 60 * 60 * 24 * 7);
    
    return {
      left: diffWeeks * weekWidth,
      width: durationWeeks * weekWidth,
      startWeek: diffWeeks,
      endWeek: diffWeeks + durationWeeks
    };
  };

  // Conflict Detection Logic
  const conflicts = useMemo(() => {
    const map: Record<string, Conflict> = {};
    
    for (let i = 0; i < projects.length; i++) {
      for (let j = i + 1; j < projects.length; j++) {
        const p1 = projects[i];
        const p2 = projects[j];
        
        const p1Pos = getPosition(p1.startDate, parseInt(p1.duration));
        const p2Pos = getPosition(p2.startDate, parseInt(p2.duration));

        // Check time overlap
        const overlaps = Math.max(p1Pos.startWeek, p2Pos.startWeek) < Math.min(p1Pos.endWeek, p2Pos.endWeek);
        
        if (overlaps) {
          const team1 = p1.team || [];
          const team2 = p2.team || [];
          const sharedMembers = team1.filter(m1 => team2.some(m2 => m2.id === m1.id)).map(m => m.name);

          if (sharedMembers.length > 0) {
            const conflictKey = [p1.id, p2.id].sort().join('-');
            map[conflictKey] = { projectIds: [p1.id, p2.id], members: sharedMembers };
          }
        }
      }
    }
    return map;
  }, [projects, startDate]);

  const getProjectConflicts = (projectId: string) => {
    const projectConflicts: string[] = [];
    Object.values(conflicts).forEach(c => {
      if (c.projectIds.includes(projectId)) {
        projectConflicts.push(...c.members);
      }
    });
    return [...new Set(projectConflicts)]; // Unique names
  };

  // Generate Week Headers
  const weeks = Array.from({ length: weeksToShow }).map((_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + (i * 7));
    const isCurrent = new Date() >= d && new Date() < new Date(d.getTime() + 7*24*60*60*1000);
    return {
      label: `Week ${i + 1}`,
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isCurrent
    };
  });

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm">
      {/* Left Sidebar: Projects List */}
      <div className="w-72 border-r border-gray-100 bg-gray-50/30 flex flex-col z-20 shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
        <div className="h-16 border-b border-gray-100 flex items-end pb-3 px-6 bg-white shrink-0">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Engagement / Team</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-6 space-y-6 pb-6">
          {projects.map(p => {
            const conflictMembers = getProjectConflicts(p.id);
            const hasConflict = conflictMembers.length > 0;

            return (
              <div 
                key={p.id} 
                onClick={() => onFocus(p)}
                className={`h-16 px-6 flex flex-col justify-center cursor-pointer transition-colors border-l-4 ${activeProjectId === p.id ? 'bg-blue-50/50 border-blue-500' : 'border-transparent hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-start">
                  <h4 className={`text-[13px] font-medium truncate ${activeProjectId === p.id ? 'text-blue-700' : 'text-gray-700'}`}>{p.name}</h4>
                  {hasConflict && (
                    <div className="text-[10px] text-amber-500 font-bold flex items-center bg-amber-50 px-1.5 rounded" title={`Resource Conflict: ${conflictMembers.join(', ')}`}>
                      ⚠️
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-gray-400 truncate max-w-[100px]">{p.client}</span>
                  <div className="flex -space-x-1.5">
                    {p.team?.map(m => (
                      <div key={m.id} title={m.name}>
                        <Avatar name={m.name} size="w-5 h-5" highlight={conflictMembers.includes(m.name)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Area: Scrolling Timeline */}
      <div 
        className="flex-1 overflow-auto relative custom-scrollbar bg-[#fafafa]/30" 
        ref={scrollRef}
      >
         <div style={{ width: totalWidth, minWidth: '100%' }} className="relative min-h-full flex flex-col">
            
            {/* Sticky Header Row */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-100 flex h-16 items-end shrink-0">
              {weeks.map((w, i) => (
                <div key={i} className="flex-shrink-0 border-r border-gray-50/50 flex flex-col justify-end pb-3 pl-3" style={{ width: weekWidth }}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${w.isCurrent ? 'text-emerald-500' : 'text-gray-300'}`}>
                    {w.label}
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono">{w.date}</span>
                </div>
              ))}
            </div>

            {/* Grid Body */}
            <div className="flex-1 pt-6 pb-6 space-y-6 relative">
              {/* Vertical Grid Lines (Background) */}
              <div className="absolute inset-0 flex pointer-events-none h-full">
                {weeks.map((w, i) => (
                  <div key={i} className={`flex-shrink-0 border-r ${w.isCurrent ? 'border-emerald-50 bg-emerald-50/20' : 'border-gray-100/50'} h-full`} style={{ width: weekWidth }}>
                     {w.isCurrent && (
                        <div className="h-full border-l-2 border-emerald-500/20 border-dashed ml-1" />
                     )}
                  </div>
                ))}
              </div>

              {/* Project Bars */}
              {projects.map((p) => {
                const { left, width } = getPosition(p.startDate, parseInt(p.duration) || 8);
                const conflictMembers = getProjectConflicts(p.id);
                const hasConflict = conflictMembers.length > 0;
                const isAtRisk = p.status === 'At Risk';
                
                return (
                  <div key={p.id} className="h-16 relative flex items-center group">
                    <div 
                      className={`h-10 rounded-xl absolute shadow-sm border flex items-center px-4 overflow-hidden cursor-pointer transition-all hover:shadow-md hover:scale-[1.005] z-10 ${
                        hasConflict 
                          ? 'bg-amber-50 border-amber-300 shadow-amber-100'
                          : isAtRisk 
                            ? 'bg-red-50 border-red-200 shadow-red-50' 
                            : 'bg-white border-blue-100 shadow-blue-50'
                      }`}
                      style={{ left: Math.max(0, left + 20), width: Math.max(weekWidth, width) }}
                      onClick={() => onFocus(p)}
                    >
                      {/* Progress Fill */}
                      <div className={`absolute top-0 bottom-0 left-0 bg-opacity-10 ${hasConflict ? 'bg-amber-500 w-full animate-pulse' : isAtRisk ? 'bg-red-500 w-1/3' : 'bg-blue-500 w-2/3'}`} />
                      
                      {/* Content */}
                      <div className="relative z-10 flex justify-between items-center w-full">
                        <div className="flex flex-col min-w-0 pr-4">
                          <span className={`text-[11px] font-bold uppercase tracking-widest truncate ${hasConflict ? 'text-amber-800' : isAtRisk ? 'text-red-800' : 'text-blue-700'}`}>
                            {p.phase} Phase
                          </span>
                          {hasConflict && <span className="text-[9px] font-bold text-amber-600 truncate">Conflict: {conflictMembers[0]}</span>}
                        </div>

                        <div className="flex -space-x-2 shrink-0">
                          {p.team?.map(m => (
                            <div key={m.id} className="relative transition-transform hover:scale-110 hover:z-20">
                              <Avatar name={m.name} size="w-6 h-6" highlight={conflictMembers.includes(m.name)} />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Milestones Dots */}
                      {p.milestones?.map((_, idx) => (
                        <div 
                          key={idx}
                          className={`absolute bottom-0 w-1 h-1 rounded-full mb-1 z-20 ${hasConflict ? 'bg-amber-400' : 'bg-blue-300'}`}
                          style={{ left: `${(idx / (p.milestones?.length || 1)) * 90}%` }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
           </div>
         </div>
      </div>
    </div>
  );
};

export default ResourceTimeline;
