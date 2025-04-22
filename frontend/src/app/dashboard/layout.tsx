'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      // Clear any potentially invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
      return;
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area with dynamic margin */}
      <div className="ml-24 transition-all duration-300 lg:ml-72">
        {/* Top Navigation */}
        <TopNavbar />

        {/* Page content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
