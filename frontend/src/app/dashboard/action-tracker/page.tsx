'use client';

export default function ActionTrackerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Action Tracker</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage your learning action items
        </p>
      </div>
      
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <div className="text-center text-sm text-gray-500">
            No action items to track yet
          </div>
        </div>
      </div>
    </div>
  );
}
