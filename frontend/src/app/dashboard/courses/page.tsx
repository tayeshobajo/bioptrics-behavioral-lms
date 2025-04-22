'use client';

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Courses</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your enrolled courses
        </p>
      </div>
      
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <div className="text-center text-sm text-gray-500">
            No courses available yet
          </div>
        </div>
      </div>
    </div>
  );
}
