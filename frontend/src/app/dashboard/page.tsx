'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CourseCard from '@/components/dashboard/CourseCard';
import {
  AcademicCapIcon,
  ClockIcon,
  BookOpenIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { API_URL } from '@/lib/config';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: {
    slug: string;
  };
}

interface CourseEnrollment {
  id: number;
  course: {
    title: string;
    description: string;
    thumbnail_url: string;
    slug: string;
  };
  progress: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }

        // Fetch fresh user data from API
        const response = await fetch(`${API_URL}/api/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUser(userData);
        
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(userData));

        // Fetch courses after user data is loaded
        const coursesResponse = await fetch(`${API_URL}/api/learning/courses/enrolled`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          credentials: 'include'
        });
        
        if (!coursesResponse.ok) {
          throw new Error('Failed to fetch courses');
        }

        const coursesData = await coursesResponse.json();
        setEnrollment(coursesData.enrollments[0]); // Get the first enrollment
      } catch (error) {
        console.error('Error fetching data:', error);
        // Clear data and redirect on error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const stats = [
    {
      name: 'Active Courses',
      value: '3',
      icon: AcademicCapIcon,
      change: '+2 this month',
    },
    {
      name: 'Hours Spent Learning',
      value: '24.5',
      icon: ClockIcon,
      change: '+5.2 this week',
    },
    {
      name: 'Completed Courses',
      value: '8',
      icon: BookOpenIcon,
      change: '+1 this month',
    },
    {
      name: 'Average Score',
      value: '92%',
      icon: StarIcon,
      change: '+2% this month',
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#97C646] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null; // Let the layout handle the redirect
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.first_name}!
        </h2>
        <p className="mt-1 text-sm text-gray-600">Continue your learning journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon
                  className="h-6 w-6 text-[#552A47]"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="ml-2">
                      <span className="text-sm text-gray-500">
                        {stat.change}
                      </span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course section */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900">Your Course</h3>
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {enrollment && (
            <CourseCard
              title={enrollment.course.title}
              description={enrollment.course.description}
              thumbnailUrl={enrollment.course.thumbnail_url}
              progress={enrollment.progress}
              slug={enrollment.course.slug}
            />
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Activity
          </h3>
          <div className="mt-6">
            <div className="text-center text-sm text-gray-500">
              No recent activity to show
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
