'use client';

import { MilestoneFormData } from '@/types/goals';
import { useState } from 'react';

interface MilestoneFormProps {
  onSubmit: (data: MilestoneFormData) => Promise<void>;
  onCancel: () => void;
}

export default function MilestoneForm({ onSubmit, onCancel }: MilestoneFormProps) {
  const [formData, setFormData] = useState<MilestoneFormData>({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0]
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-[#552A47] focus:outline-none focus:ring-1 focus:ring-[#552A47] sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          required
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-[#552A47] focus:outline-none focus:ring-1 focus:ring-[#552A47] sm:text-sm"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#552A47] focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-md border border-transparent bg-[#552A47] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#552A47]/90 focus:outline-none focus:ring-2 focus:ring-[#552A47] focus:ring-offset-2"
        >
          {isSubmitting ? 'Adding...' : 'Add Milestone'}
        </button>
      </div>
    </form>
  );
}
