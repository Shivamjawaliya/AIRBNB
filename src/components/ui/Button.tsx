'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-[#FF385C] hover:bg-[#E00B41] text-white focus:ring-[#FF385C]',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900 focus:ring-slate-300',
      outline: 'border border-slate-900 text-slate-900 hover:bg-slate-50 focus:ring-slate-400',
      ghost: 'hover:bg-slate-100 text-slate-700 hover:text-slate-900',
      gradient: 'bg-gradient-to-r from-[#FF385C] to-[#E00B41] text-white hover:opacity-95 shadow-md',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3.5 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
