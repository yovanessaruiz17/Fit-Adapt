/**
 * FitAdapt - Botón Reutilizable Accesible
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'wellness';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Dimensiones y touch targets mínimos de 44px
    const sizeClasses = {
      sm: 'text-xs px-3.5 py-2 min-h-[38px] gap-1.5 rounded-lg',
      md: 'text-sm px-4 py-2.5 min-h-[44px] gap-2 rounded-xl',
      lg: 'text-base px-5 py-3 min-h-[48px] gap-2.5 rounded-xl font-semibold',
    };

    // Variantes cromáticas adaptables a Dark/Light
    const variantClasses = {
      primary:
        'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-xs focus-visible:ring-teal-500 dark:bg-teal-500 dark:hover:bg-teal-600 dark:text-zinc-950 font-medium',
      secondary:
        'bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 font-medium',
      outline:
        'border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 active:bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 font-medium',
      ghost:
        'bg-transparent hover:bg-zinc-100 active:bg-zinc-200 text-zinc-700 dark:hover:bg-zinc-800 dark:text-zinc-300 font-medium',
      danger:
        'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs focus-visible:ring-rose-500 font-medium',
      wellness:
        'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs focus-visible:ring-emerald-500 font-medium',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 ${
          sizeClasses[size]
        } ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span className="whitespace-nowrap">{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
