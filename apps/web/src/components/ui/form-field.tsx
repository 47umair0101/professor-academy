import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  required,
  htmlFor,
  className,
  children,
}) => {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-xs font-semibold uppercase tracking-wider text-academic-slate flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-academic-status-danger ml-1">*</span>}
          </span>
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-academic-muted">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-academic-status-danger flex items-center gap-1 font-medium mt-0.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
