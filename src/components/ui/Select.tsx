/**
 * FitAdapt - Select Reutilizable Accesible
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, options, id, className = '', ...props }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const hasError = Boolean(error);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            className={`w-full appearance-none text-sm rounded-xl border transition-all duration-150 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 min-h-[44px] py-2.5 pl-3.5 pr-10 cursor-pointer ${
              hasError
                ? 'border-rose-300 dark:border-rose-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
            } focus:outline-none disabled:opacity-50 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none flex items-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {hasError ? (
          <p id={`${selectId}-error`} className="text-xs text-rose-600 dark:text-rose-400 mt-1">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${selectId}-helper`} className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
