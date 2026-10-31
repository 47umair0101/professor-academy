import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean | string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          'flex min-h-[90px] w-full rounded-lg bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 border transition-all duration-150',
          'border-slate-200 focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 focus:outline-none shadow-sm',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
