/**
 * FitAdapt - Estados de Carga y Error Reutilizables
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';
import { AlertCircle, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from './Button';

export function LoadingState({
  label = 'Cargando información adaptativa...',
  count = 3,
}: {
  label?: string;
  count?: number;
}) {
  return (
    <div className="space-y-3 w-full py-4">
      <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 py-2">
        <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-teal-400" />
        <span>{label}</span>
      </div>

      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full w-16" />
            </div>
            <div className="h-3 bg-zinc-100 dark:bg-zinc-800/60 rounded-md w-3/4" />
            <div className="h-3 bg-zinc-100 dark:bg-zinc-800/60 rounded-md w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorState({
  title = 'No se pudo cargar la información',
  description = 'Ocurrió un problema temporal. Puedes reintentar o verificar tu conexión.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-center flex flex-col items-center justify-center">
      <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
        {title}
      </h4>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reintentar
        </Button>
      )}
    </div>
  );
}
