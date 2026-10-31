import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'secondary' | 'outline' | 'ghost' | 'danger';
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
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academic-gold focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none rounded-academic';

    const variants = {
      primary:
        'bg-academic-navy text-white hover:bg-academic-navy-deep active:bg-[#0c1229] shadow-subtle',
      gold:
        'bg-academic-gold text-white hover:bg-academic-gold-hover active:bg-[#8f6d17] shadow-subtle',
      secondary:
        'bg-white text-academic-charcoal border border-academic-border hover:bg-academic-cream-subtle hover:border-academic-border-dark active:bg-[#eae8e0]',
      outline:
        'bg-transparent text-academic-navy border border-academic-navy/30 hover:bg-academic-navy/5 hover:border-academic-navy active:bg-academic-navy/10',
      ghost:
        'bg-transparent text-academic-charcoal hover:bg-academic-cream-subtle hover:text-academic-navy active:bg-[#eae8e0]',
      danger:
        'bg-academic-status-danger text-white hover:bg-[#991B1B] active:bg-[#7F1D1D] shadow-subtle',
    };

    const sizes = {
      sm: 'text-xs h-8 px-3 gap-1.5',
      md: 'text-sm h-10 px-4 gap-2',
      lg: 'text-base h-12 px-6 gap-2.5 font-semibold',
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
