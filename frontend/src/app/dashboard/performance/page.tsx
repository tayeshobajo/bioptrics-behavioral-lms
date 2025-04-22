'use client';

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Performance</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your learning progress and achievements
        </p>
      </div>
      
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <div className="text-center text-sm text-gray-500">
            Performance data will be available once you start your courses
          </div>
        </div>
      </div>
    </div>
  );
}
