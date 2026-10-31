import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-academic-slate">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full rounded-academic bg-white px-3.5 py-2 text-sm text-academic-charcoal placeholder:text-academic-muted border transition-colors duration-150',
            'border-academic-border focus:border-academic-gold focus:ring-1 focus:ring-academic-gold focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-academic-cream-subtle disabled:opacity-70',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-academic-status-danger focus:border-academic-status-danger focus:ring-academic-status-danger',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-academic-slate">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
