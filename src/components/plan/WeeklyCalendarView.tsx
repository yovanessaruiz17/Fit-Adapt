/**
 * FitAdapt - Vista Semanal del Calendario de Entrenamientos
 * FASE 7: Estados UPCOMING, TODAY, COMPLETED, MISSED, REST
 */

import React from 'react';
import {
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Play,
  ArrowRight,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { WorkoutPlanDay, CalendarDayStatus, Workout } from '../../types/workout';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface WeeklyCalendarViewProps {
  schedule: WorkoutPlanDay[];
  onSelectWorkout: (workout: Workout) => void;
  onStartActiveWorkout: (workout: Workout) => void;
}

const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export function WeeklyCalendarView({
  schedule,
  onSelectWorkout,
  onStartActiveWorkout,
}: WeeklyCalendarViewProps) {
  // Configuración de badges y colores por estado
  const getStatusBadge = (status: CalendarDayStatus | undefined) => {
    switch (status) {
      case 'TODAY':
        return (
          <Badge variant="teal" icon={<Flame className="w-3 h-3 text-teal-500 fill-current" />}>
            HOY
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge variant="emerald" icon={<CheckCircle2 className="w-3 h-3 text-emerald-500" />}>
            COMPLETADO
          </Badge>
        );
      case 'MISSED':
        return (
          <Badge variant="warning" icon={<AlertCircle className="w-3 h-3 text-amber-500" />}>
            PENDIENTE
          </Badge>
        );
      case 'REST':
        return (
          <Badge variant="neutral" icon={<Coffee className="w-3 h-3 text-zinc-400" />}>
            DESCANSO
          </Badge>
        );
      case 'UPCOMING':
      default:
        return (
          <Badge variant="neutral" icon={<Clock className="w-3 h-3 text-zinc-400" />}>
            PROGRAMADO
          </Badge>
        );
    }
  };

  return (
    <div id="weekly-calendar-schedule-view" className="space-y-3">
      {schedule.map((day, idx) => {
        const dayLabel = dayNames[day.dayOfWeek - 1] || `Día ${day.dayOfWeek}`;
        const isToday = day.status === 'TODAY';
        const isRest = day.isRestDay || day.status === 'REST';

        return (
          <div
            key={idx}
            id={`calendar-day-row-${day.dayOfWeek}`}
            className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              isToday
                ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-500/80 ring-1 ring-teal-500/40 shadow-xs'
                : isRest
                ? 'bg-zinc-50/60 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 opacity-80'
                : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Información del Día */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                    {dayLabel}
                  </span>
                  {day.date && (
                    <span className="text-xs text-zinc-400 font-mono">
                      {new Date(day.date + 'T00:00:00').toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  )}
                  {getStatusBadge(day.status)}
                </div>

                {isRest ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Día de recuperación muscular y regeneración articular sin estrés de carga.
                  </p>
                ) : (
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {day.workout?.title || `${day.focusArea} (${day.durationMinutes} min)`}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        {day.durationMinutes || 30} min
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        {day.goal || 'General'}
                      </span>
                      <span>•</span>
                      <span>{day.focusArea}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de Acción para días activos */}
              {!isRest && day.workout && (
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectWorkout(day.workout!)}
                    className="text-xs font-semibold"
                  >
                    Ver rutina
                  </Button>

                  <Button
                    variant={isToday ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onStartActiveWorkout(day.workout!)}
                    className="text-xs font-bold shadow-xs min-h-[38px]"
                  >
                    <Play className="w-3.5 h-3.5 mr-1 fill-current" />
                    {isToday ? 'Entrenar hoy' : 'Comenzar'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
