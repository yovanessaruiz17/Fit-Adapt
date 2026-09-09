/**
 * FitAdapt - Desglose de Entrenamientos por Objetivo y Tipo
 * FASE 8: Sistema de Progreso Personal
 */

import React, { useState } from 'react';
import { Target, Layers, PieChart } from 'lucide-react';
import { ProgressBar } from '../../ui/ProgressBar';

export interface CategoryBreakdownChartProps {
  workoutsByGoal: Record<string, number>;
  workoutsByType: Record<string, number>;
  totalCompleted: number;
}

export function CategoryBreakdownChart({
  workoutsByGoal,
  workoutsByType,
  totalCompleted,
}: CategoryBreakdownChartProps) {
  const [tab, setTab] = useState<'TYPE' | 'GOAL'>('TYPE');

  const goalEntries = Object.entries(workoutsByGoal);
  const typeEntries = Object.entries(workoutsByType);

  return (
    <div className="space-y-4">
      {/* Selector de tipo o meta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80">
          <button
            onClick={() => setTab('TYPE')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'TYPE'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Por Tipo Muscular
          </button>
          <button
            onClick={() => setTab('GOAL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'GOAL'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Por Objetivo
          </button>
        </div>

        <span className="text-xs text-zinc-500">
          {totalCompleted} sesiones finalizadas
        </span>
      </div>

      {/* Lista de Barras de Distribución */}
      <div className="space-y-3 pt-1">
        {tab === 'TYPE' ? (
          typeEntries.map(([typeName, count]) => {
            const percentage = totalCompleted > 0 ? Math.round((count / totalCompleted) * 100) : 0;
            return (
              <div key={typeName} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {typeName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 font-mono text-[11px]">
                      {count} {count === 1 ? 'sesión' : 'sesiones'}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 w-8 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={percentage}
                  color="teal"
                  size="sm"
                  showValueText={false}
                />
              </div>
            );
          })
        ) : (
          goalEntries.map(([goalName, count]) => {
            const percentage = totalCompleted > 0 ? Math.round((count / totalCompleted) * 100) : 0;
            return (
              <div key={goalName} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {goalName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 font-mono text-[11px]">
                      {count} {count === 1 ? 'sesión' : 'sesiones'}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 w-8 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={percentage}
                  color="emerald"
                  size="sm"
                  showValueText={false}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
