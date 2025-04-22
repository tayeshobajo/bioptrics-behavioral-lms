'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Goal, MilestoneFormData } from '@/types/goals';
import { API_URL } from '@/lib/config';
import StatusBadge from '@/components/shared/StatusBadge';
import PriorityBadge from '@/components/shared/PriorityBadge';
import ProgressBar from '@/components/shared/ProgressBar';
import MilestoneList from '@/components/goals/MilestoneList';
import MilestoneForm from '@/components/goals/MilestoneForm';
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Props {
  params: {
    id: string;
  };
}

export default function GoalDetailPage({ params }: Props) {
  const router = useRouter();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  useEffect(() => {
    fetchGoal();
  }, [params.id]);

  const fetchGoal = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/goals/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch goal');
      }

      const data = await response.json();
      setGoal(data.goal);
    } catch (error) {
      console.error('Error fetching goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async (formData: MilestoneFormData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/goals/${params.id}/milestones`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add milestone');
      }

      const data = await response.json();
      setGoal(data.goal);
      setShowMilestoneForm(false);
    } catch (error) {
      console.error('Error adding milestone:', error);
    }
  };

  const handleToggleMilestone = async (milestoneId: string) => {
    try {
      const token = localStorage.getItem('token');
      const milestone = goal?.milestones.find(m => m._id === milestoneId);
      if (!milestone) return;

      const response = await fetch(`${API_URL}/api/goals/${params.id}/milestones/${milestoneId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completed: !milestone.completed
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update milestone');
      }

      const data = await response.json();
      setGoal(data.goal);
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/goals/${params.id}/milestones/${milestoneId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete milestone');
      }

      const data = await response.json();
      setGoal(data.goal);
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!goal) {
    return <div>Goal not found</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <button
          onClick={() => router.push('/goals')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Goals
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{goal.title}</h1>
              {goal.description && (
                <p className="mt-2 text-gray-500">{goal.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={goal.priority} />
              <StatusBadge status={goal.status} />
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(goal.startDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">End Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(goal.endDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Progress</dt>
              <dd className="mt-2">
                <ProgressBar progress={goal.progress} />
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Milestones</h2>
            <button
              type="button"
              onClick={() => setShowMilestoneForm(true)}
              className="inline-flex items-center rounded-md bg-[#552A47] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#552A47]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#552A47]"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Milestone
            </button>
          </div>

          {showMilestoneForm && (
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">New Milestone</h3>
                <button
                  type="button"
                  onClick={() => setShowMilestoneForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <MilestoneForm
                onSubmit={handleAddMilestone}
                onCancel={() => setShowMilestoneForm(false)}
              />
            </div>
          )}

          {goal.milestones.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              No milestones yet. Add some milestones to track your progress.
            </p>
          ) : (
            <MilestoneList
              milestones={goal.milestones}
              onToggle={handleToggleMilestone}
              onDelete={handleDeleteMilestone}
            />
          )}
        </div>
      </div>
    </div>
  );
}
