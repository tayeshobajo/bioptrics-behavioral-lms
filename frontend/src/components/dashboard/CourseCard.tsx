'use client';

import { PlayIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

interface CourseCardProps {
  title: string;
  description: string;
  thumbnailUrl: string;
  progress: number;
  slug: string;
}

export default function CourseCard({ title, description, thumbnailUrl, progress, slug }: CourseCardProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-transform hover:scale-[1.02]">
      <div className="relative h-48 w-full">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div 
              className="h-2 rounded-full bg-[#97C646]" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-600">{progress}% Complete</p>
        </div>

        {/* Action button */}
        <Link
          href={`/dashboard/courses/${slug}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#552a47] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#552a47]/90"
        >
          <PlayIcon className="h-5 w-5" />
          {progress > 0 ? 'Continue Course' : 'Start Course'}
        </Link>
      </div>
    </div>
  );
}
