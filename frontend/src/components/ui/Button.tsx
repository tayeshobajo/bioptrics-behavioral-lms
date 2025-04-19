import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  fullWidth?: boolean;
}

export default function Button({ 
  children, 
  className, 
  variant = 'primary',
  fullWidth = false,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-[#552A47] text-[#ffffff] hover:bg-[#3d1e33]',
        variant === 'outline' && 'border border-[#552A47] text-[#552A47] hover:bg-[#552A47] hover:text-[#ffffff]',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
