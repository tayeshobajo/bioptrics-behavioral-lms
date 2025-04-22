'use client';

import { GoalFormData, GoalCategory, GoalPriority } from '@/types/goals';
import { useState } from 'react';

interface GoalFormProps {
  initialData?: Partial<GoalFormData>;
  onSubmit: (data: GoalFormData) => Promise<void>;
  onCancel: () => void;
}

const categories: { value: GoalCategory; label: string }[] = [
  { value: 'personal', label: 'Personal' },
  { value: 'professional', label: 'Professional' },
  { value: 'learning', label: 'Learning' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' }
];

const priorities: { value: GoalPriority; label: string }[] = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' }
];

export default function GoalForm({ initialData, onSubmit, onCancel }: GoalFormProps) {
  const [formData, setFormData] = useState<GoalFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'personal',
    priority: initialData?.priority || 'medium',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-[#552A47] focus:outline-none focus:ring-1 focus:ring-[#552A47] sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-[#552A47] focus:outline-none focus:ring-1 focus:ring-[#552A47] sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as GoalCategory })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-[#552A47] focus:outline-none focus:ring-1 focus:ring-[#552A47] sm:text-sm"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            required
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as GoalPriority })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-[#552A47] focus:outline-none focus:ring-1 focus:ring-[#552A47] sm:text-sm"
          >
            {priorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-[#552A47] focus:outline-none focus:ring-1 focus:ring-[#552A47] sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            required
            min={formData.startDate}
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-[#552A47] focus:outline-none focus:ring-1 focus:ring-[#552A47] sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#552A47] focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-md border border-transparent bg-[#552A47] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#552A47]/90 focus:outline-none focus:ring-2 focus:ring-[#552A47] focus:ring-offset-2"
        >
          {isSubmitting ? 'Saving...' : 'Save Goal'}
        </button>
      </div>
    </form>
  );
}
