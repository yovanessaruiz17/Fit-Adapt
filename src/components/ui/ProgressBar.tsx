/**
 * FitAdapt - Barra de Progreso Accesible
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 a 100
  label?: string;
  showValueText?: boolean;
  color?: 'teal' | 'emerald' | 'amber' | 'rose';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  value,
  label,
  showValueText = true,
  color = 'teal',
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClasses = {
    teal: 'bg-teal-600 dark:bg-teal-500',
    emerald: 'bg-emerald-600 dark:bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showValueText) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {label}
            </span>
          )}
          {showValueText && (
            <span className="font-mono text-zinc-500 dark:text-zinc-400 font-medium">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden ${heightClasses[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
