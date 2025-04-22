import { GoalPriority } from '@/types/goals';
import { TaskPriority } from '@/types/tasks';
import { FlagIcon } from '@heroicons/react/24/outline';

type Priority = GoalPriority | TaskPriority;

const priorityConfigs: Record<Priority, { color: string; label: string }> = {
  low: {
    color: 'bg-green-100 text-green-800',
    label: 'Low Priority'
  },
  medium: {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Medium Priority'
  },
  high: {
    color: 'bg-red-100 text-red-800',
    label: 'High Priority'
  }
};

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
  showLabel?: boolean;
}

export default function PriorityBadge({ priority, className = '', showLabel = true }: PriorityBadgeProps) {
  const config = priorityConfigs[priority];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color} ${className}`}>
      <FlagIcon className="h-3.5 w-3.5" />
      {showLabel && config.label}
    </span>
  );
}
