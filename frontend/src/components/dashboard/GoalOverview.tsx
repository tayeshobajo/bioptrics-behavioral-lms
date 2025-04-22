'use client';

import { Goal } from '@/types/goals';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/config';
import Link from 'next/link';
import ProgressBar from '../shared/ProgressBar';
import { FlagIcon } from '@heroicons/react/24/outline';

export default function GoalOverview() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/goals?limit=3`, {
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

  if (loading) {
    return (
      <div className="h-[300px] rounded-lg border border-gray-200 bg-white">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Goal Progress</h2>
          <div className="mt-6">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Goal Progress</h2>
          <Link
            href="/goals"
            className="text-sm font-medium text-[#552A47] hover:text-[#552A47]/90"
          >
            View all
          </Link>
        </div>

        <div className="mt-6 space-y-6">
          {goals.length === 0 ? (
            <div className="text-center">
              <FlagIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No goals yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first goal.</p>
              <div className="mt-6">
                <Link
                  href="/goals"
                  className="inline-flex items-center rounded-md bg-[#552A47] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#552A47]/90"
                >
                  Create Goal
                </Link>
              </div>
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal._id} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href={`/goals/${goal._id}`}
                    className="truncate text-sm font-medium text-gray-900 hover:text-[#552A47]"
                  >
                    {goal.title}
                  </Link>
                  <span className="flex-none text-xs text-gray-500">
                    {goal.milestones.filter((m) => m.completed).length} of{' '}
                    {goal.milestones.length} milestones
                  </span>
                </div>
                <ProgressBar progress={goal.progress} size="sm" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
