import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'guest-favorite' | 'superhost' | 'rating' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    'guest-favorite': 'bg-amber-50 text-amber-900 border border-amber-200/60 font-semibold',
    superhost: 'bg-rose-50 text-[#FF385C] border border-rose-100 font-semibold',
    rating: 'bg-slate-900 text-white font-bold',
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
