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
          'flex min-h-[90px] w-full rounded-academic bg-white px-3.5 py-2.5 text-sm text-academic-charcoal placeholder:text-academic-muted border transition-colors duration-150',
          'border-academic-border focus:border-academic-gold focus:ring-1 focus:ring-academic-gold focus:outline-none',
          'disabled:cursor-not-allowed disabled:bg-academic-cream-subtle disabled:opacity-70',
          error && 'border-academic-status-danger focus:border-academic-status-danger focus:ring-academic-status-danger',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
