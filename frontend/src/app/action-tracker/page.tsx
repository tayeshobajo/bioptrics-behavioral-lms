'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Goal } from '@/types/goals';
import { Task, TaskStats } from '@/types/tasks';
import { API_URL } from '@/lib/config';
import GoalCard from '@/components/goals/GoalCard';
import TaskCard from '@/components/tasks/TaskCard';
import GoalForm from '@/components/goals/GoalForm';
import TaskForm from '@/components/tasks/TaskForm';
import TaskStats from '@/components/tasks/TaskStats';
import EmptyState from '@/components/shared/EmptyState';
import { ClipboardDocumentListIcon, FlagIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

type View = 'goals' | 'tasks';
type GoalFilter = 'all' | 'active' | 'completed';
type TaskFilter = 'all' | 'pending' | 'in_progress' | 'completed';

export default function ActionTrackerPage() {
  const router = useRouter();
  const [view, setView] = useState<View>('goals');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [goalFilter, setGoalFilter] = useState<GoalFilter>('all');
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const [goalsResponse, tasksResponse, statsResponse] = await Promise.all([
        fetch(`${API_URL}/api/goals`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
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

      if (!goalsResponse.ok || !tasksResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [goalsData, tasksData, statsData] = await Promise.all([
        goalsResponse.json(),
        tasksResponse.json(),
        statsResponse.json()
      ]);

      setGoals(goalsData.goals);
      setTasks(tasksData.tasks);
      setStats(statsData.stats);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/goals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create goal');
      }

      await fetchData();
      setShowGoalForm(false);
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleCreateTask = async (formData: any) => {
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

      await fetchData();
      setShowTaskForm(false);
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

      await fetchData();
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

      await fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredGoals = goals.filter(goal => {
    switch (goalFilter) {
      case 'active':
        return goal.status !== 'completed';
      case 'completed':
        return goal.status === 'completed';
      default:
        return true;
    }
  });

  const filteredTasks = tasks.filter(task => {
    switch (taskFilter) {
      case 'pending':
        return task.status === 'pending';
      case 'in_progress':
        return task.status === 'in_progress';
      case 'completed':
        return task.status === 'completed';
      default:
        return true;
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Action Tracker</h1>
            <p className="mt-2 text-sm text-gray-700">
              Track and manage your goals and tasks in one place.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3 sm:ml-16 sm:mt-0">
            <button
              type="button"
              onClick={() => setShowGoalForm(true)}
              className="inline-flex items-center rounded-md bg-[#552A47] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#552A47]/90"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
              New Goal
            </button>
            <button
              type="button"
              onClick={() => setShowTaskForm(true)}
              className="inline-flex items-center rounded-md bg-[#552A47] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#552A47]/90"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
              New Task
            </button>
          </div>
        </div>

        <div className="mt-8">
          <TaskStats stats={stats} />
        </div>

        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex gap-6" aria-label="Tabs">
              <button
                onClick={() => setView('goals')}
                className={`border-b-2 px-1 pb-4 text-sm font-medium ${
                  view === 'goals'
                    ? 'border-[#552A47] text-[#552A47]'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Goals
              </button>
              <button
                onClick={() => setView('tasks')}
                className={`border-b-2 px-1 pb-4 text-sm font-medium ${
                  view === 'tasks'
                    ? 'border-[#552A47] text-[#552A47]'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Tasks
              </button>
            </nav>
          </div>

          <div className="mt-4">
            {view === 'goals' ? (
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <button
                    onClick={() => setGoalFilter('all')}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                      goalFilter === 'all'
                        ? 'bg-[#552A47] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Goals
                  </button>
                  <button
                    onClick={() => setGoalFilter('active')}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                      goalFilter === 'active'
                        ? 'bg-[#552A47] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setGoalFilter('completed')}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                      goalFilter === 'completed'
                        ? 'bg-[#552A47] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Completed
                  </button>
                </div>

                {goals.length === 0 ? (
                  <EmptyState
                    title="No goals yet"
                    description="Get started by creating your first goal"
                    icon={FlagIcon}
                    actionLabel="New Goal"
                    onAction={() => setShowGoalForm(true)}
                  />
                ) : filteredGoals.length === 0 ? (
                  <p className="text-center text-sm text-gray-500">
                    No {goalFilter === 'completed' ? 'completed' : 'active'} goals found
                  </p>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredGoals.map((goal) => (
                      <GoalCard key={goal._id} goal={goal} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <button
                    onClick={() => setTaskFilter('all')}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                      taskFilter === 'all'
                        ? 'bg-[#552A47] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Tasks
                  </button>
                  <button
                    onClick={() => setTaskFilter('pending')}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                      taskFilter === 'pending'
                        ? 'bg-[#552A47] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setTaskFilter('in_progress')}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                      taskFilter === 'in_progress'
                        ? 'bg-[#552A47] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setTaskFilter('completed')}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                      taskFilter === 'completed'
                        ? 'bg-[#552A47] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Completed
                  </button>
                </div>

                {tasks.length === 0 ? (
                  <EmptyState
                    title="No tasks yet"
                    description="Get started by creating your first task"
                    icon={ClipboardDocumentListIcon}
                    actionLabel="New Task"
                    onAction={() => setShowTaskForm(true)}
                  />
                ) : filteredTasks.length === 0 ? (
                  <p className="text-center text-sm text-gray-500">
                    No {taskFilter === 'all' ? '' : taskFilter} tasks found
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
            )}
          </div>
        </div>
      </div>

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-25">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#552A47] focus:ring-offset-2"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Create New Goal
                  </h3>
                  <div className="mt-4">
                    <GoalForm
                      onSubmit={handleCreateGoal}
                      onCancel={() => setShowGoalForm(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-25">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
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
                      onCancel={() => setShowTaskForm(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
