import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean | string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full appearance-none rounded-academic bg-white px-3.5 py-2 pr-9 text-sm text-academic-charcoal border transition-colors duration-150',
            'border-academic-border focus:border-academic-gold focus:ring-1 focus:ring-academic-gold focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-academic-cream-subtle disabled:opacity-70',
            error && 'border-academic-status-danger focus:border-academic-status-danger focus:ring-academic-status-danger',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-academic-slate">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
