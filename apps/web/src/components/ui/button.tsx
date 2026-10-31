import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dark' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg active:scale-[0.99]';

    const variants = {
      primary:
        'bg-brand-indigo text-white hover:bg-brand-indigoHover shadow-subtle hover:shadow-card',
      dark:
        'bg-brand-primary text-white hover:bg-brand-primaryHover shadow-subtle',
      secondary:
        'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-subtle',
      outline:
        'bg-transparent text-brand-indigo border border-brand-indigo/40 hover:bg-brand-indigoSurface hover:border-brand-indigo',
      ghost:
        'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900',
      danger:
        'bg-red-600 text-white hover:bg-red-700 shadow-subtle',
    };

    const sizes = {
      sm: 'text-xs h-8 px-3 gap-1.5 font-medium',
      md: 'text-sm h-10 px-4 gap-2 font-medium',
      lg: 'text-base h-11 px-5 gap-2.5 font-semibold',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
