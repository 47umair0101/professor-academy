import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'navy' | 'success' | 'warning' | 'danger' | 'neutral' | 'rose';
  size?: 'sm' | 'md';
  hasDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'navy',
  size = 'md',
  hasDot = false,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-medium transition-colors select-none rounded-full';

  const variants = {
    navy: 'bg-academic-navy/10 text-academic-navy border border-academic-navy/20',
    gold: 'bg-academic-gold/15 text-[#977313] border border-academic-gold/30',
    success: 'bg-academic-status-successBg text-academic-status-success border border-[#BBF7D0]',
    warning: 'bg-academic-status-warningBg text-academic-status-warning border border-[#FDE68A]',
    danger: 'bg-academic-status-dangerBg text-academic-status-danger border border-[#FECACA]',
    neutral: 'bg-academic-cream-subtle text-academic-slate border border-academic-border',
    rose: 'bg-academic-roseGold/15 text-[#915B61] border border-academic-roseGold/30',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  const dotColors = {
    navy: 'bg-academic-navy',
    gold: 'bg-academic-gold',
    success: 'bg-academic-status-success',
    warning: 'bg-academic-status-warning',
    danger: 'bg-academic-status-danger',
    neutral: 'bg-academic-slate',
    rose: 'bg-academic-roseGold',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {hasDot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
