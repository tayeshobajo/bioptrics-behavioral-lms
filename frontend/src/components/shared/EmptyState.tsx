import { PlusIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="text-center">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-[#552A47] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#552A47]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#552A47]"
          >
            <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
