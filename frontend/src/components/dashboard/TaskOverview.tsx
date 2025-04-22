'use client';

import { Task, TaskStats } from '@/types/tasks';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/config';
import Link from 'next/link';
import StatusBadge from '../shared/StatusBadge';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function TaskOverview() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const [tasksResponse, statsResponse] = await Promise.all([
        fetch(`${API_URL}/api/tasks?limit=5`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_URL}/api/tasks/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!tasksResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch tasks data');
      }

      const [tasksData, statsData] = await Promise.all([
        tasksResponse.json(),
        statsResponse.json()
      ]);

      setTasks(tasksData.tasks);
      setStats(statsData.stats);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;

      const newStatus = task.status === 'completed' ? 'pending' : 'completed';

      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      await fetchTasks(); // Refresh both tasks and stats
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-[300px] rounded-lg border border-gray-200 bg-white">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
          <div className="mt-6">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
          <Link
            href="/tasks"
            className="text-sm font-medium text-[#552A47] hover:text-[#552A47]/90"
          >
            View all
          </Link>
        </div>

        <div className="mt-6">
          {stats.length > 0 && (
            <div className="mb-6 grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat._id} className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-500">
                    {stat._id.charAt(0).toUpperCase() + stat._id.slice(1)}
                  </p>
                  <p className="mt-1 flex items-baseline">
                    <span className="text-2xl font-semibold text-gray-900">{stat.total}</span>
                    <span className="ml-2 text-sm text-gray-500">tasks</span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="text-center">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first task.</p>
              <div className="mt-6">
                <Link
                  href="/tasks"
                  className="inline-flex items-center rounded-md bg-[#552A47] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#552A47]/90"
                >
                  Create Task
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-4"
                >
                  <button
                    onClick={() => handleToggleStatus(task._id)}
                    className={`mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full border ${
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

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-sm font-medium ${
                          task.status === 'completed'
                            ? 'text-gray-500 line-through'
                            : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </p>
                      <StatusBadge status={task.status} />
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                      {task.relatedGoal && (
                        <Link
                          href={`/goals/${task.relatedGoal._id}`}
                          className="rounded-full bg-[#552A47]/10 px-2 py-1 text-[#552A47] hover:bg-[#552A47]/20"
                        >
                          {task.relatedGoal.title}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2 text-center">
                <Link
                  href="/tasks"
                  className="text-sm font-medium text-[#552A47] hover:text-[#552A47]/90"
                >
                  View all tasks →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
