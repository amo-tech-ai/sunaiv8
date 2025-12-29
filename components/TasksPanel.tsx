
import React, { useState, useMemo } from 'react';
import { ActionItem, FocusState, Collaborator, Priority } from '../types';
import { COLLABORATORS } from '../constants';

interface TasksPanelProps {
  tasks: ActionItem[];
  onFocus: (type: 'task', item: ActionItem) => void;
  focus: FocusState;
  onUpdateTaskStatus: (id: string, status: ActionItem['status']) => void;
  onUpdateTask: (id: string, updates: Partial<ActionItem>) => void;
  onDeleteTask: (id: string) => void;
  onLinkTasks?: (dependentId: string, blockerId: string) => void;
}

const AvatarStack: React.FC<{ users?: Collaborator[]; onAdd?: () => void }> = ({ users, onAdd }) => {
  return (
    <div className="flex items-center">
      <div className="flex -space-x-1.5 overflow-hidden">
        {users?.slice(0, 3).map((user) => (
          <div
            key={user.id}
            title={user.name}
            className="inline-block h-5 w-5 rounded-full ring-1 ring-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500 border border-gray-200"
          >
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
        ))}
        {users && users.length > 3 && (
          <div className="inline-block h-5 w-5 rounded-full ring-1 ring-white bg-gray-50 flex items-center justify-center text-[8px] font-bold text-gray-400 border border-gray-200">
            +{users.length - 3}
          </div>
        )}
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onAdd && onAdd(); }}
        className="ml-1 w-5 h-5 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400 hover:border-black hover:text-black transition-colors"
      >
        +
      </button>
    </div>
  );
};

