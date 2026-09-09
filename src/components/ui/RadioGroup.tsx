/**
 * FitAdapt - Radio Group Reutilizable Accesible
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
}

export interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  label?: string;
  className?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  label,
  className = '',
}: RadioGroupProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <span className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-1">
          {label}
        </span>
      )}
      <div className="space-y-2">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          const radioId = `${name}-${opt.value}`;

          return (
            <label
              key={opt.value}
              htmlFor={radioId}
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer min-h-[44px] ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/50 dark:border-teal-500 dark:bg-teal-950/20 ring-1 ring-teal-600 dark:ring-teal-500'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                <input
                  type="radio"
                  id={radioId}
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  onChange={() => onChange(opt.value)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 peer-checked:border-teal-600 dark:peer-checked:border-teal-500 peer-focus-visible:ring-2 peer-focus-visible:ring-teal-500/30 flex items-center justify-center">
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-600 dark:bg-teal-500" />
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {opt.label}
                  </span>
                  {opt.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {opt.badge}
                    </span>
                  )}
                </div>
                {opt.description && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {opt.description}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
