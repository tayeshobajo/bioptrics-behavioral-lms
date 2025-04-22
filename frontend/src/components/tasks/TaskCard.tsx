'use client';

import { Task } from '@/types/tasks';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import StatusBadge from '../shared/StatusBadge';
import PriorityBadge from '../shared/PriorityBadge';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (taskId: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export default function TaskCard({ task, onToggleStatus, onDelete }: TaskCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task._id);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleStatus(task._id);
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggle}
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  task.status === 'completed'
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300'
                }`}
              >
                {task.status === 'completed' && (
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <h3
                className={`text-sm font-medium ${
                  task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}
              >
                {task.title}
              </h3>
            </div>
            {task.description && (
              <p className="mt-1 text-sm text-gray-500">{task.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} showLabel={false} />
            <button
              onClick={handleDelete}
              className="rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-500"
            >
              <span className="sr-only">Delete task</span>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <StatusBadge status={task.status} />
          <span className="text-gray-500">
            Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
          </span>
          {task.relatedGoal && (
            <Link
              href={`/goals/${task.relatedGoal._id}`}
              className="rounded-full bg-[#552A47]/10 px-2 py-1 text-[#552A47] hover:bg-[#552A47]/20"
            >
              {task.relatedGoal.title}
            </Link>
          )}
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-1 text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
