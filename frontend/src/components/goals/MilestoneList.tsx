'use client';

import { Milestone } from '@/types/goals';
import { CheckIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface MilestoneListProps {
  milestones: Milestone[];
  onToggle?: (milestoneId: string) => Promise<void>;
  onDelete?: (milestoneId: string) => Promise<void>;
}

export default function MilestoneList({ milestones, onToggle, onDelete }: MilestoneListProps) {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {milestones.map((milestone, milestoneIdx) => (
          <li key={milestone._id}>
            <div className="relative pb-8">
              {milestoneIdx !== milestones.length - 1 ? (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => onToggle?.(milestone._id)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        milestone.completed
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                      } ring-8 ring-white transition-colors`}
                    >
                      <CheckIcon
                        className={`h-5 w-5 ${milestone.completed ? 'text-white' : 'text-gray-500'}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-gray-900">{milestone.title}</div>
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(milestone._id)}
                          className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    {milestone.description && (
                      <p className="mt-0.5 text-gray-500">{milestone.description}</p>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <time dateTime={milestone.dueDate}>
                      Due {formatDistanceToNow(new Date(milestone.dueDate), { addSuffix: true })}
                    </time>
                    {milestone.completed && milestone.completedAt && (
                      <span className="text-green-600">
                        Completed{' '}
                        {formatDistanceToNow(new Date(milestone.completedAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
