/**
 * FitAdapt - Card Reutilizable con Jerarquía Visual
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  elevation?: 'flat' | 'raised' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function Card({
  children,
  interactive = false,
  elevation = 'raised',
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-8',
  };

  const elevationClasses = {
    flat: 'bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800',
    raised:
      'bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:shadow-sm dark:shadow-none',
    bordered:
      'bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800',
  };

  const interactiveClasses = interactive
    ? 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-500/50 dark:hover:border-teal-500/50 active:translate-y-0'
    : '';

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-colors ${elevationClasses[elevation]} ${paddingClasses[padding]} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = '',
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-3 mb-3 ${className}`}>
      <div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs ${className}`}>
      {children}
    </div>
  );
}