const TaskCard: React.FC<{
  task: ActionItem;
  isActive: boolean;
  isBlocked: boolean;
  isBlocking: boolean;
  isReady: boolean;
  isLinkMode: boolean;
  isLinkSource: boolean;
  onClick: () => void;
  onUpdate: (updates: Partial<ActionItem>) => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onHover: (id: string | null) => void;
}> = ({ task, isActive, isBlocked, isBlocking, isReady, isLinkMode, isLinkSource, onClick, onUpdate, onDelete, onDragStart, onHover }) => {
  const [showAssigneeMenu, setShowAssigneeMenu] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);

  const priorityColors = {
    'High': 'text-red-600 bg-red-50 border-red-100',
    'Medium': 'text-amber-600 bg-amber-50 border-amber-100',
    'Low': 'text-gray-500 bg-gray-50 border-gray-100'
  };

  const cyclePriority = (e: React.MouseEvent) => {
    e.stopPropagation();
    const map: Record<Priority, Priority> = { 'High': 'Medium', 'Medium': 'Low', 'Low': 'High' };
    onUpdate({ priority: map[task.priority] });
  };

  const handleAssign = (collaborator: Collaborator) => {
    const current = task.collaborators || [];
    if (!current.find(c => c.id === collaborator.id)) {
      onUpdate({ collaborators: [...current, collaborator] });
    }
    setShowAssigneeMenu(false);
  };

  const isOverdue = useMemo(() => {
    if (!task.dueDate || task.status === 'Done') return false;
    return new Date(task.dueDate) < new Date();
  }, [task.dueDate, task.status]);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      onMouseEnter={() => onHover(task.id)}
      onMouseLeave={() => onHover(null)}
      className={`p-4 rounded-xl border transition-all cursor-grab active:cursor-grabbing mb-3 select-none outline-none group relative bg-white ${
        isActive
        ? 'border-black shadow-md ring-1 ring-black/5 scale-[1.02] z-10'
        : isLinkMode && isLinkSource
          ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50'
          : isBlocked
            ? 'border-red-200 bg-red-50/20'
            : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      {isBlocked && (
        <div className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full shadow-sm border border-red-200 z-20" title="Blocked by dependency">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
      )}
      {isReady && !isBlocked && (
        <div className="absolute -top-2 -right-2 bg-emerald-100 text-emerald-600 p-1 rounded-full shadow-sm border border-emerald-200 z-20 animate-pulse" title="Ready to start">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <button 
          onClick={cyclePriority}
          className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border hover:opacity-80 transition-opacity ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </button>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
            title="Delete Task"
          >
            ✕
          </button>
        </div>
      </div>
      <h4 className="text-[14px] font-medium text-gray-900 leading-snug mb-3 group-hover:text-black transition-colors">{task.title}</h4>
      
      <div className="flex justify-between items-end pt-3 border-t border-gray-50">
        <div className="flex flex-col max-w-[50%]">
          <span className="text-[10px] text-gray-400 uppercase tracking-tighter block mb-0.5">Context</span>
          <span className="text-[11px] font-serif italic text-gray-600 truncate">{task.project}</span>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
           <div className="relative">
             <AvatarStack users={task.collaborators} onAdd={() => setShowAssigneeMenu(!showAssigneeMenu)} />
             {showAssigneeMenu && (
               <div className="absolute right-0 top-6 bg-white border border-gray-100 rounded-lg shadow-xl p-1 z-50 w-32">
                 {Object.values(COLLABORATORS).map(c => (
                   <button 
                     key={c.id} 
                     onClick={(e) => { e.stopPropagation(); handleAssign(c); }}
                     className="block w-full text-left px-2 py-1.5 text-[11px] hover:bg-gray-50 rounded"
                   >
                     {c.name}
                   </button>
                 ))}
               </div>
             )}
           </div>
           
           <div 
             className={`text-[10px] tabular-nums font-medium flex items-center space-x-1 cursor-pointer hover:bg-gray-50 px-1.5 py-0.5 rounded ${isOverdue ? 'text-red-500' : 'text-gray-300'}`}
             onClick={(e) => { e.stopPropagation(); setIsEditingDate(true); }}
           >
             {isEditingDate ? (
               <input 
                 type="date" 
                 autoFocus
                 className="bg-transparent outline-none border-b border-gray-300 w-24"
                 onBlur={() => setIsEditingDate(false)}
                 onChange={(e) => { onUpdate({ dueDate: e.target.value }); setIsEditingDate(false); }}
                 onClick={(e) => e.stopPropagation()}
               />
             ) : (
               <>
                 {isOverdue && <span>⚠️</span>}
                 <span>{task.dueDate || 'Set Date'}</span>
               </>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

const Confetti: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
    <div className="animate-[ping_1s_ease-out_infinite] text-6xl opacity-20">🎉</div>
    <style>{`
      @keyframes floatUp {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-150px) rotate(360deg); opacity: 0; }
      }
      .confetti-piece {
        position: absolute;
        width: 8px;
        height: 8px;
        background: #10B981;
        animation: floatUp 1.5s ease-out forwards;
      }
    `}</style>
    {Array.from({ length: 30 }).map((_, i) => (
      <div 
        key={i}
        className="confetti-piece rounded-sm"
        style={{
          left: `${50 + (Math.random() * 40 - 20)}%`,
          top: '60%',
          backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
          animationDelay: `${Math.random() * 0.5}s`,
          transform: `scale(${0.5 + Math.random()})`
        }}
      />
    ))}
  </div>
);

const TasksPanel: React.FC<TasksPanelProps> = ({ tasks, onFocus, focus, onUpdateTaskStatus, onUpdateTask, onDeleteTask, onLinkTasks }) => {
  const statuses: ActionItem['status'][] = ['Backlog', 'In Progress', 'Review', 'Done'];
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  
  // Link Mode State
  const [isLinkMode, setIsLinkMode] = useState(false);
  const [linkSourceId, setLinkSourceId] = useState<string | null>(null);

  // Filters State
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterProject, setFilterProject] = useState<string>('All');
  const [filterAssignee, setFilterAssignee] = useState<string>('All');

  const uniqueProjects = useMemo(() => ['All', ...Array.from(new Set(tasks.map(t => t.project)))], [tasks]);
  const uniqueAssignees = useMemo(() => {
    const all = tasks.flatMap(t => t.collaborators || []);
    return ['All', ...Array.from(new Set(all.map(c => c.name)))];
  }, [tasks]);

  // Derived Dependencies Map
  const dependenciesMap = useMemo(() => {
    const map = new Map<string, string[]>(); // TaskId -> List of dependent IDs (who is blocked by this task)
    tasks.forEach(t => {
      if (t.dependencies) {
        t.dependencies.forEach(depId => {
          const existing = map.get(depId) || [];
          map.set(depId, [...existing, t.id]);
        });
      }
    });
    return map;
  }, [tasks]);

  // Derived Task States
  const taskStates = useMemo(() => {
    const states: Record<string, { blocked: boolean; ready: boolean }> = {};
    tasks.forEach(t => {
      if (!t.dependencies || t.dependencies.length === 0) {
        states[t.id] = { blocked: false, ready: false };
        return;
      }
      const blockers = tasks.filter(b => t.dependencies?.includes(b.id));
      const allDone = blockers.every(b => b.status === 'Done');
      states[t.id] = { blocked: !allDone, ready: allDone && t.status === 'Backlog' };
    });
    return states;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchPrio = filterPriority === 'All' || t.priority === filterPriority;
      const matchProj = filterProject === 'All' || t.project === filterProject;
      const matchAssign = filterAssignee === 'All' || t.collaborators?.some(c => c.name === filterAssignee);
      return matchPrio && matchProj && matchAssign;
    });
  }, [tasks, filterPriority, filterProject, filterAssignee]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: ActionItem['status']) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (draggedTaskId) {
      if (status === 'Done') {
        triggerConfetti();
      }
      onUpdateTaskStatus(draggedTaskId, status);
    }
    setDraggedTaskId(null);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleTaskClick = (task: ActionItem) => {
    if (isLinkMode && onLinkTasks) {
      if (!linkSourceId) {
        setLinkSourceId(task.id); // Select Blocker
      } else {
        if (task.id !== linkSourceId) {
          onLinkTasks(task.id, linkSourceId); // Task depends on LinkSource
          setLinkSourceId(null);
          setIsLinkMode(false);
        }
      }
    } else {
      onFocus('task', task);
    }
  };

  return (
    <div className="flex-1 h-screen overflow-hidden flex flex-col bg-[#fafafa] relative">
      {showConfetti && <Confetti />}
      
      <header className="p-12 pb-6 flex justify-between items-end flex-shrink-0">
        <div>
          <h1 className="font-serif text-3xl mb-4 tracking-tight">Execution Board</h1>
          <div className="flex items-center space-x-3">
             <select 
               className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[11px] font-bold text-gray-500 outline-none focus:border-black"
               value={filterPriority}
               onChange={(e) => setFilterPriority(e.target.value)}
             >
               <option value="All">Priority: All</option>
               <option value="High">High</option>
               <option value="Medium">Medium</option>
               <option value="Low">Low</option>
             </select>
             
             <select 
               className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[11px] font-bold text-gray-500 outline-none focus:border-black max-w-[140px]"
               value={filterProject}
               onChange={(e) => setFilterProject(e.target.value)}
             >
               {uniqueProjects.map(p => <option key={p} value={p}>{p === 'All' ? 'Project: All' : p}</option>)}
             </select>

             <select 
               className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[11px] font-bold text-gray-500 outline-none focus:border-black"
               value={filterAssignee}
               onChange={(e) => setFilterAssignee(e.target.value)}
             >
               {uniqueAssignees.map(a => <option key={a} value={a}>{a === 'All' ? 'Assignee: All' : a}</option>)}
             </select>
          </div>
        </div>
        <div className="flex items-center space-x-4">
           {onLinkTasks && (
             <button 
               onClick={() => { setIsLinkMode(!isLinkMode); setLinkSourceId(null); }}
               className={`px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all shadow-sm ${
                 isLinkMode ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-white border border-gray-200 text-gray-500 hover:text-black'
               }`}
             >
               {isLinkMode ? (linkSourceId ? 'Select Dependent Task' : 'Select Blocker Task') : '🔗 Link Tasks'}
             </button>
           )}
           <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">
             {tasks.filter(t => t.status === 'Done').length} Completed
           </span>
           <button className="bg-black text-white px-6 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-sm active:scale-95">
             + Quick Task
           </button>
        </div>
      </header>

      {/* Helper Banner for Link Mode */}
      {isLinkMode && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-2 rounded-full shadow-lg text-[12px] font-bold animate-in fade-in slide-in-from-top-4">
          {linkSourceId ? "Select the task that is BLOCKED by the highlighted task" : "Select the BLOCKER task first"}
        </div>
      )}

      <div className="flex-1 overflow-x-auto p-12 pt-4 flex space-x-6 scroll-smooth pb-12 items-start">
        {statuses.map((status) => {
          const colTasks = filteredTasks.filter(t => t.status === status);
          const isOver = dragOverColumn === status;
          
          return (
            <div 
              key={status} 
              className={`w-80 flex-shrink-0 flex flex-col h-full rounded-2xl transition-colors duration-300 ${isOver ? 'bg-gray-100/50 ring-2 ring-gray-200' : ''}`}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="flex items-center justify-between mb-4 px-1 py-2">
                <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400">{status}</h3>
                <span className="text-[10px] text-gray-300 font-bold bg-white border border-gray-100 px-2 py-0.5 rounded-full">{colTasks.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-1 min-h-[150px]">
                {colTasks.length === 0 && !isOver ? (
                  <div className="h-32 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Empty</span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const isBlocked = taskStates[task.id]?.blocked;
                    const isReady = taskStates[task.id]?.ready;
                    // Check if this task is blocking the currently hovered task, OR if it is blocked BY the currently hovered task
                    const isRelated = hoveredTaskId 
                      ? (tasks.find(t => t.id === hoveredTaskId)?.dependencies?.includes(task.id) || task.dependencies?.includes(hoveredTaskId))
                      : false;
                    
                    return (
                      <div key={task.id} className={`transition-all duration-300 ${isRelated ? 'ring-2 ring-amber-300 scale-[1.02]' : ''}`}>
                        <TaskCard 
                          task={task} 
                          isActive={focus.id === task.id}
                          isBlocked={isBlocked}
                          isBlocking={dependenciesMap.has(task.id)}
                          isReady={isReady}
                          isLinkMode={isLinkMode}
                          isLinkSource={linkSourceId === task.id}
                          onClick={() => handleTaskClick(task)}
                          onUpdate={(updates) => onUpdateTask(task.id, updates)}
                          onDelete={() => onDeleteTask(task.id)}
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onHover={setHoveredTaskId}
                        />
                      </div>
                    );
                  })
                )}
                {/* Drop Target Hint */}
                {isOver && (
                  <div className="h-24 border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-xl animate-pulse flex items-center justify-center">
                    <span className="text-[10px] text-blue-300 uppercase tracking-widest font-bold">Drop Here</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksPanel;
