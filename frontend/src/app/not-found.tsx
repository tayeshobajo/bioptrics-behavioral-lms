'use client';

import { useRouter } from 'next/navigation';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleHomeClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <ExclamationTriangleIcon 
            className="h-12 w-12 text-[#552A47]" 
            aria-hidden="true" 
          />
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Page not found
              </h1>
              <p className="mt-3 text-base text-gray-500">
                Sorry, we couldn't find the page you're looking for.
              </p>
            </div>
            <div className="mt-8 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <button
                onClick={handleHomeClick}
                className="inline-flex items-center rounded-md bg-[#552A47] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#552A47]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#552A47]"
              >
                {isAuthenticated ? 'Go to dashboard' : 'Go back home'}
              </button>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Go back
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
