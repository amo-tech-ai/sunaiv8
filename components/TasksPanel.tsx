
import React, { useState } from 'react';
import { ActionItem, FocusState } from '../types';

interface TasksPanelProps {
  tasks: ActionItem[];
  onFocus: (type: 'task', item: ActionItem) => void;
  focus: FocusState;
  onUpdateTaskStatus: (id: string, status: ActionItem['status']) => void;
  onDeleteTask: (id: string) => void;
}

const TaskCard: React.FC<{ 
  task: ActionItem; 
  isActive: boolean; 
  onClick: () => void;
  onUpdateStatus: (s: ActionItem['status']) => void;
  onDelete: () => void;
}> = ({ task, isActive, onClick, onUpdateStatus, onDelete }) => {
  const priorityColors = {
    'High': 'text-red-600 bg-red-50 border-red-100',
    'Medium': 'text-amber-600 bg-amber-50 border-amber-100',
    'Low': 'text-gray-500 bg-gray-50 border-gray-100'
  };

  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all cursor-pointer mb-3 select-none outline-none group relative ${
        isActive 
        ? 'bg-white border-black shadow-md ring-1 ring-black/5 scale-[1.02]' 
        : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.status !== 'Done' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateStatus('Done'); }}
              className="text-[10px] text-emerald-600 font-bold hover:scale-110"
              title="Mark as Done"
            >
              ✓
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-[10px] text-red-300 font-bold hover:text-red-600"
            title="Delete Task"
          >
            ✕
          </button>
        </div>
      </div>
      <h4 className="text-[14px] font-medium text-gray-900 leading-snug mb-2 group-hover:text-black transition-colors">{task.title}</h4>
      <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-50">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase tracking-tighter block">Context</span>
          <span className="text-[11px] font-serif italic text-gray-600 truncate max-w-[120px]">{task.project}</span>
        </div>
        <span className="text-[11px] text-gray-400 tabular-nums font-medium">{task.dueDate || 'No Date'}</span>
      </div>
    </div>
  );
};

const TasksPanel: React.FC<TasksPanelProps> = ({ tasks, onFocus, focus, onUpdateTaskStatus, onDeleteTask }) => {
  const statuses: ActionItem['status'][] = ['Backlog', 'In Progress', 'Review', 'Done'];

  return (
    <div className="flex-1 h-screen overflow-hidden flex flex-col bg-[#fafafa]">
      <header className="p-12 pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl mb-4 tracking-tight">Execution Board</h1>
          <p className="text-[14px] text-gray-400">Manage operational outcomes through structured AI workflows.</p>
        </div>
        <button className="bg-black text-white px-6 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-sm">
          New Task
        </button>
      </header>

      <div className="flex-1 overflow-x-auto p-12 pt-4 flex space-x-8 scroll-smooth pb-24">
        {statuses.map((status) => {
          const colTasks = tasks.filter(t => t.status === status);
          return (
            <div key={status} className="w-72 flex-shrink-0 flex flex-col">
              <div className="flex items-center justify-between mb-6 px-1">
                <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400">{status}</h3>
                <span className="text-[10px] text-gray-300 font-bold">{colTasks.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-1">
                {colTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    isActive={focus.id === task.id}
                    onClick={() => onFocus('task', task)}
                    onUpdateStatus={(s) => onUpdateTaskStatus(task.id, s)}
                    onDelete={() => onDeleteTask(task.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksPanel;
