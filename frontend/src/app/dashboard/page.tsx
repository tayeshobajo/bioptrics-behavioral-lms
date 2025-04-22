'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CourseCard from '@/components/dashboard/CourseCard';
import GoalOverview from '@/components/dashboard/GoalOverview';
import NotificationSection from '@/components/dashboard/NotificationSection';
import TaskOverview from '@/components/dashboard/TaskOverview';
import {
  AcademicCapIcon,
  ClockIcon,
  BookOpenIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { API_URL } from '@/lib/config';
import Link from 'next/link';

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

interface Course {
  title: string;
  description: string;
  thumbnail_url: string;
  slug: string;
}

interface CourseEnrollment {
  id: string;
  course: Course;
  progress: number;
  started_at: string;
  completed_at: string | null;
}

interface EnrollmentsResponse {
  enrollments: CourseEnrollment[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      try {
        // Fetch user data
        const response = await fetch(`${API_URL}/api/user`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-requested-with': 'XMLHttpRequest',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);

        // Fetch notifications
        const notificationsResponse = await fetch(`${API_URL}/api/notifications`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-requested-with': 'XMLHttpRequest',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData.notifications);
        }

        // Fetch enrolled courses
        const coursesResponse = await fetch(`${API_URL}/api/learning/courses/enrolled`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-requested-with': 'XMLHttpRequest',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        if (!coursesResponse.ok) {
          throw new Error('Failed to fetch courses');
        }

        const coursesData: EnrollmentsResponse = await coursesResponse.json();
        setEnrollments(coursesData.enrollments);
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

    fetchData();
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">Welcome back! Here's an overview of your progress.</p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <GoalOverview />
          <TaskOverview />
        </div>

        <div className="mt-8">
          <NotificationSection notifications={notifications} />
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
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
        </div>

        <div className="mt-8">
          <div className="h-full rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">My Courses</h3>
                {enrollments.length > 0 && (
                  <span className="flex h-6 items-center justify-center rounded-full bg-[#552A47]/10 px-2 text-xs font-medium text-[#552A47]">
                    {enrollments.length}
                  </span>
                )}
              </div>
              <Link
                href="/dashboard/courses"
                className="text-sm font-medium text-[#552A47] hover:text-[#552A47]/80"
              >
                View all
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {enrollments.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-6 text-center">
                  <AcademicCapIcon className="h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No courses enrolled yet</p>
                </div>
              ) : (
                <>
                  {enrollments.map((enrollment) => (
                    <CourseCard
                      key={enrollment.id}
                      title={enrollment.course.title}
                      description={enrollment.course.description}
                      thumbnailUrl={enrollment.course.thumbnail_url}
                      progress={enrollment.progress}
                      slug={enrollment.course.slug}
                    />
                  ))}
                  {enrollments.length > 4 && (
                    <Link
                      href="/dashboard/courses"
                      className="col-span-full block w-full rounded-lg border border-dashed border-gray-300 py-3 text-center text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                      View all courses
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg bg-white shadow">
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
    </div>
  );
}
