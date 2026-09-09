/**
 * FitAdapt - Input Reutilizable Accesible
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, id, className = '', ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const hasError = Boolean(error);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={`w-full text-sm rounded-xl border transition-all duration-150 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 min-h-[44px] py-2.5 ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } ${rightIcon ? 'pr-10' : 'pr-3.5'} ${
              hasError
                ? 'border-rose-300 dark:border-rose-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
            } placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none disabled:opacity-50 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-zinc-400 dark:text-zinc-500 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {hasError ? (
          <p id={`${inputId}-error`} className="text-xs text-rose-600 dark:text-rose-400 mt-1">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
