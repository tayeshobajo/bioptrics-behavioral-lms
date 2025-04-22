export type TaskCategory = 'daily' | 'weekly' | 'monthly';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  tags: string[];
  relatedGoal?: {
    _id: string;
    title: string;
  };
  completedAt?: string;
  reminderDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  category: TaskCategory;
  tags?: string[];
  relatedGoal?: string;
  reminderDate?: string;
}

export interface TaskStats {
  _id: TaskCategory;
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
}
