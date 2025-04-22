interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({ 
  progress, 
  size = 'md', 
  showLabel = true,
  className = '' 
}: ProgressBarProps) {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5'
  };

  const height = heights[size];
  const color = progress === 100 
    ? 'bg-green-600' 
    : 'bg-[#552A47]';

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <div className={`flex-grow overflow-hidden rounded-full bg-gray-200 ${height}`}>
          <div
            className={`${height} rounded-full ${color} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">
            {progress}%
          </span>
        )}
      </div>
    </div>
  );
}
