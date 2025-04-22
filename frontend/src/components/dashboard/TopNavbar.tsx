'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'My Dashboard', href: '/dashboard' },
  { name: 'My Courses', href: '/dashboard/courses' },
];

export default function TopNavbar() {
  const [notifications] = useState(3); // Example notification count

  return (
    <header className="mb-4 rounded-xl bg-[#552a47] shadow-lg">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/dashboard">
            <img
              src="https://teamsynergprograms.com/wp-content/uploads/2024/06/cropped-TeamSynerG_Global_Consulting_logo_White-04.png"
              alt="TeamSynerG Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex md:space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="inline-flex items-center px-1 pt-1 text-sm font-bold text-white hover:text-white/80"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            type="button"
            className="relative rounded-full p-1 text-white hover:text-white/80"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            {notifications > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {notifications}
              </span>
            )}
          </button>

          {/* Profile */}
          <Link
            href="/dashboard/profile"
            className="flex items-center space-x-2 rounded-full p-1 text-white hover:text-white/80"
          >
            <UserCircleIcon className="h-8 w-8" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
