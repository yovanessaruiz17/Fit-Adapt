/**
 * FitAdapt - Estado Vacío (Empty State)
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`p-8 text-center flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 ${className}`}
    >
      {icon && (
        <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 mb-3.5 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
        {title}
      </h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
