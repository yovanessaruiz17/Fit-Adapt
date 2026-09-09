/**
 * FitAdapt - Checkbox Reutilizable Accesible
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, checked, id, className = '', disabled, ...props }, ref) => {
    const inputId = id || (typeof label === 'string' ? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <label
        htmlFor={inputId}
        className={`flex items-start gap-3 cursor-pointer select-none group min-h-[44px] py-1 ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        } ${className}`}
      >
        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div className="w-5 h-5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 transition-all peer-checked:bg-teal-600 peer-checked:border-teal-600 dark:peer-checked:bg-teal-500 dark:peer-checked:border-teal-500 peer-focus-visible:ring-2 peer-focus-visible:ring-teal-500/30 group-hover:border-zinc-400 dark:group-hover:border-zinc-600 flex items-center justify-center">
            {checked && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
            {label}
          </span>
          {description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
