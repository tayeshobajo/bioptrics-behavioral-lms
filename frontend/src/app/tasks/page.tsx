'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Task, TaskCategory, TaskFormData, TaskStats as TaskStatsType } from '@/types/tasks';
import { API_URL } from '@/lib/config';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import TaskStats from '@/components/tasks/TaskStats';
import EmptyState from '@/components/shared/EmptyState';
import { ClipboardDocumentListIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

type TaskFilter = 'all' | 'pending' | 'in_progress' | 'completed';

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStatsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const [tasksResponse, statsResponse] = await Promise.all([
        fetch(`${API_URL}/api/tasks`, {
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

  const handleCreateTask = async (formData: TaskFormData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const data = await response.json();
      setTasks([data.task, ...tasks]);
      await fetchTasks(); // Refresh stats
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleToggleTaskStatus = async (taskId: string) => {
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

      const data = await response.json();
      setTasks(tasks.map(t => (t._id === taskId ? data.task : t)));
      await fetchTasks(); // Refresh stats
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(t => t._id !== taskId));
      await fetchTasks(); // Refresh stats
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filter === 'all' || task.status === filter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">My Tasks</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your daily, weekly, and monthly tasks efficiently.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center rounded-md bg-[#552A47] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#552A47]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#552A47]"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Task
            </button>
          </div>
        </div>

        <div className="mt-8">
          <TaskStats stats={stats} />
        </div>

        <div className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-[#552A47] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  filter === 'pending'
                    ? 'bg-[#552A47] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('in_progress')}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  filter === 'in_progress'
                    ? 'bg-[#552A47] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  filter === 'completed'
                    ? 'bg-[#552A47] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Completed
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as TaskCategory | 'all')}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:border-[#552A47] focus:outline-none focus:ring-1 focus:ring-[#552A47]"
              >
                <option value="all">All Categories</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-25">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#552A47] focus:ring-offset-2"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Create New Task
                    </h3>
                    <div className="mt-4">
                      <TaskForm
                        onSubmit={handleCreateTask}
                        onCancel={() => setShowForm(false)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          {tasks.length === 0 ? (
            <EmptyState
              title="No tasks yet"
              description="Get started by creating your first task"
              icon={ClipboardDocumentListIcon}
              actionLabel="New Task"
              onAction={() => setShowForm(true)}
            />
          ) : filteredTasks.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              No {filter === 'all' ? '' : filter} tasks found
              {categoryFilter !== 'all' ? ` in ${categoryFilter} category` : ''}
            </p>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleStatus={handleToggleTaskStatus}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
