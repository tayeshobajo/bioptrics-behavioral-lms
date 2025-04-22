import { TaskStats as TaskStatsType } from '@/types/tasks';

interface TaskStatsProps {
  stats: TaskStatsType[];
}

export default function TaskStats({ stats }: TaskStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat._id}
          className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
        >
          <dt>
            <p className="truncate text-sm font-medium text-gray-500">
              {stat._id.charAt(0).toUpperCase() + stat._id.slice(1)} Tasks
            </p>
          </dt>
          <dd className="mt-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.total}</p>
              <div className="ml-4 flex flex-col text-sm">
                <span className="text-green-600">{stat.completed} completed</span>
                <span className="text-blue-600">{stat.inProgress} in progress</span>
                <span className="text-yellow-600">{stat.pending} pending</span>
              </div>
            </div>
          </dd>
        </div>
      ))}
    </div>
  );
}
