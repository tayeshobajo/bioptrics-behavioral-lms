'use client';

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Notes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Access and manage your course notes
        </p>
      </div>
      
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <div className="text-center text-sm text-gray-500">
            You haven't created any notes yet
          </div>
        </div>
      </div>
    </div>
  );
}
