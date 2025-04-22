export type GoalCategory = 'personal' | 'professional' | 'learning' | 'health' | 'other';
export type GoalPriority = 'low' | 'medium' | 'high';
export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold';

export interface Milestone {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  _id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
  progress: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalFormData {
  title: string;
  description?: string;
  category: GoalCategory;
  priority: GoalPriority;
  startDate: string;
  endDate: string;
}

export interface MilestoneFormData {
  title: string;
  description?: string;
  dueDate: string;
}
