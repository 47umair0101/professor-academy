import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'indigo' | 'neutral' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md';
  hasDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'indigo',
  size = 'md',
  hasDot = false,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-medium tracking-normal select-none rounded-full leading-tight';

  const variants = {
    gold: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const dotColors = {
    gold: 'bg-amber-500',
    indigo: 'bg-indigo-600',
    neutral: 'bg-slate-500',
    success: 'bg-emerald-500',
    danger: 'bg-rose-500',
    warning: 'bg-amber-500',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {hasDot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
