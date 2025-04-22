'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

interface NotificationSectionProps {
  notifications: Notification[];
}

export default function NotificationSection({ notifications }: NotificationSectionProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-full rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-900">Recent Notifications</h3>
          {unreadCount > 0 && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#552A47] text-xs font-medium text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <Link
          href="/dashboard/notifications"
          className="text-sm font-medium text-[#552A47] hover:text-[#552A47]/80"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <BellIcon className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`relative rounded-lg border p-4 ${
                  notification.read ? 'border-gray-100 bg-white' : 'border-[#552A47]/10 bg-[#552A47]/5'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate text-sm font-medium text-gray-900">{notification.title}</h4>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{notification.message}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-[#552A47]" />
                  )}
                </div>
              </div>
            ))}
            <Link
              href="/dashboard/notifications"
              className="block w-full rounded-lg border border-dashed border-gray-300 py-3 text-center text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
              View all notifications
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
