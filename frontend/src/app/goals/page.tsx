'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Goal } from '@/types/goals';
import { API_URL } from '@/lib/config';
import GoalCard from '@/components/goals/GoalCard';
import GoalForm from '@/components/goals/GoalForm';
import EmptyState from '@/components/shared/EmptyState';
import { FlagIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

type GoalFilter = 'all' | 'active' | 'completed';

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<GoalFilter>('all');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/goals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }

      const data = await response.json();
      setGoals(data.goals);
    } catch (error) {
      console.error('Error fetching goals:', error);
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

      const data = await response.json();
      setGoals([data.goal, ...goals]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const filteredGoals = goals.filter(goal => {
    switch (filter) {
      case 'active':
        return goal.status !== 'completed';
      case 'completed':
        return goal.status === 'completed';
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
            <h1 className="text-2xl font-semibold text-gray-900">Goal Planner</h1>
            <p className="mt-2 text-sm text-gray-700">
              Organize your goals effortlessly. Set, track, and achieve your milestones with clarity and focus.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center rounded-md bg-[#552A47] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#552A47]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#552A47]"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Goal
            </button>
          </div>
        </div>

        <div className="mt-6 sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-[#552A47] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Goals
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  filter === 'active'
                    ? 'bg-[#552A47] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Active
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
                      Create New Goal
                    </h3>
                    <div className="mt-4">
                      <GoalForm
                        onSubmit={handleCreateGoal}
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
          {goals.length === 0 ? (
            <EmptyState
              title="No goals yet"
              description="Get started by creating your first goal"
              icon={FlagIcon}
              actionLabel="New Goal"
              onAction={() => setShowForm(true)}
            />
          ) : filteredGoals.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              No {filter === 'completed' ? 'completed' : 'active'} goals found
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGoals.map((goal) => (
                <GoalCard key={goal._id} goal={goal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
