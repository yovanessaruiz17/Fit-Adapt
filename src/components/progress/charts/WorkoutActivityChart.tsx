/**
 * FitAdapt - Gráfico de Actividad y Minutos Entrenados
 * FASE 8: Sistema de Progreso Personal
 * 
 * Principios:
 * - Gráfico de barras accesible, legible y responsive
 * - Soporta 0 datos, 1 dato o múltiples semanas
 * - Indicadores visuales claros de sesiones y minutos
 */

import React, { useState } from 'react';
import { Clock, Calendar, TrendingUp } from 'lucide-react';
import { Badge } from '../../ui/Badge';

export interface WorkoutActivityChartProps {
  weeksData: Array<{
    weekLabel: string;
    count: number;
    minutes: number;
  }>;
  totalMinutes: number;
  totalWorkouts: number;
}

export function WorkoutActivityChart({
  weeksData,
  totalMinutes,
  totalWorkouts,
}: WorkoutActivityChartProps) {
  const [activeMetric, setActiveMetric] = useState<'MINUTES' | 'SESSIONS'>('MINUTES');

  if (weeksData.length === 0 || totalWorkouts === 0) {
    return (
      <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-center space-y-2">
        <Clock className="w-8 h-8 text-zinc-400 mx-auto" />
        <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
          Sin actividad registrada aún
        </h4>
        <p className="text-xs text-zinc-500 max-w-xs mx-auto">
          Completa tus primeras sesiones para visualizar el volumen semanal de entrenamiento acumulado.
        </p>
      </div>
    );
  }

  const maxVal = Math.max(
    ...weeksData.map((w) => (activeMetric === 'MINUTES' ? w.minutes : w.count)),
    activeMetric === 'MINUTES' ? 60 : 4
  );

  return (
    <div className="space-y-4">
      {/* Selector de métrica */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMetric('MINUTES')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              activeMetric === 'MINUTES'
                ? 'bg-teal-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
            }`}
          >
            Minutos
          </button>
          <button
            onClick={() => setActiveMetric('SESSIONS')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              activeMetric === 'SESSIONS'
                ? 'bg-teal-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
            }`}
          >
            Sesiones
          </button>
        </div>

        <span className="text-xs text-zinc-500 font-medium">
          {activeMetric === 'MINUTES'
            ? `${totalMinutes} min totales`
            : `${totalWorkouts} sesiones totales`}
        </span>
      </div>

      {/* Gráfico de barras responsive */}
      <div className="pt-2">
        <div className="grid grid-cols-4 gap-3 items-end h-36 px-2">
          {weeksData.map((item, idx) => {
            const val = activeMetric === 'MINUTES' ? item.minutes : item.count;
            const heightPercent = val > 0 ? Math.max(12, (val / maxVal) * 100) : 6;
            const isCurrentWeek = idx === weeksData.length - 1;

            return (
              <div
                key={item.weekLabel}
                className="flex flex-col items-center gap-2 h-full justify-end group"
              >
                <span className="text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-300">
                  {activeMetric === 'MINUTES' ? `${val}m` : `${val}`}
                </span>

                <div
                  className={`w-full max-w-[48px] rounded-t-xl transition-all duration-500 ${
                    isCurrentWeek
                      ? 'bg-teal-600 dark:bg-teal-500 shadow-sm'
                      : 'bg-teal-200/80 dark:bg-teal-900/60 hover:bg-teal-300 dark:hover:bg-teal-800'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  {item.weekLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <span>Distribución por semanas</span>
        <span>Columna más oscura: semana en curso</span>
      </div>
    </div>
  );
}
