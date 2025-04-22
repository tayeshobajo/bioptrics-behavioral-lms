import { GoalStatus } from '@/types/goals';
import { TaskStatus } from '@/types/tasks';
import { CheckCircleIcon, ClockIcon, PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

type Status = GoalStatus | TaskStatus;

interface StatusConfig {
  label: string;
  color: string;
  icon: typeof CheckCircleIcon;
}

const statusConfigs: Record<Status, StatusConfig> = {
  not_started: {
    label: 'Not Started',
    color: 'bg-gray-100 text-gray-800',
    icon: ClockIcon
  },
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800',
    icon: PlayCircleIcon
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon
  },
  on_hold: {
    label: 'On Hold',
    color: 'bg-orange-100 text-orange-800',
    icon: PauseCircleIcon
  }
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfigs[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color} ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
