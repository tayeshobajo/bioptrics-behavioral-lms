'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<any>;
  onClick?: (e: React.MouseEvent) => void;
}

interface MenuGroups {
  [key: string]: MenuItem[];
}

const menuGroups: MenuGroups = {
  Personal: [
    { name: 'My Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'My Courses', href: '/dashboard/courses', icon: BookOpenIcon },
    { name: 'My Performance', href: '/dashboard/performance', icon: ChartBarIcon },
    { name: 'Action Tracker', href: '/dashboard/action-tracker', icon: ClipboardDocumentCheckIcon },
    { name: 'My Notes', href: '/dashboard/notes', icon: DocumentTextIcon },
    { name: 'My Tools', href: '/dashboard/tools', icon: WrenchScrewdriverIcon },
  ],
  'Need Help?': [
    { name: 'Help/Support', href: '/dashboard/help', icon: QuestionMarkCircleIcon },
    { name: 'Program Support', href: '/dashboard/program-support', icon: UserGroupIcon },
    { 
      name: 'Log Out', 
      href: '#',
      icon: ArrowLeftOnRectangleIcon,
      onClick: async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Logout failed');
          }

          // Clear local storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // Redirect to home page
          window.location.href = '/';
        } catch (error) {
          console.error('Error during logout:', error);
          // Force clear storage and redirect even if API call fails
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
        }
      }
    },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={`fixed left-4 top-4 flex h-[calc(100vh-2rem)] flex-col rounded-xl bg-[#97C646] shadow-xl transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 space-y-8 p-4">
        {Object.entries(menuGroups).map(([groupName, items]) => (
          <div key={groupName}>
            {!isCollapsed && (
              <h3 className="px-3 text-sm font-bold text-black/70">{groupName}</h3>
            )}
            <div className={`mt-2 space-y-1 ${isCollapsed ? 'px-2' : ''}`}>
              {items.map((item) => {
                const isActive = pathname === item.href;
                return item.onClick ? (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className={`group flex w-full items-center rounded-md px-3 py-2 text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-black/10 text-black'
                        : 'text-black hover:bg-black/5 hover:translate-x-1'
                    }`}
                    title={isCollapsed ? item.name : ''}
                  >
                    <item.icon
                      className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
                        isActive ? 'text-black' : 'text-black/70 group-hover:scale-110'
                      } ${!isCollapsed ? 'mr-3' : ''}`}
                      aria-hidden="true"
                    />
                    {!isCollapsed && item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-md px-3 py-2 text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-black/10 text-black'
                        : 'text-black hover:bg-black/5 hover:translate-x-1'
                    }`}
                    title={isCollapsed ? item.name : ''}
                  >
                    <item.icon
                      className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
                        isActive ? 'text-black' : 'text-black/70 group-hover:scale-110'
                      } ${!isCollapsed ? 'mr-3' : ''}`}
                      aria-hidden="true"
                    />
                    {!isCollapsed && item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
