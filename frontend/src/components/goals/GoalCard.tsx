'use client';

import { Goal } from '@/types/goals';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import StatusBadge from '../shared/StatusBadge';
import PriorityBadge from '../shared/PriorityBadge';
import ProgressBar from '../shared/ProgressBar';

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  const completedMilestones = goal.milestones.filter(m => m.completed).length;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              <Link href={`/goals/${goal._id}`} className="hover:underline">
                {goal.title}
              </Link>
            </h3>
            {goal.description && (
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                {goal.description}
              </p>
            )}
          </div>
          <PriorityBadge priority={goal.priority} showLabel={false} />
        </div>

        <div className="mt-4 flex items-center gap-4">
          <StatusBadge status={goal.status} />
          <span className="text-sm text-gray-500">
            Created {formatDistanceToNow(new Date(goal.createdAt), { addSuffix: true })}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Progress</span>
            <span className="text-gray-500">
              {completedMilestones} of {goal.milestones.length} milestones
            </span>
          </div>
          <ProgressBar progress={goal.progress} size="sm" showLabel={false} />
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-500">Due</span>
          <time className="text-gray-700" dateTime={goal.endDate}>
            {new Date(goal.endDate).toLocaleDateString()}
          </time>
        </div>
      </div>
    </div>
  );
}
