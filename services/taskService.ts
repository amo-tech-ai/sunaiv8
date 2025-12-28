
import { ActionItem } from '../types';

/**
 * Creates a new task object with standard defaults.
 */
export const createNewTask = (taskData: Partial<ActionItem>): ActionItem => {
  return {
    id: `t-${Date.now()}`,
    title: taskData.title || 'Untitled Action',
    project: taskData.project || 'General',
    priority: taskData.priority || 'Medium',
    status: taskData.status || 'Backlog',
    linkedEntityId: taskData.linkedEntityId,
    linkedEntityType: taskData.linkedEntityType,
    dueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    ...taskData
  };
};

/**
 * Updates task status in a list.
 */
export const updateTaskStatusInList = (
  tasks: ActionItem[],
  taskId: string,
  status: ActionItem['status']
): ActionItem[] => {
  return tasks.map(t => t.id === taskId ? { ...t, status } : t);
};
